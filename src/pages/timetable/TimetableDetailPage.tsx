import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import leftarrow from "../../assets/timetable/arrow-left.svg"
import downarrow from "../../assets/timetable/arrow-down.svg" // downarrow 이미지 import 필요
import download from "../../assets/timetable/download.svg"
import refresh from "../../assets/timetable/refresh.svg"

import timetableStyles from "../../css/pages/timetable/timetabledetail.module.css"; 


// 1. 임시 타입 정의
interface FestivalDetailData {
  festivalId: number;
  festivalTitle: string;
  days: { date: string; stages: { stageName: string; }[] }[]; 
}

// ⭐️ 날짜 형식 변환 유틸리티 함수 ⭐️
const formatDayAndDayOfWeek = (dateString: string): string => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error("Invalid date format:", dateString);
        return dateString; 
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekdays[date.getDay()];

    return `${month}.${day}(${dayOfWeek})`;
};

// ⭐️ 2. 임시 Mock 데이터를 YYYY-MM-DD 형식으로 가정하여 수정 ⭐️
const MockFestivalDetails: Record<number, FestivalDetailData> = {
    1: {
        festivalId: 1, 
        festivalTitle: "그랜드 민트 페스티벌 2025",
        days: [
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
    
    const [currentDayIndex, setCurrentDayIndex] = useState(-1); // 초기값 -1
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const currentMode: TimetableMode = useMemo(() => {
        if (location.pathname.includes('/my/')) return 'my';
        if (location.pathname.includes('/customize/')) return 'customize';
        return 'view'; 
    }, [location.pathname]);

    const handleGoBack = () => {
        navigate(-1); 
    };
    
    // ⭐️ 다운로드 버튼 핸들러 ⭐️
    const handleDownload = () => {
        console.log("Download button clicked!");
        // 여기에 타임테이블 이미지 저장 로직 구현
    };
    
    // ⭐️ 되돌리기/리프레시 버튼 핸들러 ⭐️
    const handleRefresh = () => {
        console.log("Refresh/Reset button clicked!");
        // 여기에 커스텀 타임테이블 초기화 또는 되돌리기 로직 구현
    };
    
    // ⭐️ 날짜 선택 핸들러 ⭐️
    const handleDaySelect = (index: number) => {
        setCurrentDayIndex(index);
        setIsDropdownOpen(false); // 선택 후 드롭다운 닫기
    };

    // 데이터 로딩 (API 호출 시뮬레이션)
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
                    dataToLoad = baseData;
                    // 데이터 로드 완료 후, 첫 번째 날짜(인덱스 0)를 기본 선택하도록 설정
                    setCurrentDayIndex(0); 
                    setIsDropdownOpen(false); 
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

    
    // --- 로딩/에러 처리 UI ---
    if (isLoading) {
        return <div className={timetableStyles.pageContainer}>타임테이블 로딩 중...</div>;
    }

    if (!detailData) {
        return <div className={timetableStyles.pageContainer}>요청하신 페스티벌 정보를 찾을 수 없습니다. (ID: {festivalId})</div>;
    }

    // 현재 선택된 날짜 데이터 준비
    const selectedDayData = detailData.days[currentDayIndex];
    
    // 현재 선택된 날짜를 포맷팅. (currentDayIndex가 -1이 아닐 경우만 사용)
    const selectedDateFormatted = currentDayIndex !== -1 
        ? formatDayAndDayOfWeek(selectedDayData.date)
        : "날짜 선택";

    // ⭐️ 토글 버튼에 표시될 최종 텍스트 결정 ⭐️
    const toggleButtonText = isDropdownOpen
        ? "날짜 선택" // 드롭다운이 열리면 '날짜 선택' 표시
        : selectedDateFormatted; // 닫혀 있으면 선택된 날짜 표시

    // ⭐️ 토글 버튼 클래스 (open/close 상태에 따라 테두리 색상 변경 및 화살표 회전) ⭐️
    const toggleClass = `${timetableStyles.dayDropdownToggle} ${isDropdownOpen ? timetableStyles.open : ''}`;
    
    // ⭐️ 텍스트 클래스 (선택된 날짜가 있을 때만 보라색 fontSet 적용) ⭐️
    const textClass = currentDayIndex !== -1 && !isDropdownOpen
        ? timetableStyles.fontSet
        : timetableStyles.placeholderText;

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
                
               {/* ⭐️ 1. 컨트롤 바 (드롭다운 + 다운로드/리프레시 버튼) ⭐️ */}
                {detailData.days.length > 0 && (
                    <div className={timetableStyles.timetableControlBar}>
                        
                        {/* 1-1. 드롭다운 래퍼: absolute list의 기준점 */}
                        <div className={timetableStyles.dropdownWrapper}>
                            <button
                                className={toggleClass}
                                onClick={() => setIsDropdownOpen(prev => !prev)}
                            >
                                <span className={textClass}>
                                    {toggleButtonText}
                                </span>
                                <img 
                                    src={downarrow} 
                                    alt="드롭다운 화살표"
                                    className={isDropdownOpen ? timetableStyles.arrowOpen : timetableStyles.arrowClosed}
                                />
                            </button>

                            {/* 2. 날짜 목록 (isDropdownOpen이 true일 때만 표시) */}
                            {isDropdownOpen && (
                                <ul className={timetableStyles.dayDropdownList}>
                                    {detailData.days.map((day, index) => (
                                        <li 
                                            key={index}
                                            className={timetableStyles.dayDropdownItem}
                                        >
                                            <button
                                                className={`${timetableStyles.dayDropdownOption} ${
                                                    index === currentDayIndex ? timetableStyles.active : ''
                                                }`}
                                                onClick={() => handleDaySelect(index)}
                                            >
                                                {/* ⭐️ 수정: 텍스트를 <span>으로 감싸서 별도의 박스 스타일을 적용할 수 있도록 함 ⭐️ */}
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
                        
                        {/* 1-2. 액션 버튼 래퍼 */}
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
                
                {/* ⭐️ 2. 선택된 날짜의 스테이지/일정 영역 (날짜가 선택되었을 때만 표시) ⭐️ */}
                {currentDayIndex !== -1 && (
                    <div className={timetableStyles.scheduleArea}>
                        
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
                )}
            </main>

        </div>
    );
}