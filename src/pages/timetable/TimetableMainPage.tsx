// src/pages/timetable/TimetableMainPage.tsx (최종 수정: 좋아요 목록 섹션 제거 및 데이터 흐름 변경)

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
import FestivalListItem from "../../components/timetable/FestivalListItem";
import SectionHeader from "../../components/SectionHeader";
import RecommendCard from "../../components/timetable/RecommendCard";
import Alarm from "../../components/Alarm";
import api from "../../api/api"; 

// ⭐️ [가정] API 응답 타입 ⭐️
export interface KopisFestivalItem {
  id: number;
  mt20id: string; 
  prfnm: string; 
  prfpdfrom: string; 
  prfpdto: string; 
  fcltynm: string; 
  poster: string; 
  
  performanceId?: number; 
  title?: string; 
  posterUrl?: string; 

  isLiked?: boolean; 
  likeCount?: number; 
}

// ⭐️ [UI 타입] 최종 FestivalItem 타입 ⭐️
export interface FestivalItem {
  id: number;
  title: string;
  likeCount: number; 
  isLiked: boolean; 
  location: string;
  date: string; 
  thumbnailUrl: string;
}

// ⭐️ [RecommendItem 타입] FestivalItem과 동일한 구조를 가집니다. ⭐️
export interface RecommendItem extends FestivalItem {}

const sortOptions = [
  { label: "최신 등록순", key: "latest" },
  { label: "인기순", key: "likes" },
  { label: "예매 임박순", key: "deadline" },
];

const TimetableMainPage = () => {
  const navigate = useNavigate();
  
  const [myTimetables, setMyTimetables] = useState<FestivalItem[]>([]);
  // myFavorites 상태는 데이터를 가져오는 역할만 합니다.
  const [myFavorites, setMyFavorites] = useState<FestivalItem[]>([]); 
  
  // ⭐️ recommendedFestivals는 myFavorites 데이터를 받아 RecommendCard에 표시합니다. ⭐️
  const [recommendedFestivals, setRecommendedFestivals] = useState<RecommendItem[]>([]); 
  
  const [morefestival, setMorefestival] = useState<FestivalItem[]>([]);
  const [currentSort, setCurrentSort] = useState(sortOptions[0].key); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMyListLoading, setIsMyListLoading] = useState(true); 
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false); // 로딩 상태는 유지
  
  const [error, setError] = useState<string | null>(null);
  const [myListError, setMyListError] = useState<string | null>(null); 
  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  
  const handleCustomizeClick = (festivalId: number) => { 
    navigate(`/main/timetable/customize/${festivalId}`);
  };

  const handleMyTimetableClick = (festivalId: number) => { 
    navigate(`/main/timetable/my/${festivalId}`);
  };


  // ⭐️ 나의 관심 페스티벌 목록 조회 (좋아요 목록) ⭐️
  const fetchMyFavorites = useCallback(async () => {
    setIsFavoritesLoading(true);
    setFavoritesError(null);
    const API_ENDPOINT = '/likes/my/festivals'; 
    
    try {
      const response = await api.get(API_ENDPOINT); 
      const apiData: any[] = response.data.data || response.data; 
      
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.performanceId,
          title: item.title,
          likeCount: 0, 
          isLiked: true, 
          location: item.fcltynm,
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.replace(/-/g, '.')}`, 
          thumbnailUrl: item.posterUrl,
      }));

      // ⭐️ 핵심 변경: myFavorites와 recommendedFestivals를 모두 업데이트 ⭐️
      setMyFavorites(transformedData); 
      setRecommendedFestivals(transformedData as RecommendItem[]); // 데이터를 RecommendCard 섹션으로 전달
      
    } catch (err) {
      console.error(`❌ 나의 관심 페스티벌 목록 로드 중 오류 발생:`, err);
      setFavoritesError("관심 목록을 불러오는 데 실패했습니다.");
      setMyFavorites([]);
      setRecommendedFestivals([]);
    } finally {
      setIsFavoritesLoading(false);
    }
  }, []); 

  
  const fetchMyTimetables = async () => {
    setIsMyListLoading(true);
    setMyListError(null);
    // ... (나의 타임테이블 로직 유지) ...
    const API_ENDPOINT = '/festivals/custom'; 
    
    try {
      const response = await api.get(API_ENDPOINT); 
      const apiData: KopisFestivalItem[] = response.data.data || response.data; 
      
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm,
          likeCount: item.likeCount || 0, 
          isLiked: item.isLiked || false, 
          location: item.fcltynm, 
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.replace(/-/g, '.')}`, 
          thumbnailUrl: item.poster, 
      }));

      setMyTimetables(transformedData);
    } catch (err) {
      console.error(`❌ 나의 타임테이블 목록 (${API_ENDPOINT}) 로드 중 오류 발생:`, err);
      setMyListError("나의 타임테이블을 불러오는 데 실패했습니다. (로그인 상태 확인)");
      setMyTimetables([]);
    } finally {
      setIsMyListLoading(false);
    }
  };


  // 더 많은 페스티벌 목록 조회
  const fetchMoreFestivals = useCallback(async (sortKey: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/kopis/performances/festivals?sort=${sortKey}`); 
      const apiData: KopisFestivalItem[] = response.data; 
      
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm, 
          likeCount: item.likeCount || 0, 
          isLiked: item.isLiked || false, 
          location: item.fcltynm, 
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.replace(/-/g, '.')}`, 
          thumbnailUrl: item.poster, 
      }));

      setMorefestival(transformedData);
      
    } catch (err) {
      console.error("페스티벌 목록을 불러오는 중 오류 발생:", err);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      setMorefestival([]);
    } finally {
      setIsLoading(false);
    }
  }, []); 


  // 좋아요 상태 변경 시 목록 전체 새로고침 콜백
  const handleLikeChangeSuccess = useCallback(() => {
    // 좋아요 상태가 변경되면, 모든 목록을 새로고침하여 isLiked 상태를 동기화합니다.
    fetchMyFavorites(); // 이 호출이 recommendedFestivals를 새로고침합니다.
    fetchMoreFestivals(currentSort); 
  }, [fetchMyFavorites, fetchMoreFestivals, currentSort]);


  useEffect(() => {
    fetchMyTimetables();
    // ⭐️ 좋아요 목록을 가져와 recommendedFestivals에 설정 ⭐️
    fetchMyFavorites(); 
    
  }, [fetchMyFavorites]); 
  
  useEffect(() => {
    fetchMoreFestivals(currentSort);
  }, [currentSort, fetchMoreFestivals]); 


  const myTimetableDisplayData = myTimetables; 
  const recommendData = recommendedFestivals; // 좋아요 목록 데이터
  const displayFestivalData = morefestival; 

  return (
    <>
       <Alarm></Alarm>
      <div className={timetablestyles.mainContentWrapper}>
        
        {/* --- 1. 나의 타임테이블 섹션 (유지) --- */}
        <section className={timetablestyles.mytimetableSection}>
          <SectionHeader
            subtitle="공연 관람이 며칠 안 남았다면?"
            mainTitleLines={["나의\u00A0", "타임테이블"]}
            boldParts={[1]}
          />
          {isMyListLoading && <p className={timetablestyles.loadingText}>나의 타임테이블을 불러오는 중...</p>}
          {myListError && <p className={timetablestyles.errorText}>{myListError}</p>}

          {!isMyListLoading && !myListError && myTimetableDisplayData.length > 0 && (
            <ul className={timetablestyles.timetableList}>
              {myTimetableDisplayData.map((item) => (
                <FestivalListItem
                  key={item.id}
                  itemData={item}
                  onClick={() => handleMyTimetableClick(item.id)}
                  onLikeChangeSuccess={handleLikeChangeSuccess} 
                />
              ))}
            </ul>
          )}
          
          {!isMyListLoading && !myListError && myTimetableDisplayData.length === 0 && (
            <p className={timetablestyles.noDataText}>나만의 타임테이블을 만들어 보세요!</p>
          )}
        </section>

        
        {/* ❌ 2. 나의 관심 페스티벌 섹션 (제거 완료) ❌ */}

        
        {/* --- 3. 나의 관심 페스티벌의 타임테이블 확인하기 (RecommendCard로 좋아요 목록 표시) --- */}
        <section className={timetablestyles.check}>
          <SectionHeader
            subtitle="나의 관심 페스티벌의"
            mainTitleLines={["타임테이블\u00A0", "확인하기"]}
            boldParts={[0]}
          />

          {isFavoritesLoading && <p className={timetablestyles.loadingText}>관심 목록을 불러오는 중...</p>}
          {favoritesError && <p className={timetablestyles.errorText}>{favoritesError}</p>}
          
          {/* 좋아요 목록이 로드되면 RecommendCard로 표시 */}
          {!isFavoritesLoading && !favoritesError && recommendData.length > 0 && (
            <div className={timetablestyles.recommendListWrapper}>
              {recommendData.map((item) => (
                <RecommendCard
                  key={item.id}
                  itemData={item} // 좋아요 목록 데이터
                  onCustomizeClick={() => handleCustomizeClick(item.id)}
                />
              ))}
            </div>
          )}
          
          {!isFavoritesLoading && !favoritesError && recommendData.length === 0 && (
            <p className={timetablestyles.noDataText}>관심 페스티벌 데이터가 없습니다.</p>
          )}
        </section>
        {/* --- */}

        {/* --- 4. 더 많은 페스티벌 섹션 (유지) --- */}
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
                onClick={() => setCurrentSort(option.key)}
              >
                {option.label}
              </span>
            ))}
          </div>
          
          {isLoading && <p className={timetablestyles.loadingText}>페스티벌 목록을 불러오는 중...</p>}
          {error && <p className={timetablestyles.errorText}>{error}</p>}
          
          {!isLoading && !error && displayFestivalData.length > 0 && (
            <ul className={timetablestyles.timetableList}>
              {displayFestivalData.map((item) => (
                <FestivalListItem
                  key={item.id}
                  itemData={item}
                  onClick={() => handleCustomizeClick(item.id)}
                  onLikeChangeSuccess={handleLikeChangeSuccess} 
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