// src/pages/timetable/TimetableDetailPage.tsx

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

// ⭐️ Kopis API 응답 타입 ⭐️
export interface KopisFestivalItem {
   id: number; 
  mt20id: string; // <-- 이 값을 사용합니다.
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
  tksttime: { hour: number; minute: number; second: number; nano: number; };
  typeofcon: number;
  newstate: boolean;
  locationUrl: string;
  styurls: { relatenm: string; relateurl: string; }[];
  relates: { relatenm: string; relateurl: string; }[];
  days: { date: string; open: { hour: number; minute: number; second: number; nano: number; }; close: { hour: number; minute: number; second: number; nano: number; }; }[];
  slots: { date: string; stageId: string; stageName: string; stageOrder: number; artist: string; start: { hour: number; minute: number; second: number; nano: number; }; end: { hour: number; minute: number; second: number; nano: number; }; minutes: number; img: string; note: string; }[];
  fesLinks: { relatenm: string; relateurl: string; }[];
  artistPics: { date: string; relatenm: string; url: string; }[];
}
export interface ScheduleItem { 
  date: string; stageId: string; stageName: string; stageOrder: number; 
  artist: string; start: string; end: string; minutes: number; 
  img: string | null; note: string | null; isCustomized?: boolean; 
}
interface DayScheduleData { date: string; schedules: ScheduleItem[]; }
// ⭐️ mt20id 필드 추가
interface FestivalDetailData { 
    festivalId: number; 
    mt20id: string; // API 응답에서 받은 고유 ID
    festivalTitle: string; 
    days: DayScheduleData[]; 
}

// ⭐️ 스케줄 아이템의 고유 키를 생성하는 헬퍼 함수
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

// API 호출 및 데이터 변환 함수 
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
        
        // ⭐️ (추가) ⭐️ mt20id가 누락되었을 경우를 대비해 festivalId를 폴백으로 사용
        const mt20idValue = apiData.mt20id || festivalId;

        const schedulesByDateMap: Record<string, ScheduleItem[]> = {};

        apiData.slots.forEach(slot => {
            const dateString = slot.date;
            
            let startString = "00:00:00";
            let endString = "00:00:00";

            if (typeof slot.start === 'string') {
                startString = slot.start;
            } else if (slot.start && typeof slot.start === 'object') {
                const startHour = slot.start.hour ?? 0;
                const startMinute = slot.start.minute ?? 0;
                startString = `${startHour.toString().padStart(2,'0')}:${startMinute.toString().padStart(2,'0')}:00`;
            }
            
            if (typeof slot.end === 'string') {
                endString = slot.end;
            } else if (slot.end && typeof slot.end === 'object') {
                const endHour = slot.end.hour ?? 0;
                const endMinute = slot.end.minute ?? 0;
                endString = `${endHour.toString().padStart(2,'0')}:${endMinute.toString().padStart(2,'0')}:00`;
            }

            const scheduleItem: ScheduleItem = {
                date: slot.date,
                stageId: slot.stageId,
                stageName: slot.stageName,
                // 주의: slot.stageOrder는 이미 Number 타입으로 가정되지만, 아래에서 Number()로 한번 더 변환하여 안전성 확보
                stageOrder: slot.stageOrder, 
                artist: slot.artist,
                start: startString, 
                end: endString,     
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
            mt20id: mt20idValue, // ⭐️ API에서 가져온 mt20id 저장
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
        console.log("Date:", schedule.date);
        console.log("Artist:", schedule.artist);
        console.log("Stage Order:", schedule.stageOrder);
        console.log("Inverted/Selected (New State):", newStateIsActive); 
        console.log("------------------------");
    };

    const currentMode: TimetableMode = useMemo(() => {
        if (location.pathname.includes('/my/')) return 'my';
        if (location.pathname.includes('/customize/')) return 'customize';
        return 'view'; 
    }, [location.pathname]);
    
    // ⭐️ (userId 제거) 페이로드: mt20id와 invertedSlots만 포함 ⭐️
    const getPayloadAndCheckSelection = (): { payload: { mt20id: string; invertedSlots: any[] } | null, hasSelections: boolean } => {
        // detailData.mt20id가 없거나 데이터 준비가 안됐으면 저장 요청을 할 수 없음
        if (!detailData || currentDayIndex === -1 || !detailData.mt20id) return { payload: null, hasSelections: false };
        
        const currentDaySchedules = detailData.days[currentDayIndex]?.schedules || [];
        let hasSelections = false;

        // 1. 모든 스케줄을 매핑하여 inverted 상태를 포함한 슬롯 객체 생성
        const allSlots = currentDaySchedules.map(schedule => {
            const key = createScheduleKey(schedule);
            const isInverted = activeScheduleKeys.has(key); 
            
            if (isInverted) {
                hasSelections = true;
            }
            
            return {
                date: schedule.date,
                // ⭐️ stageOrder를 Number() 함수로 감싸서 확실히 숫자 타입으로 전송 (백엔드 타입 오류 방지) ⭐️
                stageOrder: Number(schedule.stageOrder), 
                artist: schedule.artist,
                inverted: isInverted 
            };
        });

        // 2. inverted: true 인 항목만 필터링하여 전송 
        const invertedSlots = allSlots.filter(slot => slot.inverted === true);
        
        // 필터링 후에도 선택된 항목이 있는지 다시 확인
        const finalHasSelections = invertedSlots.length > 0;
        
        // ⭐️ userId 필드 제거 ⭐️
        const payload: { mt20id: string; invertedSlots: any[] } = {
            mt20id: detailData.mt20id, 
            invertedSlots: invertedSlots
        };
        
        // 선택된 항목이 없으면 payload가 null은 아니지만, hasSelections가 false임을 반환
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

    useEffect(() => {
        if (festivalId) {
            fetchAndProcessTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
        } else {
             setIsLoading(false);
             setDetailData(null); 
        }
    }, [festivalId]);
    
    // ⭐️ 핵심 저장 로직. 성공/건너뛰면 true, 실패하면 false 반환
    const saveTimetableData = async (): Promise<boolean> => { 
        
        // ❌ userId 확보 및 검증 로직 완전히 제거 ❌
        
        const { payload, hasSelections } = getPayloadAndCheckSelection();

        // detailData.mt20id가 없거나 데이터 준비가 안됐으면 저장 요청 건너뛰기
        if (!payload) {
            console.log("⚠️ 저장할 데이터가 준비되지 않았습니다. (mt20id 누락 또는 데이터 로딩 문제)");
            return true;
        }
        
        if (!hasSelections) {
            console.log("ℹ️ 선택된 스케줄이 없어 서버에 저장 요청을 건너뜁니다.");
            return true; 
        }

        const mt20id = payload.mt20id;
        const API_ENDPOINT = `/festivals/${mt20id}/custom-slots`; 
        const HTTP_METHOD = 'POST'; 

        console.log(`💾 Final Payload Ready for ${HTTP_METHOD} to ${API_ENDPOINT}:`, payload);
        console.log('⭐️ RAW JSON STRING:', JSON.stringify(payload)); 

        try {
            // ⭐️⭐️ api.post 호출 시, userId 쿼리 파라미터 전달 로직 제거 ⭐️⭐️
            const response = await api.post(API_ENDPOINT, payload); 

            console.log(`✅ 타임테이블 저장 성공 (${HTTP_METHOD} ${API_ENDPOINT}):`, response.data);
            alert("나의 타임테이블이 성공적으로 서버에 저장되었습니다!");
            return true;

        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "알 수 없는 오류가 발생했습니다.";
            // ⭐️ 에러 발생 시 로그에서 userId 관련 정보 제거 ⭐️
            console.error(`❌ 타임테이블 저장 실패 (${HTTP_METHOD} ${API_ENDPOINT}):`, error); 
            alert(`타임테이블 저장 중 오류가 발생했습니다: ${errorMessage}`);
            return false;
        }
    };
    
    // ⭐️ 뒤로 가기 버튼 클릭 시 저장 로직이 포함된 handleGoBack 연결
    const handleGoBack = async () => {
        const saveSuccessful = await saveTimetableData();

        if (saveSuccessful) {
            navigate(-1);
        } else {
            console.log("저장 실패로 인해 페이지 이동을 취소합니다.");
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
    // detailData.mt20id도 확인
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
                {/* ⭐️ 뒤로 가기 버튼에 저장 로직이 포함된 handleGoBack 연결 */}
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
                            {/* 다운로드 버튼은 기능이 제거됨 */}
                            <button className={timetableStyles.actionButton} onClick={() => console.log("저장 기능이 뒤로 가기 버튼으로 이동했습니다.")}>
                                <img src={download} alt="저장 기능 제거됨"/>
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