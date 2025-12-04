// src/pages/timetable/TimetableDetailPage.tsx (콘솔 로그 추가 버전)

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom"; 
import leftarrow from "../../assets/timetable/arrow-left.svg";
import downarrow from "../../assets/timetable/arrow-down.svg";
import download from "../../assets/timetable/download.svg";
import refresh from "../../assets/timetable/refresh.svg";

import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css";
import TimetableGrid from "../../components/timetable/TimetableGrid"; 
import api from "../../api/api"; 

export interface KopisFestivalItem {
  id: number; 
  prfnm: string; 
  prfpdfrom: string; 
  prfpdto: string; 
  fcltynm: string; 
  days: { date: string; open: any; close: any; }[]; // 이제 사용하지 않음
  slots: { 
    date: string; stageId: string; stageName: string; stageOrder: number; 
    artist: string; 
    start: { hour: number; minute: number; second: number; nano: number; }; 
    end: { hour: number; minute: number; second: number; nano: number; }; 
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

const formatDayAndDayOfWeek = (dateString: string): string => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekdays[date.getDay()];
    return `${month}.${day}(${dayOfWeek})`;
};

type TimetableMode = 'customize' | 'my' | 'view'; 

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
        console.log("📌 rawData:", rawData);

        const apiData: KopisFestivalItem | undefined = Array.isArray(rawData)
            ? rawData.find(f => f.id === idNum)
            : rawData;

        if (!apiData) {
            console.error(`⚠️ festivalId ${festivalId}에 해당하는 데이터가 없습니다.`);
            setDetailData(null);
            setIsLoading(false);
            return null;
        }

        const slots = apiData.slots || [];

        if (!apiData.prfnm || slots.length === 0) { 
             console.error("⚠️ 필수 필드 누락 또는 slots 없음", {
                 prfnm: apiData?.prfnm,
                 slotsLength: slots.length
             });
             setDetailData(null);
             setIsLoading(false);
             return null;
        }

        const schedulesByDateMap: Record<string, ScheduleItem[]> = {};

        slots.forEach(slot => {
            const dateString = slot.date;
            const startHour = slot.start?.hour ?? 0;
            const startMinute = slot.start?.minute ?? 0;
            const endHour = slot.end?.hour ?? 0;
            const endMinute = slot.end?.minute ?? 0;

            const scheduleItem: ScheduleItem = {
                date: slot.date,
                stageId: slot.stageId,
                stageName: slot.stageName,
                stageOrder: slot.stageOrder,
                artist: slot.artist,
                start: `${startHour.toString().padStart(2,'0')}:${startMinute.toString().padStart(2,'0')}:00`,
                end: `${endHour.toString().padStart(2,'0')}:${endMinute.toString().padStart(2,'0')}:00`,
                minutes: slot.minutes,
                img: slot.img || null,
                note: slot.note || null,
                isCustomized: false
            };

            if (!schedulesByDateMap[dateString]) schedulesByDateMap[dateString] = [];
            schedulesByDateMap[dateString].push(scheduleItem);
        });

        console.log("📌 모든 ScheduleItem:", Object.values(schedulesByDateMap).flat());

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
    const handleDownload = () => console.log("Download clicked");
    const handleRefresh = () => {
        console.log("🔄 Refreshing data from API.");
        setCurrentDayIndex(-1); 
        setIsDropdownOpen(false);
        if (festivalId) fetchAndProcessTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
        else { setDetailData(null); setIsLoading(false); }
    };

    const handleDaySelect = (index: number) => { 
        setCurrentDayIndex(index); 
        setIsDropdownOpen(false); 
    };

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
                            <button className={timetableStyles.actionButton} onClick={handleDownload}>
                                <img src={download} alt="다운로드"/>
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
                        />
                    </div></div>
                    
                )}
            </main>
        </div>
    );
}