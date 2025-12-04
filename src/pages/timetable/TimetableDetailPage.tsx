// src/pages/timetable/TimetableDetailPage.tsx (최종 수정 버전: 시간 타입 유연성 확보 및 상태 관리)

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom"; 
import leftarrow from "../../assets/timetable/arrow-left.svg";
import downarrow from "../../assets/timetable/arrow-down.svg";
import download from "../../assets/timetable/download.svg";
import refresh from "../../assets/timetable/refresh.svg";
import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css"; // 경로 확인 필요
import TimetableGrid from "../../components/timetable/TimetableGrid"; 
import api from "../../api/api"; 

// ⭐️ Kopis API 응답 타입 (start/end를 객체 또는 문자열로 받도록 수정) ⭐️
export interface KopisFestivalItem {
  id: number; 
  prfnm: string; 
  prfpdfrom: string; 
  prfpdto: string; 
  fcltynm: string; 
  days: { date: string; open: any; close: any; }[]; 
  slots: { 
    date: string; stageId: string; stageName: string; stageOrder: number; 
    artist: string; 
    // ⭐️ start와 end 필드를 객체이거나 문자열일 수 있도록 정의 ⭐️
    start: string | { hour: number; minute: number; second: number; nano: number; }; 
    end: string | { hour: number; minute: number; second: number; nano: number; }; 
    minutes: number; img: string | null; note: string | null; 
  }[];
}
export interface ScheduleItem { 
  date: string; stageId: string; stageName: string; stageOrder: number; 
  artist: string; start: string; end: string; minutes: number; 
  img: string | null; note: string | null; isCustomized?: boolean; 
}
interface DayScheduleData { date: string; schedules: ScheduleItem[]; }
interface FestivalDetailData { 
    festivalId: number; 
    festivalTitle: string; 
    days: DayScheduleData[]; 
}

// ⭐️ (추가) ⭐️ 스케줄 아이템의 고유 키를 생성하는 헬퍼 함수
// date, stageId, artist, start 시간을 조합하여 고유한 문자열을 만듭니다.
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
        
        console.log("📌 API 전체 응답:", response.data);

        const rawData = response.data.data || response.data;
        const apiData: KopisFestivalItem | undefined = Array.isArray(rawData)
            ? rawData.find(f => f.id === idNum) || rawData[0] // 배열일 경우 첫 번째 요소도 고려
            : rawData;

        if (!apiData) {
            console.error(`⚠️ festivalId ${festivalId}에 해당하는 데이터가 없습니다.`);
            setDetailData(null);
            setIsLoading(false);
            return null;
        }

        const slots = apiData.slots || [];

        if (!apiData.prfnm || slots.length === 0) { 
             console.error("⚠️ 필수 필드 누락 또는 slots 없음");
             setDetailData(null);
             setIsLoading(false);
             return null;
        }

        const schedulesByDateMap: Record<string, ScheduleItem[]> = {};

        slots.forEach(slot => {
            const dateString = slot.date;
            
            // ⭐️⭐️ 시간 포맷팅 로직 수정: 문자열과 객체 모두 처리 ⭐️⭐️
            let startString = "00:00:00";
            let endString = "00:00:00";

            // 1. start/end가 이미 문자열인 경우 (Main Page에서 본 유효한 형식)
            if (typeof slot.start === 'string') {
                startString = slot.start;
            } 
            // 2. start/end가 객체인 경우 (Detail Page의 인터페이스 형식)
            else if (slot.start && typeof slot.start === 'object') {
                const startHour = slot.start.hour ?? 0;
                const startMinute = slot.start.minute ?? 0;
                
                // **주의:** 여기서 hour/minute이 0이라면 "00:00:00"이 되며, 이는 서버 데이터 문제
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
                stageOrder: slot.stageOrder,
                artist: slot.artist,
                start: startString, // 수정된 문자열 사용
                end: endString,     // 수정된 문자열 사용
                minutes: slot.minutes,
                img: slot.img || null,
                note: slot.note || null,
                isCustomized: false
            };

            if (!schedulesByDateMap[dateString]) schedulesByDateMap[dateString] = [];
            schedulesByDateMap[dateString].push(scheduleItem);
        });

        console.log("📌 모든 ScheduleItem:", Object.values(schedulesByDateMap).flat().slice(0, 5)); // 상위 5개만 로그 출력

        const processedDays: DayScheduleData[] = Object.keys(schedulesByDateMap)
            .sort()
            .map(date => ({
                date,
                schedules: schedulesByDateMap[date]
            }));

        processedData = {
            festivalId: idNum,
            festivalTitle: apiData.prfnm,
            days: processedDays
        };
        
        console.log("✅ processedData:", processedData);

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

    // ⭐️ (추가) ⭐️ 선택된 스케줄을 추적하는 상태 (Set 사용)
    const [activeScheduleKeys, setActiveScheduleKeys] = useState<Set<string>>(new Set());
    
    // ⭐️ (수정/추가) ⭐️ 스케줄을 클릭했을 때 상태를 토글하는 함수
    const handleScheduleToggle = (schedule: ScheduleItem) => {
        const key = createScheduleKey(schedule);
        
        // ⭐️ (수정) ⭐️ const로 명확하게 선언하여 스코프 오류를 해결합니다.
        // 현재 상태를 기준으로 클릭 후의 예상 상태를 미리 계산합니다.
        const newStateIsActive = !activeScheduleKeys.has(key); 

        setActiveScheduleKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key); // 이미 선택되었으면 제거 (inverted: false)
            } else {
                newSet.add(key); // 선택되지 않았으면 추가 (inverted: true)
            }
            return newSet;
        });
        
        // ⭐️ (수정) 콘솔 로깅으로 inverted 여부 확인 ⭐️
        console.log("--- Schedule Toggled ---");
        console.log("Date:", schedule.date);
        console.log("Artist:", schedule.artist);
        console.log("Stage Order:", schedule.stageOrder);
        // 계산된 로컬 변수 newStateIsActive를 사용합니다.
        console.log("Inverted/Selected (New State):", newStateIsActive);
        console.log("------------------------");
        
        // ⭐️ (추가) ⭐️ 상태 변경 후 페이로드 생성 함수를 호출할 수 있습니다.
        // 예를 들어: createAndSendInvertedSlotsPayload();
    };

    const currentMode: TimetableMode = useMemo(() => {
        if (location.pathname.includes('/my/')) return 'my';
        if (location.pathname.includes('/customize/')) return 'customize';
        return 'view'; 
    }, [location.pathname]);
    
    // ⭐️ (추가) ⭐️ 서버 전송 페이로드를 생성하는 함수 (나중에 버튼에 연결)
    const createInvertedSlotsPayload = (): { mt20id: string; invertedSlots: any[] } | null => {
        if (!detailData || currentDayIndex === -1) return null;
        
        const currentDaySchedules = detailData.days[currentDayIndex]?.schedules || [];

        // 현재 날짜의 모든 스케줄을 순회하며 inverted 여부를 결정합니다.
        const invertedSlots = currentDaySchedules.map(schedule => {
            const key = createScheduleKey(schedule);
            const isInverted = activeScheduleKeys.has(key); // Set에 있으면 true (선택됨)
            
            return {
                date: schedule.date,
                stageOrder: schedule.stageOrder,
                artist: schedule.artist,
                // ⭐️ 활성화 상태를 inverted 필드 값으로 사용 ⭐️
                inverted: isInverted 
            };
        });

        const payload = {
            mt20id: "TEMP_USER_ID_OR_MT_ID", // 실제 사용자 ID나 테이블 ID로 대체
            invertedSlots: invertedSlots
        };
        
        console.log("🚀 서버 전송 페이로드 미리보기:", payload);
        return payload;
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
        
        // 무대 순서에 따라 정렬 (TimetableGrid에서 사용됨)
        const uniqueStages = Array.from(new Set(allSchedules.map(s => JSON.stringify({ name: s.stageName, order: s.stageOrder }))));
        const sortedStages = uniqueStages.map(s => JSON.parse(s)).sort((a, b) => a.order - b.order);
        const stageNames: Record<string, string> = {}; 
        sortedStages.forEach((stage, idx) => { stageNames[idx+''] = stage.name; });
        
        return { stageMap, stageNames };
    }, [allSchedules]);

    useEffect(() => {
        console.log("🎯 현재 festivalId:", festivalId);
        if (festivalId) {
            fetchAndProcessTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
        } else {
             setIsLoading(false);
             setDetailData(null); 
        }
    }, [festivalId]);


    const handleGoBack = () => navigate(-1);
    
    // ⭐️ (수정) ⭐️ 다운로드 버튼을 서버 저장 버튼으로 가정하고 페이로드 생성 로직 연결
    const handleSaveTimetable = () => {
        const payload = createInvertedSlotsPayload();
        if (payload) {
            console.log("Saving timetable to server...", payload);
            // 여기에 api.put('/mytimetable', payload) 같은 서버 저장 로직 추가
        }
    };
    
    const handleRefresh = () => {
        console.log("🔄 Refreshing data from API.");
        setCurrentDayIndex(-1); 
        setIsDropdownOpen(false);
        // ⭐️ (추가) ⭐️ 새로고침 시 선택 상태도 초기화
        setActiveScheduleKeys(new Set()); 
        if (festivalId) fetchAndProcessTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
        else { setDetailData(null); setIsLoading(false); }
    };

    const handleDaySelect = (index: number) => { 
        setCurrentDayIndex(index); 
        setIsDropdownOpen(false); 
    };

    // ⭐️ 로딩 및 에러 처리 조건부 렌더링 ⭐️
    if (isLoading) return <div className={timetableStyles.pageContainer}>데이터를 불러오는 중입니다...</div>;
    if (!detailData || detailData.days.length === 0) return <div className={timetableStyles.pageContainer}>존재하지 않는 페스티벌이거나 데이터가 없습니다.</div>;
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
                            {/* 다운로드 버튼을 저장 버튼으로 재사용 */}
                            <button className={timetableStyles.actionButton} onClick={handleSaveTimetable}>
                                <img src={download} alt="저장"/>
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
                            // ⭐️ (추가) ⭐️ 활성화 상태 관리 props 전달
                            onScheduleToggle={handleScheduleToggle}
                            activeScheduleKeys={activeScheduleKeys}
                        />
                    </div></div>
                    
                )}
            </main>
        </div>
    );
}