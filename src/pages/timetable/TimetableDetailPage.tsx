// src/pages/timetable/TimetableDetailPage.tsx

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import leftarrow from "../../assets/timetable/arrow-left.svg"

import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css"; 


// 1. 임시 타입 정의
interface FestivalDetailData {
  festivalId: number;
  festivalTitle: string;
  // date 속성은 'YYYY-MM-DD' 형식의 문자열로 가정합니다.
  days: { date: string; stages: { stageName: string; }[] }[]; 
}

// ⭐️ 날짜 형식 변환 유틸리티 함수 추가 ⭐️
const formatDayAndDayOfWeek = (dateString: string): string => {
    // 요일 배열 (한국어)
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const date = new Date(dateString);

    // Date 객체 생성 시 유효하지 않은 날짜 포맷일 수 있으므로 유효성 검사 추가
    if (isNaN(date.getTime())) {
        console.error("Invalid date format:", dateString);
        return dateString; 
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekdays[date.getDay()];

    return `${month}.${day}(${dayOfWeek})`;
};

// ⭐️ 2. 임시 Mock 데이터를 YYYY-MM-DD 형식으로 수정 (함수 적용을 위해) ⭐️
const MockFestivalDetails: Record<number, FestivalDetailData> = {
    1: {
        festivalId: 1, 
        festivalTitle: "그랜드 민트 페스티벌 2025",
        days: [
            // 형식 수정: YYYY-MM-DD
            { date: "2025-12-20", stages: [{ stageName: "Mint Breeze Stage" }] }, 
            { date: "2025-12-21", stages: [{ stageName: "Loving Forest Garden" }] }
        ],
    },
    2: {
        festivalId: 2,
        festivalTitle: "COUNTDOWN FANTASY 2025-2026",
        days: [
            { date: "2025-12-30", stages: [{ stageName: "Fantasy Stage" }] }, 
            { date: "2025-12-31", stages: [{ stageName: "New Year Stage" }] }
        ],
    },
    3: { 
        festivalId: 3, 
        festivalTitle: "COUNTDOWN FANTASY 2025-2026 (추천)", 
        days: [{ date: "2025-12-20", stages: [{ stageName: "Stage A" }] }] 
    },
    4: { 
        festivalId: 4, 
        festivalTitle: "DMZ 피스트레인 (추천)", 
        days: [{ date: "2025-10-18", stages: [{ stageName: "Stage B" }] }] 
    },
    7: { 
        festivalId: 7, 
        festivalTitle: "더 많은 페스티벌 1", 
        days: [{ date: "2025-12-20", stages: [{ stageName: "Main Stage" }] }] 
    },
};

// 3. 모드 타입 정의
type TimetableMode = 'customize' | 'my' | 'view'; 

export default function TimetableDetailPage() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id: festivalId } = useParams<{ id: string }>(); 

    const [detailData, setDetailData] = useState<FestivalDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    const currentMode: TimetableMode = useMemo(() => {
        if (location.pathname.includes('/my/')) return 'my';
        if (location.pathname.includes('/customize/')) return 'customize';
        return 'view'; 
    }, [location.pathname]);

    const handleGoBack = () => {
        navigate(-1); 
    };

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
                const baseData = MockFestivalDetails[idNum];

                if (baseData) {
                    if (currentMode === 'customize') {
                        dataToLoad = baseData;
                    } else if (currentMode === 'my') {
                        dataToLoad = { 
                            ...baseData,
                            festivalTitle: baseData.festivalTitle + " (내 커스텀)"
                        }; 
                    }
                    setCurrentDayIndex(0); 
                }
                
                setDetailData(dataToLoad); 

            } catch (error) {
                console.error(`[${currentMode} Mode] 상세 타임테이블 로드 오류:`, error);
                setDetailData(null); 
            } finally {
                setIsLoading(false);
            }
        }

        fetchTimetableDetail();
    }, [festivalId, currentMode]); 

    
    // --- 로딩/에러 처리 UI ---
    if (isLoading) {
        return <div className={timetableStyles.pageContainer}>타임테이블 로딩 중...</div>;
    }

    if (!detailData) {
        return <div className={timetableStyles.pageContainer}>요청하신 페스티벌 정보를 찾을 수 없습니다. (ID: {festivalId})</div>;
    }

    // 현재 선택된 날짜의 데이터
    const selectedDayData = detailData.days[currentDayIndex];

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
                
               {/* ⭐️ 1. 날짜 드롭다운 UI ⭐️ */}
                {detailData.days.length > 0 && (
                    <div className={timetableStyles.dayDropdownContainer}>
                        
                        {/* ⚠️ 레이블(label)은 접근성을 위해 유지하는 것을 권장합니다. */}
                        {/* <label htmlFor="day-selector" className={timetableStyles.dayDropdownLabel}>날짜 선택</label> */}

                        <select
                            id="day-selector"
                            className={timetableStyles.dayDropdown}
                            value={currentDayIndex}
                            onChange={(e) => setCurrentDayIndex(parseInt(e.target.value))}
                        >
                            {detailData.days.map((day, index) => (
                                <option
                                    key={index}
                                    value={index} 
                                >
                                    {/* ⭐️ 날짜 형식 변환 함수 적용 ⭐️ */}
                                    {formatDayAndDayOfWeek(day.date)}
                                </option>
                            ))}
                        </select>

                    </div>
                )}
                
                {/* ⭐️ 2. 선택된 날짜의 스테이지/일정 영역 ⭐️ */}
                <div className={timetableStyles.scheduleArea}>
                    
                    {/* ⭐️ 제목에도 변환된 날짜 적용 ⭐️ */}
                    <h3>{formatDayAndDayOfWeek(selectedDayData.date)} 일정</h3>
                    
                    {/* TODO: 여기에 스테이지 필터와 실제 타임테이블 목록이 들어갑니다. */}
                    <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
                        <p>선택된 날짜의 스테이지 수: {selectedDayData.stages.length}</p>
                        <ul>
                            {selectedDayData.stages.map((stage, index) => (
                                <li key={index}>{stage.stageName}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </main>

        </div>
    );
}