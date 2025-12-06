// src/pages/timetable/TimetableMainPage.tsx (전체 코드 - likeCount 제거 후)

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
  likeCount?: number; // API 응답에는 포함될 수 있지만, UI 로직에서는 사용하지 않음
}

// ⭐️ [UI 타입] 최종 FestivalItem 타입 (likeCount 제거) ⭐️
export interface FestivalItem {
  id: number;
  title: string;
  // likeCount: number; // UI에서 사용하지 않으므로 제거
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
  const [myFavorites, setMyFavorites] = useState<FestivalItem[]>([]); 
  const [recommendedFestivals, setRecommendedFestivals] = useState<RecommendItem[]>([]); 
  
  const [morefestival, setMorefestival] = useState<FestivalItem[]>([]);
  const [currentSort, setCurrentSort] = useState(sortOptions[0].key); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMyListLoading, setIsMyListLoading] = useState(true); 
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false); 
  
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
          isLiked: true, // 이 목록은 무조건 좋아요 상태임
          location: item.fcltynm,
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.replace(/-/g, '.')}`, 
          thumbnailUrl: item.posterUrl,
      }));

      setMyFavorites(transformedData); 
      setRecommendedFestivals(transformedData as RecommendItem[]); 
      
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
    
    const API_ENDPOINT = '/festivals/custom'; 
    
    try {
      const response = await api.get(API_ENDPOINT); 
      const apiData: KopisFestivalItem[] = response.data.data || response.data; 
      
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm,
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
      // ⭐️ 핵심 GET 요청: 이 응답에서 isLiked가 true로 와야 함 ⭐️
      const response = await api.get(`/kopis/performances/festivals?sort=${sortKey}`); 
      const apiData: KopisFestivalItem[] = response.data; 
      
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm, 
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
    // 좋아요가 성공하면 관련 목록을 모두 새로고침
    fetchMyFavorites(); 
    fetchMoreFestivals(currentSort); 
  }, [fetchMyFavorites, fetchMoreFestivals, currentSort]);


  useEffect(() => {
    fetchMyTimetables();
    fetchMyFavorites(); 
  }, [fetchMyFavorites]); 
  
  useEffect(() => {
    fetchMoreFestivals(currentSort);
  }, [currentSort, fetchMoreFestivals]); 


  const myTimetableDisplayData = myTimetables; 
  const recommendData = recommendedFestivals; 
  const displayFestivalData = morefestival; 

  return (
    <>
       <Alarm></Alarm>
      <div className={timetablestyles.mainContentWrapper}>
        
        {/* --- 1. 나의 타임테이블 섹션 --- */}
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

        
        {/* --- 2. 나의 관심 페스티벌의 타임테이블 확인하기 --- */}
        <section className={timetablestyles.check}>
          <SectionHeader
            subtitle="나의 관심 페스티벌의"
            mainTitleLines={["타임테이블\u00A0", "확인하기"]}
            boldParts={[0]}
          />

          {isFavoritesLoading && <p className={timetablestyles.loadingText}>관심 목록을 불러오는 중...</p>}
          {favoritesError && <p className={timetablestyles.errorText}>{favoritesError}</p>}
          
          {!isFavoritesLoading && !favoritesError && recommendData.length > 0 && (
            <div className={timetablestyles.recommendListWrapper}>
              {recommendData.map((item) => (
                <RecommendCard
                  key={item.id}
                  itemData={item} 
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

        {/* --- 3. 더 많은 페스티벌 섹션 --- */}
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