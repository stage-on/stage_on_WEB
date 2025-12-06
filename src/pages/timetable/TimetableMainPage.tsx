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


  const fetchMyFavorites = useCallback(async () => {
    setIsFavoritesLoading(true);
    setFavoritesError(null);
    const API_ENDPOINT = "/likes/my/festivals";
    try {
      const response = await api.get(API_ENDPOINT);
      const apiData: any[] = response.data.data || response.data;
      const transformedData: FestivalItem[] = apiData.map((item) => ({
        id: item.performanceId,
        title: item.title,
        isLiked: true,
        location: item.fcltynm,
        date: `${item.prfpdfrom.replace(/-/g, ".")} - ${item.prfpdto
          .slice(5)
          .replace(/-/g, ".")}`,
        thumbnailUrl: item.posterUrl,
      }));

    
      setRecommendedFestivals(transformedData as RecommendItem[]);
    } catch (err) {
      setFavoritesError("관심 목록을 불러오는 데 실패했습니다.");

      setRecommendedFestivals([]);
    } finally {
      setIsFavoritesLoading(false);
    }
  }, []);

  const fetchMyTimetables = useCallback(async () => {
    setIsMyListLoading(true);
    setMyListError(null);

    let userLikedIds: Set<number> = new Set();
    try {
      const likesResponse = await api.get("/likes/my/festivals");
      const likedApiData: any[] = likesResponse.data.data || likesResponse.data;
      userLikedIds = new Set(
        likedApiData.map((item) => item.performanceId || item.id)
      );
    } catch (err) {}

    const API_ENDPOINT = "/festivals/custom";

    try {
      const response = await api.get(API_ENDPOINT);
      const apiData: KopisFestivalItem[] = response.data.data || response.data;

      const transformedData: FestivalItem[] = apiData.map((item) => ({
        id: item.id,
        title: item.prfnm,
        isLiked: userLikedIds.has(item.id),
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

  const fetchMoreFestivals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let userLikedIds: Set<number> = new Set();
    try {
      const likesResponse = await api.get("/likes/my/festivals");
      const likedApiData: any[] = likesResponse.data.data || likesResponse.data;
      userLikedIds = new Set(
        likedApiData.map((item) => item.performanceId || item.id)
      );
    } catch (err) {}

    try {
      const response = await api.get(`/kopis/performances/festivals`);
      const apiData: KopisFestivalItem[] = response.data.data || response.data;

      const transformedData: FestivalItem[] = apiData.map((item) => ({
        id: item.id,
        title: item.prfnm,
        isLiked: userLikedIds.has(item.id),
        location: item.fcltynm,
        date: `${item.prfpdfrom.replace(/-/g, ".")} - ${item.prfpdto
          .slice(5)
          .replace(/-/g, ".")}`,
        thumbnailUrl: item.poster,
      }));

      setMorefestival(transformedData);
    } catch (err) {
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      setMorefestival([]);
    } finally {
      setIsLoading(false);
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
     
      fetchMyFavorites(); 
    },
    [fetchMyFavorites]
  );

  useEffect(() => {
    fetchMyTimetables();
    fetchMyFavorites();
  }, [fetchMyFavorites, fetchMyTimetables]);

  useEffect(() => {
    fetchMoreFestivals();
  }, [fetchMoreFestivals]);

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

        {/* ⭐️ 관심 목록 섹션은 recommendData를 사용하므로 변경 없음 ⭐️ */}
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

          {isLoading && (
            <p className={timetablestyles.loadingText}>
              페스티벌 목록을 불러오는 중...
            </p>
          )}

          {error && <p className={timetablestyles.errorText}>{error}</p>}

          {!isLoading && !error && displayFestivalData.length > 0 && (
            <ul className={timetablestyles.timetableList}>
              {displayFestivalData.map((item) => (
                <FestivalListItem
                  key={item.id}
                  itemData={item}
                  onClick={() => handleCustomizeClick(item.id)}
                  onLikeChangeSuccess={(id, newState) =>
                    handleLikeChangeSuccess(id, newState)
                  }
                />
              ))}
            </ul>
          )}

          {!isLoading && !error && displayFestivalData.length === 0 && (
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