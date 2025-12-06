// src/pages/timetable/TimetableDetailPage.tsx (Alert 및 모달 기능 완전히 제거)

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom"; 
import leftarrow from "../../assets/timetable/arrow-left.svg";
import downarrow from "../../assets/timetable/arrow-down.svg";
import download from "../../assets/timetable/download.svg";
import refresh from "../../assets/timetable/refresh.svg";
import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css";
import TimetableGrid from "../../components/timetable/TimetableGrid"; 
import api from "../../api/api"; // Axios 인스턴스

// ⭐️ 시간 객체 타입 (공통 사용) ⭐️
interface TimeObject {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}


// ⭐️ Kopis API 응답 타입 (기본 공연 정보) ⭐️
export interface KopisFestivalItem {
   id: number; 
  mt20id: string; 
  prfnm: string; 
  prfpdfrom: string; 
  prfpdto: string; 
  fcltynm: string; 
  prfruntime: string; 
  prfage: string; 
  pcseguidance: string; 
  poster: string; 
  prfstate: string; 
  dtguidance: string; 
  tkstdate: string; 
  tksttime: TimeObject;
  typeofcon: number;
  newstate: boolean;
  locationUrl: string;
  styurls: { relatenm: string; relateurl: string; }[];
  relates: { relatenm: string; relateurl: string; }[];
  days: { date: string; open: TimeObject; close: TimeObject; }[]; // Kopis days 타입
  slots: { date: string; stageId: string; stageName: string; stageOrder: number; artist: string; start: TimeObject; end: TimeObject; minutes: number; img: string; note: string; }[]; // Kopis slots 타입
  fesLinks: { relatenm: string; relateurl: string; }[];
  artistPics: { date: string; relatenm: string; url: string; }[];
}

// ⭐️ 서버의 /festivals/{mt20id}/my-detail 응답 타입 정의 ⭐️
export interface CustomDetailAPIItem {
    mt20id: string; 
    prfnm: string; 
    prfpdfrom: string; 
    prfpdto: string; 
    fcltynm: string; 
    locationUrl: string;
    hasCustom: boolean; // 커스텀 내역 존재 여부
    days: { date: string; open: TimeObject; close: TimeObject; }[]; // my-detail days 타입
    slots: { 
        date: string; 
        stageId: string; 
        stageName: string; 
        stageOrder: number; 
        artist: string; 
        start: TimeObject | string; 
        end: TimeObject | string; 
        minutes: number; 
        img: string | null; 
        note: string | null; 
        inverted?: boolean; // 사용자가 선택했는지 여부
    }[];
    artistPics: { date: string; relatenm: string; url: string; }[];
}

export interface ScheduleItem { 
  date: string; stageId: string; stageName: string; stageOrder: number; 
  artist: string; start: string; end: string; minutes: number; 
  img: string | null; note: string | null; isCustomized?: boolean; 
}
interface DayScheduleData { date: string; schedules: ScheduleItem[]; }

interface FestivalDetailData { 
    festivalId: number; 
    mt20id: string; // API 응답에서 받은 고유 ID
    festivalTitle: string; 
    days: DayScheduleData[]; 
}

const createScheduleKey = (s: ScheduleItem) => `${s.date}-${s.stageId}-${s.artist}-${s.start}`;

const formatDayAndDayOfWeek = (dateString: string): string => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekdays[date.getDay()];
    return `${month}.${day}(${dayOfWeek})`;
};

type TimetableMode = 'customize' | 'my' | 'view'; 

// ⭐️ TimeObject 또는 string을 "HH:MM:SS" 문자열로 변환하는 헬퍼 함수 ⭐️
const timeToTimeString = (time: any): string => {
    if (typeof time === 'string') return time;
    const hour = time?.hour ?? 0;
    const minute = time?.minute ?? 0;
    return `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}:00`;
};


// ⭐️ 1. Kopis API 호출 및 데이터 변환 함수 (기본 데이터 로드) ⭐️
async function fetchAndProcessTimetableDetail(
    festivalId: string | undefined, 
    setCurrentDayIndex: (index: number) => void, 
    setDetailData: (data: FestivalDetailData | null) => void, 
    setIsLoading: (loading: boolean) => void
): Promise<FestivalDetailData | null> {
    if (!festivalId) { 
        console.log("❌ festivalId가 없습니다.");
        setIsLoading(false); 
        return null;
    }

    setIsLoading(true);
    const idNum = parseInt(festivalId, 10);
    let processedData: FestivalDetailData | null = null;
    
    try {
        // Kopis API 엔드포인트 사용 (기본 데이터 구조 로드)
        const response = await api.get(`/kopis/performances/festivals?festivalId=${idNum}`); 
        
        const rawData = response.data.data || response.data;
        const apiData: KopisFestivalItem | undefined = Array.isArray(rawData)
            ? rawData.find(f => f.id === idNum) || rawData[0] 
            : rawData;

        if (!apiData || !apiData.prfnm || (apiData.slots || []).length === 0) {
            console.error(`⚠️ festivalId ${festivalId}에 해당하는 데이터가 없거나 필수 필드가 누락되었습니다.`);
            setDetailData(null);
            setIsLoading(false);
            return null;
        }
        
        const mt20idValue = apiData.mt20id || festivalId;

        const schedulesByDateMap: Record<string, ScheduleItem[]> = {};

        apiData.slots.forEach(slot => {
            const dateString = slot.date;

            const scheduleItem: ScheduleItem = {
                date: slot.date,
                stageId: slot.stageId,
                stageName: slot.stageName,
                stageOrder: slot.stageOrder, 
                artist: slot.artist,
                start: timeToTimeString(slot.start), // 헬퍼 함수 사용
                end: timeToTimeString(slot.end),     // 헬퍼 함수 사용
                minutes: slot.minutes,
                img: slot.img || null,
                note: slot.note || null,
                isCustomized: false
            };

            if (!schedulesByDateMap[dateString]) schedulesByDateMap[dateString] = [];
            schedulesByDateMap[dateString].push(scheduleItem);
        });

        const processedDays: DayScheduleData[] = Object.keys(schedulesByDateMap)
            .sort()
            .map(date => ({ date, schedules: schedulesByDateMap[date] }));

        processedData = {
            festivalId: idNum,
            mt20id: mt20idValue,
            festivalTitle: apiData.prfnm,
            days: processedDays
        };
        
        setDetailData(processedData);
        if (processedData.days.length > 0) setCurrentDayIndex(0);

    } catch (error) {
        console.error(`❌ 페스티벌 ID ${festivalId} 데이터를 불러오는 중 오류 발생:`, error);
        setDetailData(null);
    } finally { 
        setIsLoading(false); 
    }
    return processedData;
}

// ⭐️ 2. 사용자 커스텀 슬롯만 가져오는 함수 (my-detail API 사용) ⭐️
async function fetchCustomSlots(
    mt20id: string,
    setActiveScheduleKeys: (keys: Set<string>) => void
): Promise<void> {
    const API_URL = `/festivals/${mt20id}/my-detail`; 
    
    try {
        const response = await api.get(API_URL);
        const apiData: CustomDetailAPIItem = response.data.data || response.data; 
        
        const initialActiveKeys = new Set<string>();

        if (apiData.hasCustom && Array.isArray(apiData.slots)) {
            apiData.slots.forEach(slot => {
                const startString = timeToTimeString(slot.start); // 헬퍼 함수 사용
                
                if (slot.inverted === true) {
                     if (slot.artist) {
                         const scheduleKey = `${slot.date}-${slot.stageId}-${slot.artist}-${startString}`;
                         initialActiveKeys.add(scheduleKey);
                     }
                }
            });
        }
        
        setActiveScheduleKeys(initialActiveKeys);
        console.log(`✅ [GET ${API_URL}] 사용자 커스텀 슬롯 로드 성공. ${initialActiveKeys.size}개 활성화.`);

    } catch (error) {
        console.error(`❌ 사용자 커스텀 슬롯 (${API_URL}) 로드 중 오류 발생:`, error);
        setActiveScheduleKeys(new Set()); 
    }
}


export default function TimetableDetailPage() {
    const navigate = useNavigate();
    const location: Location<FestivalDetailData> = useLocation(); 
    const { id: festivalId } = useParams<{ id: string }>(); 

    const [detailData, setDetailData] = useState<FestivalDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDayIndex, setCurrentDayIndex] = useState(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [activeScheduleKeys, setActiveScheduleKeys] = useState<Set<string>>(new Set());
    
    const handleScheduleToggle = (schedule: ScheduleItem) => {
        const key = createScheduleKey(schedule);
        
        const newStateIsActive = !activeScheduleKeys.has(key); 

        setActiveScheduleKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key); 
            } else {
                newSet.add(key); 
            }
            return newSet;
        });
        
        console.log("--- Schedule Toggled ---");
        console.log("Artist:", schedule.artist);
        console.log("Inverted/Selected (New State):", newStateIsActive); 
        console.log("------------------------");
    };


    const currentMode: TimetableMode = useMemo(() => {
        if (location.pathname.includes('/my/')) return 'my';
        if (location.pathname.includes('/customize/')) return 'customize';
        return 'view'; 
    }, [location.pathname]);
    
    const getPayloadAndCheckSelection = (): { payload: { mt20id: string; invertedSlots: any[] } | null, hasSelections: boolean } => {
        if (!detailData || !detailData.mt20id) return { payload: null, hasSelections: false };
        
        let allFestivalSchedules: ScheduleItem[] = [];
        detailData.days.forEach(day => {
            allFestivalSchedules = allFestivalSchedules.concat(day.schedules);
        });
        
        const invertedSlots: any[] = [];
        let finalHasSelections = false;

        allFestivalSchedules.forEach(schedule => {
            const key = createScheduleKey(schedule);
            const isInverted = activeScheduleKeys.has(key); 
            
            if (isInverted) {
                finalHasSelections = true; // 하나라도 선택되면 true
                
                invertedSlots.push({
                    date: schedule.date,
                    stageOrder: Number(schedule.stageOrder), 
                    artist: schedule.artist,
                    inverted: isInverted 
                });
            }
        });
        
        const payload: { mt20id: string; invertedSlots: any[] } = {
            mt20id: detailData.mt20id, 
            invertedSlots: invertedSlots 
        };
        
        return { payload, hasSelections: finalHasSelections };
    };

    const allSchedules = useMemo(() => {
        if (!detailData || currentDayIndex === -1 || !detailData.days[currentDayIndex]) return [];
        return detailData.days[currentDayIndex].schedules;
    }, [detailData, currentDayIndex]);

    const schedulesByStage = useMemo(() => {
        const stageMap: Record<string, ScheduleItem[]> = {};
        allSchedules.forEach(s => {
            if (!stageMap[s.stageName]) stageMap[s.stageName] = [];
            stageMap[s.stageName].push(s);
        });
        
        const uniqueStages = Array.from(new Set(allSchedules.map(s => JSON.stringify({ name: s.stageName, order: s.stageOrder }))));
        const sortedStages = uniqueStages.map(s => JSON.parse(s)).sort((a, b) => a.order - b.order);
        const stageNames: Record<string, string> = {}; 
        sortedStages.forEach((stage, idx) => { stageNames[idx+''] = stage.name; });
        
        return { stageMap, stageNames };
    }, [allSchedules]);


    // ⭐️ 1. Kopis API 호출 (기본 데이터 로드) ⭐️
    useEffect(() => {
        if (festivalId) {
            fetchAndProcessTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
        } else {
             setIsLoading(false);
             setDetailData(null); 
        }
    }, [festivalId]);
    
    // ⭐️ 2. detailData 로드 후, 커스텀 슬롯 API 호출 ⭐️
    useEffect(() => {
        if (detailData && detailData.mt20id && (currentMode === 'my' || currentMode === 'customize')) { 
            fetchCustomSlots(detailData.mt20id, setActiveScheduleKeys);
        } else if (currentMode === 'view') {
            setActiveScheduleKeys(new Set());
        }
    }, [detailData, currentMode]); 

    // ⭐️⭐️ [Alert 제거] 저장/삭제 성공 메시지를 console.log로 대체 ⭐️⭐️
    const saveTimetableData = async (): Promise<boolean> => { 
        
        const { payload, hasSelections } = getPayloadAndCheckSelection(); 

        if (!payload || !payload.mt20id) {
            console.error("⚠️ 저장할 데이터가 준비되지 않았습니다. (mt20id 누락)");
            return false;
        }
        
        const mt20id = payload.mt20id;
        const API_ENDPOINT = `/festivals/${mt20id}/custom-slots`; 
        const HTTP_METHOD = 'POST'; 

        if (!hasSelections) {
             console.log("ℹ️ 선택된 스케줄이 없어, 커스텀 슬롯 삭제 요청을 서버에 보냅니다. (빈 배열 POST)");
        } else {
            console.log(`💾 ${payload.invertedSlots.length}개 슬롯 저장 요청을 보냅니다.`);
        }

        try {
            const response = await api.post(API_ENDPOINT, payload); 

            // ⚠️ 성공 메시지를 console.log로 대체
            const successMessage = hasSelections 
                ? "나의 타임테이블이 성공적으로 서버에 저장되었습니다. 🥳" 
                : "나의 타임테이블이 성공적으로 서버에서 삭제되었습니다. 🗑️";
                
            console.log(`✅ 타임테이블 저장/삭제 성공 (${HTTP_METHOD} ${API_ENDPOINT}):`, successMessage, response.data);
            return true;

        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "알 수 없는 오류가 발생했습니다.";
            
            // ⚠️ 실패 메시지를 console.error로 대체
            console.error(`❌ 타임테이블 저장/삭제 실패 (${HTTP_METHOD} ${API_ENDPOINT}):`, errorMessage, error); 
            return false;
        }
    };
    
    // 뒤로 가기 버튼 클릭 시 저장 로직이 포함된 handleGoBack 연결
    const handleGoBack = async () => {
        if (currentMode === 'customize' || currentMode === 'my') { 
            const saveSuccessful = await saveTimetableData();
             if (saveSuccessful) {
                navigate(-1);
            } else {
                // 저장 실패 시 사용자에게 알림 없이 콘솔에만 기록하고 이동 취소
                console.log("저장 실패로 인해 페이지 이동을 취소합니다.");
            }
        } else {
             navigate(-1);
        }
    };
    
    const handleRefresh = () => {
        console.log("🔄 Refreshing data from API.");
        setCurrentDayIndex(-1); 
        setIsDropdownOpen(false);
        setActiveScheduleKeys(new Set()); 
        if (festivalId) fetchAndProcessTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
        else { setDetailData(null); setIsLoading(false); }
    };
    
    const handleDaySelect = (index: number) => { 
        setCurrentDayIndex(index); 
        setIsDropdownOpen(false); 
    };

    if (isLoading) return <div className={timetableStyles.pageContainer}>데이터를 불러오는 중입니다...</div>;
    if (!detailData || detailData.days.length === 0 || !detailData.mt20id) return <div className={timetableStyles.pageContainer}>존재하지 않는 페스티벌이거나 데이터가 없습니다. (ID 누락 확인)</div>;
    if (currentDayIndex === -1 || !detailData.days[currentDayIndex]) return <div className={timetableStyles.pageContainer}>날짜 데이터를 준비 중입니다...</div>;

    const selectedDayData = detailData.days[currentDayIndex];
    const selectedDateFormatted = formatDayAndDayOfWeek(selectedDayData.date);
    const toggleButtonText = isDropdownOpen ? "날짜 선택" : selectedDateFormatted;
    const toggleClass = `${timetableStyles.dayDropdownToggle} ${isDropdownOpen ? timetableStyles.open : ''}`;
    const textClass = currentDayIndex !== -1 && !isDropdownOpen ? timetableStyles.fontSet : timetableStyles.placeholderText;

    return (
        <div className={timetableStyles.pageContainer}>
            <header className={timetableStyles.header}>
                <button className={timetableStyles.backButton} onClick={handleGoBack}>
                    <img src={leftarrow} alt="뒤로 가기" />
                </button>
                <h1 className={timetableStyles.pageTitle}>{detailData.festivalTitle}</h1>
                <div className={timetableStyles.emptyBox}></div>
            </header>

            <main className={timetableStyles.mainContent}>
                {detailData.days.length > 0 && (
                    <div className={timetableStyles.timetableControlBar}>
                        <div className={timetableStyles.dropdownWrapper}>
                            <button className={toggleClass} onClick={() => {if (detailData.days.length <= 1) return;setIsDropdownOpen(prev => !prev)}}>
                                <span className={textClass}>{toggleButtonText}</span>
                                <img src={downarrow} alt="드롭다운 화살표" className={isDropdownOpen ? timetableStyles.arrowOpen : timetableStyles.arrowClosed}/>
                            </button>
                            {isDropdownOpen && (
                                <ul className={timetableStyles.dayDropdownList}>
                                    {detailData.days.map((day, index) => (
                                        <li key={index} className={timetableStyles.dayDropdownItem}>
                                            <button className={`${timetableStyles.dayDropdownOption} ${index===currentDayIndex? timetableStyles.active:''}`} onClick={()=>handleDaySelect(index)}>
                                                <div className={timetableStyles.textSpace}>{formatDayAndDayOfWeek(day.date)}</div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={timetableStyles.actionButtonWrapper}>
                            {/* 저장 버튼은 기능이 뒤로 가기에 통합되었고, 모달/alert이 제거되었으므로 콘솔 로그만 남깁니다. */}
                            <button className={timetableStyles.actionButton} onClick={() => console.log("저장 기능이 뒤로 가기 버튼에 통합되었으며, 모든 알림 창이 제거되었습니다.")}>
                                <img src={download} alt="저장 기능" />
                            </button>
                            <button className={timetableStyles.actionButton} onClick={handleRefresh}>
                                <img src={refresh} alt="되돌리기"/>
                            </button>
                        </div>
                    </div>
                )}

                {currentDayIndex !== -1 && (
                <div className={timetableStyles.timetableScrollWrapper}><div className={timetableStyles.scheduleArea}>
                        <TimetableGrid 
                            stageMap={schedulesByStage.stageMap} 
                            allSchedules={allSchedules} 
                            mode={currentMode} 
                            onScheduleToggle={handleScheduleToggle}
                            activeScheduleKeys={activeScheduleKeys}
                        />
                    </div></div>
                    
                )}
                
            </main>
        </div>
    );
}