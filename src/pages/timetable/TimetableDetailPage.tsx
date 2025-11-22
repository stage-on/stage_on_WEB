import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import leftarrow from "../../assets/timetable/arrow-left.svg";
import downarrow from "../../assets/timetable/arrow-down.svg";
import download from "../../assets/timetable/download.svg";
import refresh from "../../assets/timetable/refresh.svg";

import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css";
import TimetableGrid from "../../components/timetable/TimetableGrid";

export interface ScheduleItem { 
  date: string; stageId: string; stageName: string; stageOrder: number; 
  artist: string; start: string; end: string; minutes: number; 
  img: string | null; note: string | null; isCustomized?: boolean; 
}
interface DayScheduleData { date: string; schedules: ScheduleItem[]; }
interface FestivalDetailData { festivalId: number; festivalTitle: string; days: DayScheduleData[]; }

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
                { date: "2025-12-20", stageId: "C-3", stageName: "LAND STAGE C", stageOrder: 3, artist: "THE CHAIRS", start: "16:30:00", end: "17:10:00", minutes: 40, img: null, note: null },
            ] 
        }],
    },
};

type TimetableMode = 'customize' | 'my' | 'view'; 
// ⭐️ 2. 데이터 로딩 함수 (외부로 분리하여 Refresh 시 재호출 가능하도록 함) ⭐️
async function fetchTimetableDetail(
    festivalId: string | undefined, 
    setCurrentDayIndex: (index: number) => void, 
    setDetailData: (data: FestivalDetailData | null) => void, 
    setIsLoading: (loading: boolean) => void
) {
    if (!festivalId) { 
        setIsLoading(false); 
        return; 
    }

    setIsLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const idNum = parseInt(festivalId);
        const baseData = MockFestivalDetails[idNum] || MockFestivalDetails[7];
        
        if (baseData) {
            // ⭐ 깊은 복사: 원본 Mock 데이터를 가져와 사용자 변경 사항을 덮어씁니다. ⭐
            const dataToLoad = JSON.parse(JSON.stringify(baseData)) as FestivalDetailData;
            setDetailData(dataToLoad);
            
            if (dataToLoad.days.length > 0) {
                // 데이터 로딩 완료 후 첫째 날을 선택
                setCurrentDayIndex(0);
            }
        } else {
            setDetailData(null);
        }
    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        setDetailData(null);
    } finally { 
        setIsLoading(false); 
    }
}

export default function TimetableDetailPage() {
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
        const stageNames: Record<string, string> = {};
        Object.keys(stageMap).forEach((key, idx) => { stageNames[idx + ''] = key; });
        return { stageMap, stageNames };
    }, [allSchedules]);

    useEffect(() => {
        if (!festivalId) { setIsLoading(false); return; }

        async function fetchTimetableDetail() {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                const idNum = parseInt(festivalId);
                const baseData = MockFestivalDetails[idNum] || MockFestivalDetails[7];
                if (baseData) {
                    setDetailData(baseData);
                    if (baseData.days.length > 0) setCurrentDayIndex(0);
                }
            } catch (error) {
                console.error(error);
                setDetailData(null);
            } finally { setIsLoading(false); }
        }
        fetchTimetableDetail();
    }, [festivalId, currentMode]);

    const handleGoBack = () => navigate(-1);
    const handleDownload = () => console.log("Download clicked");
   // ⭐ Refresh 함수: 상태 초기화 및 데이터 재로드 ⭐
    const handleRefresh = () => {
        console.log("Refresh button clicked! Resetting state and reloading data.");
        
        // 1. 화면 상태 초기화 (옵션)
        setCurrentDayIndex(-1); 
        setIsDropdownOpen(false);
        
        // 2. 데이터 로딩 함수를 직접 호출하여 데이터 재로드 (가장 중요)
        fetchTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
    };
    const handleDaySelect = (index: number) => { setCurrentDayIndex(index); setIsDropdownOpen(false); };

    if (isLoading) return <div className={timetableStyles.pageContainer}>타임테이블 로딩 중...</div>;
    if (!detailData || currentDayIndex === -1 || !detailData.days[currentDayIndex])
        return <div className={timetableStyles.pageContainer}>정보를 찾을 수 없습니다. (ID: {festivalId})</div>;

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
                            <button className={toggleClass} onClick={() => setIsDropdownOpen(prev => !prev)}>
                                <span className={textClass}>{toggleButtonText}</span>
                                <img src={downarrow} alt="드롭다운 화살표" className={isDropdownOpen ? timetableStyles.arrowOpen : timetableStyles.arrowClosed}/>
                            </button>
                            {isDropdownOpen && (
                                <ul className={timetableStyles.dayDropdownList}>
                                    {detailData.days.map((day, index) => (
                                        <li key={index} className={timetableStyles.dayDropdownItem}>
                                            <button className={`${timetableStyles.dayDropdownOption} ${index===currentDayIndex? timetableStyles.active:''}`} onClick={()=>handleDaySelect(index)}>
                                                {formatDayAndDayOfWeek(day.date)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={timetableStyles.actionButtonWrapper}>
                            <button className={timetableStyles.actionButton} onClick={handleDownload}><img src={download} alt="다운로드"/></button>
                            <button className={timetableStyles.actionButton} onClick={handleRefresh}><img src={refresh} alt="되돌리기"/></button>
                        </div>
                    </div>
                )}

                {currentDayIndex !== -1 && (
                <div className={timetableStyles.timetableScrollWrapper}><div className={timetableStyles.scheduleArea}>
                        <TimetableGrid 
                            stageMap={schedulesByStage.stageMap} 
                            stageNames={schedulesByStage.stageNames} 
                            allSchedules={allSchedules} 
                            mode={currentMode} 
                        />
                    </div></div>
                    
                )}
            </main>
        </div>
    );
}