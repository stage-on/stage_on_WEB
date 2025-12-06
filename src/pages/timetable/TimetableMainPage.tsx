// src/pages/timetable/TimetableMainPage.tsx (날짜 형식 수정 최종 버전)

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
  prfpdfrom: string; // 시작일 (YYYY-MM-DD)
  prfpdto: string;   // 종료일 (YYYY-MM-DD)
  fcltynm: string; 
  poster: string; 
  
  performanceId?: number; 
  title?: string; 
  posterUrl?: string; 
  
  newstate?: boolean; 
  isLiked?: boolean; // 이전 필드는 옵셔널로 유지
  likeCount?: number; 
}

// ⭐️ [UI 타입] 최종 FestivalItem 타입 ⭐️
export interface FestivalItem {
  id: number;
  title: string;
  isLiked: boolean; 
  location: string;
  date: string; // YYYY.MM.DD - MM.DD 형식으로 저장됨
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
          isLiked: true, 
          location: item.fcltynm,
          // ⚠️ 날짜 형식 수정 적용
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.slice(5).replace(/-/g, '.')}`, 
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

  
  const fetchMyTimetables = useCallback(async () => {
    setIsMyListLoading(true);
    setMyListError(null);
    
    const API_ENDPOINT = '/festivals/custom'; 
    
    try {
      const response = await api.get(API_ENDPOINT); 
      const apiData: KopisFestivalItem[] = response.data.data || response.data; 
      
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm,
          isLiked: item.isLiked ?? item.newstate ?? false, 
          location: item.fcltynm, 
          // ⚠️ 날짜 형식 수정 적용
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.slice(5).replace(/-/g, '.')}`, 
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
  }, []);


  // ⭐️ 더 많은 페스티벌 목록 조회 (좋아요 상태 영구 유지를 위해 사용자 좋아요 정보 병합) ⭐️
  const fetchMoreFestivals = useCallback(async (sortKey: string) => {
    setIsLoading(true);
    setError(null);
    
    // 1. 좋아요 상태 확인을 위해 사용자의 관심 목록 ID를 가져옵니다.
    let userLikedIds: Set<number> = new Set();
    try {
        const likesResponse = await api.get('/likes/my/festivals');
        const likedApiData: any[] = likesResponse.data.data || likesResponse.data;
        userLikedIds = new Set(likedApiData.map(item => item.performanceId || item.id)); 
    } catch (err) {
        console.warn("⚠️ 관심 목록 로드 실패: 메인 목록은 기본 isLiked=false로 진행됩니다.");
    }

    try {
        // 2. 메인 페스티벌 목록을 가져옵니다.
        const response = await api.get(`/kopis/performances/festivals?sort=${sortKey}`); 
        const apiData: KopisFestivalItem[] = response.data.data || response.data; 
        
        // 3. 메인 목록에 사용자 좋아요 상태를 병합(Merge)합니다.
        const transformedData: FestivalItem[] = apiData.map(item => ({
            id: item.id,
            title: item.prfnm, 
            isLiked: userLikedIds.has(item.id), 
            location: item.fcltynm, 
            // ⚠️ 날짜 형식 수정 적용
            date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.slice(5).replace(/-/g, '.')}`, 
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


  // 좋아요 상태 변경 성공 콜백: 모든 목록에 로컬 업데이트를 적용합니다.
  const handleLikeChangeSuccess = useCallback((festivalId: number, newIsLikedState: boolean) => {
    
    // 1. '더 많은 페스티벌' 목록 (morefestival) 로컬 업데이트 (즉시 반영)
    setMorefestival(prevList => {
        const newList = prevList.map(item => 
            item.id === festivalId ? { ...item, isLiked: newIsLikedState } : item
        );
        return newList;
    });
    
    // 2. '나의 타임테이블' 목록 (myTimetables) 로컬 업데이트 (즉시 반영)
    setMyTimetables(prevList => {
        const newList = prevList.map(item => 
            item.id === festivalId ? { ...item, isLiked: newIsLikedState } : item
        );
        return newList;
    });
    
    // 3. '나의 관심 페스티벌' 목록을 API로 새로고침 (이 목록은 항목 자체가 추가/제거되므로 API 호출이 필요)
    fetchMyFavorites(); 
    
  }, [fetchMyFavorites]);


  useEffect(() => {
    fetchMyTimetables();
    fetchMyFavorites(); 
  }, [fetchMyFavorites, fetchMyTimetables]); 
  
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
                  onLikeChangeSuccess={(id, newState) => handleLikeChangeSuccess(id, newState)} 
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
                  onLikeChangeSuccess={(id, newState) => handleLikeChangeSuccess(id, newState)} 
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