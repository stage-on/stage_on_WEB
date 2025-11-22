// src/pages/timetable/TimetableDetailPage.tsx (최종 Hooks 수정 및 3개 Stage 고정)

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// 경로에 맞게 이미지 import 경로는 수정해 주세요.
import leftarrow from "../../assets/timetable/arrow-left.svg"
import downarrow from "../../assets/timetable/arrow-down.svg"
import download from "../../assets/timetable/download.svg"
import refresh from "../../assets/timetable/refresh.svg"

import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css"; 
import TimetableGrid from "../../components/timetable/TimetableGrid";


// =========================================================
// 1. 타입 정의 및 Mock 데이터 (길이가 길어 생략하며, 이전 코드를 유지하세요)
// =========================================================
export interface ScheduleItem { 
  date: string; stageId: string; stageName: string; stageOrder: number; 
  artist: string; start: string; end: string; minutes: number; 
  img: string | null; note: string | null; isCustomized?: boolean; 
}
interface DayScheduleData { date: string; schedules: ScheduleItem[]; }
interface FestivalDetailData { festivalId: number; festivalTitle: string; days: DayScheduleData[]; }

// ⭐️ 날짜 형식 변환 유틸리티 함수 ⭐️
const formatDayAndDayOfWeek = (dateString: string): string => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekdays[date.getDay()];
    return `${month}.${day}(${dayOfWeek})`;
};

const MockFestivalDetails: Record<number, FestivalDetailData> = { 
    7: { 
        festivalId: 7, 
        festivalTitle: "더 많은 페스티벌 1 (3 스테이지)", 
        days: [{ 
            date: "2025-12-20", schedules: [
                { date: "2025-12-20", stageId: "A-1", stageName: "LAND STAGE A", stageOrder: 1, artist: "단편선 순간들", start: "15:00:00", end: "15:40:00", minutes: 40, img: null, note: null, isCustomized: true },
                { date: "2025-12-20", stageId: "A-1", stageName: "LAND STAGE A", stageOrder: 1, artist: "구남과여라이딩스텔라", start: "17:00:00", end: "17:40:00", minutes: 40, img: null, note: null, isCustomized: true },
                { date: "2025-12-20", stageId: "B-2", stageName: "LAND STAGE B", stageOrder: 2, artist: "사위", start: "15:45:00", end: "16:25:00", minutes: 40, img: null, note: null, isCustomized: true },
                { date: "2025-12-20", stageId: "B-2", stageName: "LAND STAGE B", stageOrder: 2, artist: "초록불꽃소년단", start: "17:45:00", end: "18:25:00", minutes: 40, img: null, note: null, isCustomized: true },
                { date: "2025-12-20", stageId: "C-3", stageName: "LAND STAGE C", stageOrder: 3, artist: "THE CHAIRS", start: "16:30:00", end: "17:10:00", minutes: 40, img: null, note: null, isCustomized: true },
                { date: "2025-12-20", stageId: "C-3", stageName: "LAND STAGE C", stageOrder: 3, artist: "SUMIN", start: "18:30:00", end: "19:10:00", minutes: 40, img: null, note: null },
                { date: "2025-12-20", stageId: "D-4", stageName: "LAND STAGE D", stageOrder: 4, artist: "New Band", start: "19:30:00", end: "20:30:00", minutes: 60, img: null, note: null },
            ] 
        }],
    },
    // ... (다른 Mock 데이터 유지) ...
};
type TimetableMode = 'customize' | 'my' | 'view'; 


export default function TimetableDetailPage() {
    
    // ⭐️ 1. 모든 Hooks는 함수 컴포넌트의 최상단에 위치합니다. ⭐️
    const navigate = useNavigate();
    const location = useLocation();
    const { id: festivalId } = useParams<{ id: string }>(); 

    const [detailData, setDetailData] = useState<FestivalDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDayIndex, setCurrentDayIndex] = useState(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const currentMode: TimetableMode = useMemo(() => {
        if (location.pathname.includes('/my/')) return 'my';
        if (location.pathname.includes('/customize/')) return 'customize';
        return 'view'; 
    }, [location.pathname]);

    
    // ⭐️ 2. 데이터 추출 및 필터링 useMemo도 Early Return 이전에 선언 ⭐️
    const allSchedules = useMemo(() => {
        // detailData나 days가 없을 경우 안전하게 빈 배열 반환
        if (!detailData || currentDayIndex === -1 || !detailData.days[currentDayIndex]) {
            return [];
        }
        return detailData.days[currentDayIndex].schedules;
    }, [detailData, currentDayIndex]);
    
    // ⭐️ Stage 3개 고정 필터링 로직 ⭐️
    const schedulesByStage = useMemo(() => {
        const stage1Schedules = allSchedules.filter(s => s.stageOrder === 1);
        const stage2Schedules = allSchedules.filter(s => s.stageOrder === 2);
        const stage3Schedules = allSchedules.filter(s => s.stageOrder === 3);

        const stageNames = {
            1: stage1Schedules[0]?.stageName || "Stage 1",
            2: stage2Schedules[0]?.stageName || "Stage 2",
            3: stage3Schedules[0]?.stageName || "Stage 3",
        };
        
        return {
            stage1: stage1Schedules,
            stage2: stage2Schedules,
            stage3: stage3Schedules,
            stageNames: stageNames,
        };
    }, [allSchedules]);


    // --- useEffect, 핸들러 (이전 코드 유지) ---
    useEffect(() => {
        if (!festivalId) { 
            setIsLoading(false);
            return;
        }

        async function fetchTimetableDetail() {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 500)); 
                
                let dataToLoad: FestivalDetailData | null = null;
                const idNum = parseInt(festivalId!); 
                const baseData = MockFestivalDetails[idNum] || MockFestivalDetails[7]; 
                
                if (baseData) {
                    dataToLoad = baseData;
                    if (baseData.days.length > 0) {
                        setCurrentDayIndex(0); 
                    }
                }
                setDetailData(dataToLoad); 

            } catch (error) {
                console.error(`상세 타임테이블 로드 오류:`, error);
                setDetailData(null); 
            } finally {
                setIsLoading(false);
            }
        }
        fetchTimetableDetail();
    }, [festivalId, currentMode]); 

    const handleGoBack = () => { navigate(-1); };
    const handleDownload = () => { console.log("Download button clicked!"); };
    const handleRefresh = () => { console.log("Refresh/Reset button clicked!"); };
    const handleDaySelect = (index: number) => {
        setCurrentDayIndex(index);
        setIsDropdownOpen(false);
    };


    // --- Early Return ---
    if (isLoading) {
        return <div className={timetableStyles.pageContainer}>타임테이블 로딩 중...</div>;
    }

    if (!detailData || currentDayIndex === -1 || !detailData.days[currentDayIndex]) {
        return <div className={timetableStyles.pageContainer}>
            {detailData ? "날짜를 선택해 주세요." : `요청하신 페스티벌 정보를 찾을 수 없습니다. (ID: ${festivalId})`}
        </div>;
    }
    
    const selectedDayData = detailData.days[currentDayIndex];
    
    const selectedDateFormatted = formatDayAndDayOfWeek(selectedDayData.date);
    const toggleButtonText = isDropdownOpen ? "날짜 선택" : selectedDateFormatted;
    const toggleClass = `${timetableStyles.dayDropdownToggle} ${isDropdownOpen ? timetableStyles.open : ''}`;
    const textClass = currentDayIndex !== -1 && !isDropdownOpen ? timetableStyles.fontSet : timetableStyles.placeholderText;


    // --- 메인 UI 렌더링 ---
    return (
        <div className={timetableStyles.pageContainer}>
            
            <header className={timetableStyles.header}>
                <button 
                    className={timetableStyles.backButton}
                    onClick={handleGoBack}
                >
                    <img src={leftarrow} alt="뒤로 가기" />
                </button>
                
                <h1 className={timetableStyles.pageTitle}>
                    {detailData.festivalTitle} 
                </h1>
                <div className={timetableStyles.emptyBox}></div>
            </header>

            <main className={timetableStyles.mainContent}>
                
               {/* 1. 컨트롤 바 (드롭다운 + 다운로드/리프레시 버튼) */}
                {detailData.days.length > 0 && (
                     <div className={timetableStyles.timetableControlBar}>
                        <div className={timetableStyles.dropdownWrapper}>
                            <button className={toggleClass} onClick={() => setIsDropdownOpen(prev => !prev)}>
                                <span className={textClass}>{toggleButtonText}</span>
                                <img 
                                    src={downarrow} 
                                    alt="드롭다운 화살표"
                                    className={isDropdownOpen ? timetableStyles.arrowOpen : timetableStyles.arrowClosed}
                                />
                            </button>

                            {isDropdownOpen && (
                                <ul className={timetableStyles.dayDropdownList}>
                                    {detailData.days.map((day, index) => (
                                        <li key={index} className={timetableStyles.dayDropdownItem}>
                                            <button
                                                className={`${timetableStyles.dayDropdownOption} ${
                                                    index === currentDayIndex ? timetableStyles.active : ''
                                                }`}
                                                onClick={() => handleDaySelect(index)}
                                            >
                                                <span 
                                                    className={`${timetableStyles.selectedDateTextWrapper} ${
                                                        index === currentDayIndex ? timetableStyles.dateTextActive : ''
                                                    }`}
                                                >
                                                    {formatDayAndDayOfWeek(day.date)}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        <div className={timetableStyles.actionButtonWrapper}>
                            <button className={timetableStyles.actionButton} onClick={handleDownload}>
                                <img src={download} alt="다운로드" />
                            </button>
                            <button className={timetableStyles.actionButton} onClick={handleRefresh}>
                                <img src={refresh} alt="되돌리기" />
                            </button>
                        </div>

                    </div>
                )}
                
                {/* ⭐️ 2. 타임테이블 영역 ⭐️ */}
                {currentDayIndex !== -1 && (
                    <div className={timetableStyles.scheduleArea}>
                        
                        <h3>{formatDayAndDayOfWeek(selectedDayData.date)} 일정</h3>
                        
                        {/* Stage 3개 고정 Props 전달 */}
                        <TimetableGrid 
                            stage1Schedules={schedulesByStage.stage1}
                            stage2Schedules={schedulesByStage.stage2}
                            stage3Schedules={schedulesByStage.stage3}
                            stageNames={schedulesByStage.stageNames}
                            allSchedules={allSchedules}
                            mode={currentMode}
                        />

                    </div>
                )}
            </main>

        </div>
    );
}