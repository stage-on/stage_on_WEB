// src/pages/timetable/TimetableMainPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
import FestivalListItem from "../../components/timetable/FestivalListItem";
import SectionHeader from "../../components/SectionHeader";
import RecommendCard from "../../components/timetable/RecommendCard";
import Alarm from "../../components/Alarm";
import api from "../../api/api"; // ⭐️ 사용자가 import 한 api 객체 ⭐️

// ⭐️ API 응답 타입 정의 (더 많은 페스티벌 API의 응답 구조) ⭐️
// 실제 API 응답 구조를 기반으로 필드명을 사용합니다.
interface KopisFestivalItem {
  id: number; // FestivalItem의 id와 매핑
  mt20id: string; 
  prfnm: string; // FestivalItem의 title과 매핑 (공연명)
  prfpdfrom: string; // 공연 시작일
  prfpdto: string; // 공연 종료일
  fcltynm: string; // FestivalItem의 location과 매핑 (시설명)
  poster: string; // FestivalItem의 thumbnailUrl과 매핑 (포스터 URL)
  // ... 기타 필드 (생략)
}

// ⭐️ 수정: 인터페이스를 export 합니다. ⭐️
export interface FestivalItem {
  id: number;
  title: string;
  likes: number; // API에 없는 경우 0으로 임시 설정 필요
  location: string;
  date: string;
  thumbnailUrl: string;
}

export interface RecommendItem {
  id: number;
  title: string;
  date: string;
  thumbnailUrl: string;
}

const sortOptions = [
  { label: "최신 등록순", key: "latest" },
  { label: "인기순", key: "likes" },
  { label: "예매 임박순", key: "deadline" },
];

const TimetableMainPage = () => {
  const navigate = useNavigate();
  
  // Mock 데이터
  const [timetableList, setTimetableList] = useState<FestivalItem[]>([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState<RecommendItem[]>([]);
  
  // ⭐️ API 데이터 상태 ⭐️
  const [morefestival, setMorefestival] = useState<FestivalItem[]>([]);
  const [currentSort, setCurrentSort] = useState(sortOptions[0].key); 
  
  // ⭐️ API 호출 상태 ⭐️
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // 1. 커스텀 '생성' 경로 이동 함수
  const handleCustomizeClick = (festivalId: number) => { 
    navigate(`/main/timetable/customize/${festivalId}`);
  };

  // 2. 나의 타임테이블 '수정' 경로 이동 함수
  const handleMyTimetableClick = (festivalId: number) => { 
    navigate(`/main/timetable/my/${festivalId}`);
  };

  // ⭐️ API 호출 함수: 더 많은 페스티벌 목록 조회 ⭐️
  const fetchMoreFestivals = async (sortKey: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ⭐️ api 객체를 사용하여 GET 요청을 보냅니다. ⭐️
      // API 주소: /kopis/performances/festivals (v1은 제외)
      const response = await api.get(`/kopis/performances/festivals?sort=${sortKey}`); 
      
      const apiData: KopisFestivalItem[] = response.data; 
      
      // ⭐️ API 응답을 FestivalItem 타입에 맞게 변환 (매핑) ⭐️
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm, 
          likes: 0, // API에 '좋아요' 데이터가 없으므로 0으로 임시 처리
          location: item.fcltynm, 
          date: `${item.prfpdfrom} - ${item.prfpdto}`, 
          thumbnailUrl: item.poster, 
      }));

      setMorefestival(transformedData);
      
    } catch (err) {
      console.error("페스티벌 목록을 불러오는 중 오류 발생:", err);
      // 에러 객체에 따라 메시지를 다르게 처리할 수 있습니다.
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      setMorefestival([]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // 1. 나의 타임테이블 (Mock Data)
    const mockData1: FestivalItem[] = [
       { id: 1, title: "그랜드 민트 페스티벌 2025", likes: 12, location: "일산 킨텍스", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/img1.png" },
      { id: 2, title: "COUNTDOWN FANTASY 2025-2026", likes: 10, location: "일산 킨텍스", date: "2025.12.30 - 2025.12.31", thumbnailUrl: "/path/to/img2.png" },
    ];
    setTimetableList(mockData1);

    // 2. 추천 페스티벌 (Mock Data)
    const mockData2: RecommendItem[] = [
       { id: 3, title: "COUNTDOWN FANTASY 2025-2026", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/poster1.png" },
      { id: 4, title: "DMZ 피스트레인 뮤직 페스티벌 2025", date: "2025.10.18 - 2025.10.19", thumbnailUrl: "/path/to/poster2.png" },
      { id: 5, title: "2025 부산 락 페스티벌", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/poster3.png" },
      { id: 6, title: "서울 재즈 페스티벌 2025", date: "2025.05.28 - 2025.05.30", thumbnailUrl: "/path/to/poster4.png" },
     ];
    setRecommendedFestivals(mockData2);
    
    // ⭐️ 3. 더 많은 페스티벌 Mock Data 제거 (API 호출로 대체) ⭐️
    // setMorefestival(mockData3);
  }, []);
  
  // ⭐️ currentSort 상태가 변경되거나 컴포넌트 마운트 시 API 호출 ⭐️
  useEffect(() => {
    fetchMoreFestivals(currentSort);
  }, [currentSort]); // currentSort이 변경될 때마다 실행

  const listData = timetableList;
  const recommendData = recommendedFestivals;
  const displayFestivalData = morefestival; 

  return (
    <>
       <Alarm></Alarm>
      <div className={timetablestyles.mainContentWrapper}>
        
        <section className={timetablestyles.mytimetableSection}>
          <SectionHeader
            subtitle="공연 관람이 며칠 안 남았다면?"
            mainTitleLines={["나의\u00A0", "타임테이블"]}
            boldParts={[1]}
          />

          <ul className={timetablestyles.timetableList}>
            {listData.map((item) => (
              <FestivalListItem
                key={item.id}
                itemData={item}
                onClick={() => handleMyTimetableClick(item.id)}
              />
            ))}
          </ul>
        </section>

        <section className={timetablestyles.check}>
          <SectionHeader
            subtitle="나의 관심 페스티벌의"
            mainTitleLines={["타임테이블\u00A0", "확인하기"]}
            boldParts={[0]}
          />

          <div className={timetablestyles.recommendListWrapper}>
            {recommendData.map((item) => (
              <RecommendCard
                key={item.id}
                itemData={item}
                onCustomizeClick={() => handleCustomizeClick(item.id)}
              />
            ))}
          </div>
        </section>

        <section className={timetablestyles.moretimetableSection}>
          <SectionHeader
            subtitle="더 많은 페스티벌의"
            mainTitleLines={["타임테이블", "을\u00A0확인해\u00A0보세요!"]}
            boldParts={[0]}
          />
          
          <div className={timetablestyles.sortOptions}>
            {sortOptions.map((option) => (
              <span
                key={option.key}
                className={`${timetablestyles.sortButton} ${
                  currentSort === option.key ? timetablestyles.active : ""
                }`}
                // ⭐️ 정렬 버튼 클릭 시 currentSort 상태 업데이트 (-> useEffect 실행) ⭐️
                onClick={() => setCurrentSort(option.key)}
              >
                {option.label}
              </span>
            ))}
          </div>
          
          {/* ⭐️ 로딩 및 에러 상태 표시 ⭐️ */}
          {isLoading && <p className={timetablestyles.loadingText}>페스티벌 목록을 불러오는 중...</p>}
          {error && <p className={timetablestyles.errorText}>{error}</p>}
          
          {/* ⭐️ 데이터가 로드되었을 때만 목록 표시 ⭐️ */}
          {!isLoading && !error && displayFestivalData.length > 0 && (
            <ul className={timetablestyles.timetableList}>
              {displayFestivalData.map((item) => (
                <FestivalListItem
                  key={item.id}
                  itemData={item}
                  onClick={() => handleCustomizeClick(item.id)}
                />
              ))}
            </ul>
          )}
          
          {!isLoading && !error && displayFestivalData.length === 0 && (
            <p className={timetablestyles.noDataText}>해당 조건에 맞는 페스티벌이 없습니다.</p>
          )}

        </section>
      </div>
    </>
  );
};

export default TimetableMainPage;