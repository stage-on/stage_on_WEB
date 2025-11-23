import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import leftarrow from "../../assets/timetable/arrow-left.svg";
import downarrow from "../../assets/timetable/arrow-down.svg";
import download from "../../assets/timetable/download.svg";
import refresh from "../../assets/timetable/refresh.svg";

import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css";
// TimetableGrid는 외부 컴포넌트이므로 실제 파일 구조에 따라 import 경로를 확인하세요.
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

// 🌟 MockFestivalDetails 데이터: 전체 Mock 데이터를 올바르게 통합했습니다. 🌟
const MockFestivalDetails: Record<number, FestivalDetailData> = { 
     1: {
    festivalId: 1,
    festivalTitle: "그랜드 민트 페스티벌 2025",
    days: [
      {
        date: "2025-12-20",
        schedules: [
          { date:"2025-12-20", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"Artist 1", start:"15:00:00", end:"15:40:00", minutes:40, img:null, note:null },
          { date:"2025-12-20", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"Artist 2", start:"15:45:00", end:"16:25:00", minutes:40, img:null, note:null },
          { date:"2025-12-20", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"Artist 3", start:"16:30:00", end:"17:10:00", minutes:40, img:null, note:null },
        ]
      }
    ]
  },
  2: {
    festivalId: 2,
    festivalTitle: "COUNTDOWN FANTASY 2025-2026",
    days: [
      {
        date:"2025-12-30",
        schedules:[
          { date:"2025-12-30", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"Countdown Artist 1", start:"20:00:00", end:"20:40:00", minutes:40, img:null, note:null },
          { date:"2025-12-30", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"Countdown Artist 2", start:"20:45:00", end:"21:25:00", minutes:40, img:null, note:null },
          { date:"2025-12-30", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"Countdown Artist 3", start:"21:30:00", end:"22:10:00", minutes:40, img:null, note:null },
        ]
      },
      {
        date:"2025-12-31",
        schedules:[
          { date:"2025-12-31", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"Countdown Artist 4", start:"20:00:00", end:"20:40:00", minutes:40, img:null, note:null },
          { date:"2025-12-31", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"Countdown Artist 5", start:"20:45:00", end:"21:25:00", minutes:40, img:null, note:null },
          { date:"2025-12-31", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"Countdown Artist 6", start:"21:30:00", end:"22:10:00", minutes:40, img:null, note:null },
        ]
      }
    ]
  },
  3: {
    festivalId: 3,
    festivalTitle: "COUNTDOWN FANTASY 2025-2026",
    days: [
      {
      "date": "2025-10-20",
      "schedules": [
        {
          "date": "2025-10-20",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "노브레인",
          "start": "15:00:00",
          "end": "15:40:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "선우정아",
          "start": "15:45:00",
          "end": "16:25:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "No Party for Cao Dong (TW)",
          "start": "16:30:00",
          "end": "17:10:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "Bandit Bandit (FR)",
          "start": "17:15:00",
          "end": "17:55:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "혁오",
          "start": "18:00:00",
          "end": "18:40:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "태버 (Tabber)",
          "start": "18:45:00",
          "end": "19:25:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "Colonel Mustard & The Dijon 5 (UK)",
          "start": "19:30:00",
          "end": "20:10:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "잔나비",
          "start": "20:15:00",
          "end": "20:55:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "넉살 X 까데호",
          "start": "21:00:00",
          "end": "21:40:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "No Buses (JP)",
          "start": "21:45:00",
          "end": "22:25:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-20",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "Yaeji (DJ Set)",
          "start": "22:40:00",
          "end": "23:30:00",
          "minutes": 50,
          "img": null,
          "note": null
        }
      ]
    },
    {
      "date": "2025-10-21",
      "schedules": [
        {
          "date": "2025-10-21",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "장기하",
          "start": "15:00:00",
          "end": "15:40:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "Jambinai",
          "start": "15:45:00",
          "end": "16:25:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "설(SURL)",
          "start": "16:30:00",
          "end": "17:10:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "The fin. (JP)",
          "start": "17:15:00",
          "end": "17:55:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "새소년",
          "start": "18:00:00",
          "end": "18:40:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "The Volunteers",
          "start": "18:45:00",
          "end": "19:25:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "라이프 앤 타임",
          "start": "19:30:00",
          "end": "20:10:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "Peggy Gou",
          "start": "20:15:00",
          "end": "20:55:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "실리카겔",
          "start": "21:00:00",
          "end": "21:40:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "B-2",
          "stageName": "Stage B",
          "stageOrder": 2,
          "artist": "이디오테잎",
          "start": "21:45:00",
          "end": "22:25:00",
          "minutes": 40,
          "img": null,
          "note": null
        },
        {
          "date": "2025-10-21",
          "stageId": "A-1",
          "stageName": "LAND STAGE (Stage A)",
          "stageOrder": 1,
          "artist": "250 (DJ Set)",
          "start": "22:40:00",
          "end": "23:30:00",
          "minutes": 50,
          "img": null,
          "note": null
        }
      ]
    }
  ]
  },
  4: {
    festivalId: 4,
    festivalTitle: "DMZ 피스트레인 뮤직 페스티벌 2025",
    days: [
      {
        date:"2025-12-20",
        schedules:[
          { date:"2025-12-20", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"Busan Rock 1", start:"18:00:00", end:"18:40:00", minutes:40, img:null, note:null },
          { date:"2025-12-20", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"Busan Rock 2", start:"18:45:00", end:"19:25:00", minutes:40, img:null, note:null },
          { date:"2025-12-20", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"Busan Rock 3", start:"19:30:00", end:"20:10:00", minutes:40, img:null, note:null },
        ]
      }
    ]
  },
  5: {
    festivalId: 5,
    festivalTitle: "2025 부산 락 페스티벌",
    days: [
      {
        date:"2025-05-28",
        schedules:[
          { date:"2025-05-28", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"Jazz 1", start:"17:00:00", end:"17:40:00", minutes:40, img:null, note:null },
          { date:"2025-05-28", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"Jazz 2", start:"17:45:00", end:"18:25:00", minutes:40, img:null, note:null },
          { date:"2025-05-28", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"Jazz 3", start:"18:30:00", end:"19:10:00", minutes:40, img:null, note:null },
        ]
      }
    ]
  },
  6: {
    festivalId: 6,
    festivalTitle: "서울 재즈 페스티벌 2025",
    days: [
      {
        date:"2025-08-15",
        schedules:[
          { date:"2025-08-15", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"Hongdae 1", start:"16:00:00", end:"16:40:00", minutes:40, img:null, note:null },
          { date:"2025-08-15", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"Hongdae 2", start:"16:45:00", end:"17:25:00", minutes:40, img:null, note:null },
          { date:"2025-08-15", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"Hongdae 3", start:"17:30:00", end:"18:10:00", minutes:40, img:null, note:null },
        ]
      }
    ]
  },
  7: {
    festivalId: 7,
    festivalTitle: "페스티벌 이름",
    days: [
      {
        date:"2025-09-10",
        schedules:[
          { date:"2025-09-10", stageId:"A-1", stageName:"Stage A", stageOrder:1, artist:"공연 이름", start:"15:00:00", end:"15:40:00", minutes:40, img:null, note:null },
          { date:"2025-09-10", stageId:"B-2", stageName:"Stage B", stageOrder:2, artist:"공연 이름", start:"15:45:00", end:"16:25:00", minutes:40, img:null, note:null },
          { date:"2025-09-10", stageId:"C-3", stageName:"Stage C", stageOrder:3, artist:"공연 이름", start:"16:30:00", end:"17:10:00", minutes:40, img:null, note:null },
        ]
      }
    ]
  }
};

type TimetableMode = 'customize' | 'my' | 'view'; 

// ⭐️ 1. 데이터 로딩 함수 (외부로 분리, 깊은 복사 로직 포함) ⭐️
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
        // MockFestivalDetails[7]은 fallback 데이터입니다.
        const baseData = MockFestivalDetails[idNum] || MockFestivalDetails[7];
        
        if (baseData) {
            // ⭐ 핵심 로직: JSON을 이용한 깊은 복사 (Deep Copy) 수행 ⭐
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
        // isCustomized가 true인 스케줄만 필터링하는 등의 로직을 여기에 추가할 수 있습니다.
        // 현재는 선택된 날짜의 모든 스케줄을 반환합니다.
        return detailData.days[currentDayIndex].schedules;
    }, [detailData, currentDayIndex]);

    const schedulesByStage = useMemo(() => {
        const stageMap: Record<string, ScheduleItem[]> = {};
        allSchedules.forEach(s => {
            if (!stageMap[s.stageName]) stageMap[s.stageName] = [];
            stageMap[s.stageName].push(s);
        });
        // StageOrder를 기반으로 스테이지 이름을 정렬하는 로직을 추가하면 좋습니다.
        const stageNames: Record<string, string> = {};
        Object.keys(stageMap).forEach((key, idx) => { stageNames[idx + ''] = key; });
        return { stageMap, stageNames };
    }, [allSchedules]);

    // ⭐ 초기 로딩 (useEffect에서 외부 함수 호출로 통일) ⭐
    useEffect(() => {
        fetchTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
    }, [festivalId, currentMode]);

    const handleGoBack = () => navigate(-1);
    const handleDownload = () => console.log("Download clicked");
   
    // ⭐ Refresh 함수: 상태 초기화 및 데이터 재로드 로직 완성 ⭐
    const handleRefresh = () => {
        console.log("Refresh button clicked! Resetting state and reloading data from Mock (Deep Copy).");
        
        // 1. 화면 상태 초기화 (날짜 선택을 리셋하여 로딩 상태를 확실히 하고, 드롭다운을 닫습니다.)
        setCurrentDayIndex(-1); 
        setIsDropdownOpen(false);
        
        // 2. 데이터 로딩 함수를 다시 호출하여 원본 Mock 데이터를 '깊은 복사'하여 재로드합니다.
        // 이를 통해 사용자의 커스터마이징 이전 상태로 안전하게 돌아갑니다.
        fetchTimetableDetail(festivalId, setCurrentDayIndex, setDetailData, setIsLoading);
    };

    const handleDaySelect = (index: number) => { 
        setCurrentDayIndex(index); 
        setIsDropdownOpen(false); 
    };

    // 로딩 상태 처리
    if (isLoading)
        return <div className={timetableStyles.pageContainer}>데이터를 불러오는 중입니다...</div>;
        
    // 데이터 없음 상태 처리
    if (!detailData || detailData.days.length === 0)
        return <div className={timetableStyles.pageContainer}>존재하지 않는 페스티벌이거나 데이터가 없습니다.</div>;

    // 데이터 정상 로드 후 현재 날짜가 선택되지 않았을 때 (초기 로드 중일 때)
    if (currentDayIndex === -1 || !detailData.days[currentDayIndex])
        return <div className={timetableStyles.pageContainer}>날짜 데이터를 준비 중입니다...</div>;


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