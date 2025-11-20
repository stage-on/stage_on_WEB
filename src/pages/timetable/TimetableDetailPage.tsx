import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import leftarrow from "../../assets/timetable/arrow-left.svg"

// CSS 모듈 (임시)
import detailStyles from "../../css/pages/timetable/timetabledetail.module.css"; 

// 타입 및 Mock 데이터 import (경로는 실제 프로젝트 구조에 맞게 조정하세요)
import { FestivalDetailData } from "../../types/timetable"; 
import { mockFestivalDetail } from "../../data/mockTimetableDetail"; 


const TimetableDetailPage = () => {
    
    const navigate = useNavigate();
    // URL 파라미터에서 페스티벌 ID를 문자열로 가져옵니다.
    const { id: festivalId } = useParams<{ id: string }>(); 

    // 데이터 및 로딩 상태 관리
    const [detailData, setDetailData] = useState<FestivalDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleGoBack = () => {
        navigate(-1); 
    };

    // 데이터 로딩 (API 호출 시뮬레이션)
    useEffect(() => {
        // ID가 없거나 유효하지 않으면 로드하지 않습니다.
        if (!festivalId) {
            setIsLoading(false);
            return;
        }

        async function fetchTimetableDetail() {
            setIsLoading(true);
            try {
                // 500ms 딜레이를 주어 네트워크 로딩을 시뮬레이션
                await new Promise(resolve => setTimeout(resolve, 500)); 
                
                // Mocking: ID가 일치하는지 확인
                if (parseInt(festivalId) === mockFestivalDetail.festivalId) {
                    setDetailData(mockFestivalDetail);
                } else {
                    setDetailData(null); // 해당 ID의 데이터가 없음
                }

            } catch (error) {
                console.error(`[ID:${festivalId}] 상세 타임테이블 로드 오류:`, error);
                setDetailData(null); 
            } finally {
                setIsLoading(false);
            }
        }

        fetchTimetableDetail();
    }, [festivalId]); 

    
    // --- 로딩/에러 처리 UI ---
    if (isLoading) {
        return <div className={detailStyles.pageContainer}>타임테이블 로딩 중...</div>;
    }

    if (!detailData) {
        return <div className={detailStyles.pageContainer}>요청하신 페스티벌 정보를 찾을 수 없습니다. (ID: {festivalId})</div>;
    }

    // --- 메인 UI 렌더링 ---
    return (
        <div className={detailStyles.pageContainer}>
            
            {/* 1. 상단 헤더 영역 (뒤로 가기 버튼, 타이틀) */}
            <header className={detailStyles.header}>
                <button 
                    className={detailStyles.backButton}
                    onClick={handleGoBack}
                >
                    <img src={leftarrow} alt="뒤로 가기" />
                </button>
                
                {/* API 응답에서 받은 제목 표시 */}
                <h1 className={detailStyles.pageTitle}>
                    {detailData.festivalTitle}
                </h1>
                
                {/* 여기에 커스텀 저장 등의 버튼이 들어갈 수 있습니다. */}
            </header>

            <main className={detailStyles.mainContent}>
                
                {/* 2. 날짜 선택 탭 컴포넌트가 위치할 영역 */}
                <p>여기에 날짜 탭 컴포넌트를 사용하여 날짜를 선택합니다.</p>
                
                {/* 3. 실제 타임테이블 (선택된 날짜의 일정) 컴포넌트가 위치할 영역 */}
                <p>선택된 날짜: {detailData.days[0].date}</p>
                <p>총 {detailData.days.length}일 동안 진행되는 페스티벌입니다.</p>
                
            </main>

        </div>
    );
};

export default TimetableDetailPage;