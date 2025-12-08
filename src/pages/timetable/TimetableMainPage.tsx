import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
import FestivalListItem from "../../components/timetable/FestivalListItem";
import SectionHeader from "../../components/SectionHeader";
import RecommendCard from "../../components/timetable/RecommendCard";
import Alarm from "../../components/Alarm";
import api from "../../api/api";

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
  newstate?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}

export interface FestivalItem {
  id: number;
  mt20id: string;
  title: string;
  isLiked: boolean;
  location: string;
  date: string;
  thumbnailUrl: string;
}

export interface RecommendItem extends FestivalItem {}

const TimetableMainPage = () => {
  const navigate = useNavigate();
  const [myTimetables, setMyTimetables] = useState<FestivalItem[]>([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState<RecommendItem[]>([]);
  const [morefestival, setMorefestival] = useState<FestivalItem[]>([]);

  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isMyListLoading, setIsMyListLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  const [moreError, setMoreError] = useState<string | null>(null);
  const [myListError, setMyListError] = useState<string | null>(null);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  
  const handleCustomizeClick = (festivalId: number) => {
    navigate(`/main/timetable/customize/${festivalId}`);
  };

  const handleMyTimetableClick = (festivalId: number) => {
    navigate(`/main/timetable/my/${festivalId}`);
  };

  const handleConcertDetailClick = (mt20id: string) => {
    navigate(`/main/concert/${mt20id}`); 
  };
  
  const fetchUserLikedIdsAndFavorites = useCallback(async () => {
    setIsFavoritesLoading(true);
    setFavoritesError(null);
    const API_ENDPOINT = "/likes/my/festivals";
    try {
      const response = await api.get(API_ENDPOINT);
      const apiData: any[] = response.data.data || response.data;
      
      const likedIds = new Set(apiData.map((item) => item.performanceId || item.id));
      
      const transformedData: RecommendItem[] = apiData.map((item) => ({
        id: item.performanceId || item.id,
        mt20id: item.mt20id,
        title: item.title,
        isLiked: true,
        location: item.fcltynm,
        date: `${item.prfpdfrom.replace(/-/g, ".")} - ${item.prfpdto
          .slice(5)
          .replace(/-/g, ".")}`,
        thumbnailUrl: item.posterUrl,
      }));
      setRecommendedFestivals(transformedData);
      
      return likedIds;
    } catch (err) {
      setFavoritesError("관심 목록을 불러오는 데 실패했습니다.");
      setRecommendedFestivals([]);
      return new Set<number>();
    } finally {
      setIsFavoritesLoading(false);
    }
  }, []);


  const fetchMyTimetables = useCallback(async (likedIds: Set<number>) => {
    setIsMyListLoading(true);
    setMyListError(null);

    const API_ENDPOINT = "/festivals/custom";

    try {
      const response = await api.get(API_ENDPOINT);
      const apiData: KopisFestivalItem[] = response.data.data || response.data;

      const transformedData: FestivalItem[] = apiData.map((item) => ({
        id: item.id,
        mt20id: item.mt20id,
        title: item.prfnm,
        isLiked: likedIds.has(item.id), 
        location: item.fcltynm,
        date: `${item.prfpdfrom.replace(/-/g, ".")} - ${item.prfpdto
          .slice(5)
          .replace(/-/g, ".")}`,
        thumbnailUrl: item.poster,
      }));

      setMyTimetables(transformedData);
    } catch (err) {
      setMyListError(
        "나의 타임테이블을 불러오는 데 실패했습니다. (로그인 상태 확인)"
      );
      setMyTimetables([]);
    } finally {
      setIsMyListLoading(false);
    }
  }, []);

  const fetchMoreFestivals = useCallback(async (likedIds: Set<number>) => {
    setIsMoreLoading(true);
    setMoreError(null);

    try {
      const response = await api.get(`/kopis/performances/festivals`);
      const apiData: KopisFestivalItem[] = response.data.data || response.data;

      const transformedData: FestivalItem[] = apiData.map((item) => ({
        id: item.id,
        mt20id: item.mt20id,
        title: item.prfnm,
        isLiked: likedIds.has(item.id), 
        location: item.fcltynm,
        date: `${item.prfpdfrom.replace(/-/g, ".")} - ${item.prfpdto
          .slice(5)
          .replace(/-/g, ".")}`,
        thumbnailUrl: item.poster,
      }));

      setMorefestival(transformedData);
    } catch (err) {
      setMoreError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      setMorefestival([]);
    } finally {
      setIsMoreLoading(false);
    }
  }, []);
  
  const handleLikeChangeSuccess = useCallback(
    (festivalId: number, newIsLikedState: boolean) => {
      setMorefestival((prevList) =>
        prevList.map((item) =>
          item.id === festivalId ? { ...item, isLiked: newIsLikedState } : item
        )
      );
      setMyTimetables((prevList) =>
        prevList.map((item) =>
          item.id === festivalId ? { ...item, isLiked: newIsLikedState } : item
        )
      );
     
      setRecommendedFestivals((prevList) => {
        if (newIsLikedState) {
          const itemToAdd = morefestival.find(item => item.id === festivalId);
          if (itemToAdd) {
            return [
              ...prevList,
              {...itemToAdd, isLiked: true} as RecommendItem
            ];
          }
          return prevList;
        } else {
          return prevList.filter(item => item.id !== festivalId) as RecommendItem[];
        }
      });
      
    },
    [morefestival] 
  );
  
  useEffect(() => {
    const loadData = async () => {
      const likedIds = await fetchUserLikedIdsAndFavorites();
      
      fetchMyTimetables(likedIds);
      fetchMoreFestivals(likedIds);
    };

    loadData();
  }, [fetchUserLikedIdsAndFavorites, fetchMyTimetables, fetchMoreFestivals]);


  const myTimetableDisplayData = myTimetables;
  const recommendData = recommendedFestivals;
  const displayFestivalData = morefestival;

  return (
    <>
      <Alarm />
      <div className={timetablestyles.mainContentWrapper}>

        {(isMyListLoading || myListError || myTimetableDisplayData.length > 0) && (
          <section className={timetablestyles.mytimetableSection}>

            <SectionHeader
              subtitle="공연 관람이 며칠 안 남았다면?"
              mainTitleLines={["나의 ", "타임테이블"]}
              boldParts={[1]}
            />

            {isMyListLoading && (
              <p className={timetablestyles.loadingText}>
                나의 타임테이블을 불러오는 중...
              </p>
            )}

            {myListError && (
              <p className={timetablestyles.errorText}>{myListError}</p>
            )}

            {!isMyListLoading &&
              !myListError &&
              myTimetableDisplayData.length > 0 && (
                <ul className={timetablestyles.timetableList}>
                  {myTimetableDisplayData.map((item) => (
                    <FestivalListItem
                      key={item.id}
                      itemData={item}
                      onClick={() => handleMyTimetableClick(item.id)}
                      onLikeChangeSuccess={(id, newState) =>
                        handleLikeChangeSuccess(id, newState)
                      }
                    />
                  ))}
                </ul>
              )}

            {!isMyListLoading &&
              !myListError &&
              myTimetableDisplayData.length === 0 && (
                <p className={timetablestyles.noDataText}>
                  나만의 타임테이블을 만들어 보세요!
                </p>
              )}
          </section>
        )}

        {(isFavoritesLoading || favoritesError || recommendData.length > 0) && (
          <section className={timetablestyles.check}>

            <SectionHeader
              subtitle="나의 관심 페스티벌의"
              mainTitleLines={["타임테이블 ", "확인하기"]}
              boldParts={[0]}
            />

            {isFavoritesLoading && (
              <p className={timetablestyles.loadingText}>
                관심 목록을 불러오는 중...
              </p>
            )}

            {favoritesError && (
              <p className={timetablestyles.errorText}>{favoritesError}</p>
            )}

            {!isFavoritesLoading &&
              !favoritesError &&
              recommendData.length > 0 && (
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

            {!isFavoritesLoading &&
              !favoritesError &&
              recommendData.length === 0 && (
                <p className={timetablestyles.noDataText}>
                  관심 페스티벌 데이터가 없습니다.
                </p>
              )}
          </section>
        )}

        <section className={timetablestyles.moretimetableSection}>

          <SectionHeader
            subtitle="더 많은 페스티벌의"
            mainTitleLines={["타임테이블", "을 확인해 보세요!"]}
            boldParts={[0]}
          />

          {isMoreLoading && (
            <p className={timetablestyles.loadingText}>
              페스티벌 목록을 불러오는 중...
            </p>
          )}

          {moreError && <p className={timetablestyles.errorText}>{moreError}</p>}

          {!isMoreLoading && !moreError && displayFestivalData.length > 0 && (
            <ul className={timetablestyles.timetableList}>
              {displayFestivalData.map((item) => (
                <FestivalListItem
                  key={item.id}
                  itemData={item}
                  onClick={() => handleConcertDetailClick(item.mt20id)} 
                  onLikeChangeSuccess={(id, newState) =>
                    handleLikeChangeSuccess(id, newState)
                  }
                />
              ))}
            </ul>
          )}

          {!isMoreLoading && !moreError && displayFestivalData.length === 0 && (
            <p className={timetablestyles.noDataText}>
              해당 조건에 맞는 페스티벌이 없습니다.
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default TimetableMainPage;