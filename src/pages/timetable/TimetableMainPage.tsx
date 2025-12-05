// src/pages/timetable/TimetableMainPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
import FestivalListItem from "../../components/timetable/FestivalListItem";
import SectionHeader from "../../components/SectionHeader";
import RecommendCard from "../../components/timetable/RecommendCard";
import Alarm from "../../components/Alarm";
import api from "../../api/api"; 

// ⭐️ API 응답 타입 정의 (KopisFestivalItem: /kopis 및 /festivals/custom 모두 사용) ⭐️
export interface KopisFestivalItem {
  id: number; // FestivalItem의 id와 매핑
  mt20id: string; // Kopis 공연 ID
  prfnm: string; // FestivalItem의 title과 매핑 (공연명)
  prfpdfrom: string; // 공연 시작일 (ex. "2025-12-04")
  prfpdto: string; // 공연 종료일 (ex. "2025-12-04")
  fcltynm: string; // FestivalItem의 location과 매핑 (시설명)
  prfruntime: string; // 공연 런타임
  prfage: string; // 관람 연령
  pcseguidance: string; // 가격 정보
  poster: string; // FestivalItem의 thumbnailUrl과 매핑 (포스터 URL)
  prfstate: string; // 공연 상태
  dtguidance: string; // 시간 안내
  tkstdate: string; // 티켓 오픈일
  tksttime: { hour: number; minute: number; second: number; nano: number; };
  typeofcon: number;
  newstate: boolean;
  locationUrl: string;
  styurls: { relatenm: string; relateurl: string; }[];
  relates: { relatenm: string; relateurl: string; }[];
  days: { date: string; open: { hour: number; minute: number; second: number; nano: number; }; close: { hour: number; minute: number; second: number; nano: number; }; }[];
  slots: { date: string; stageId: string; stageName: string; stageOrder: number; artist: string; start: { hour: number; minute: number; second: number; nano: number; }; end: { hour: number; minute: number; second: number; nano: number; }; minutes: number; img: string; note: string; }[];
  fesLinks: { relatenm: string; url: string; }[];
  artistPics: { date: string; relatenm: string; url: string; }[];
}


// ⭐️ UI 컴포넌트에 필요한 최종 FestivalItem 타입 (기존 유지) ⭐️
export interface FestivalItem {
  id: number;
  title: string;
  likes: number; // API에 없는 경우 0으로 임시 설정
  location: string;
  date: string; // "YYYY.MM.DD - YYYY.MM.DD" 형식
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
  
  // ⭐️ [수정] 나의 타임테이블 목록 상태를 API 데이터로 변경 ⭐️
  const [myTimetables, setMyTimetables] = useState<FestivalItem[]>([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState<RecommendItem[]>([]);
  
  // ⭐️ API 데이터 상태 ⭐️
  const [morefestival, setMorefestival] = useState<FestivalItem[]>([]);
  const [currentSort, setCurrentSort] = useState(sortOptions[0].key); 
  
  // ⭐️ API 호출 상태 ⭐️
  const [isLoading, setIsLoading] = useState(false);
  // ⭐️ [추가] 나의 타임테이블 전용 로딩/에러 상태 ⭐️
  const [isMyListLoading, setIsMyListLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [myListError, setMyListError] = useState<string | null>(null); 


  // 1. 커스텀 '생성' 경로 이동 함수
  const handleCustomizeClick = (festivalId: number) => { 
    navigate(`/main/timetable/customize/${festivalId}`);
  };

  // 2. 나의 타임테이블 '수정' 경로 이동 함수
  const handleMyTimetableClick = (festivalId: number) => { 
    navigate(`/main/timetable/my/${festivalId}`);
  };
  
  // ⭐️ ⭐️ [새로운 API 호출] 나의 타임테이블 목록 조회 함수 ⭐️ ⭐️
  // API 주소: /festivals/custom
  const fetchMyTimetables = async () => {
    setIsMyListLoading(true);
    setMyListError(null);
    
    const API_ENDPOINT = '/festivals/custom'; 
    
    try {
      // ⭐️ GET /festivals/custom 호출 (인증 헤더 필요) ⭐️
      const response = await api.get(API_ENDPOINT); 
      
      // API 응답 데이터가 KopisFestivalItem[] 배열 형태라고 가정합니다.
      const apiData: KopisFestivalItem[] = response.data.data || response.data; 
      
      // ⭐️ API 응답을 FestivalItem 타입에 맞게 변환 (매핑 로직) ⭐️
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id, // FestivalListItem의 key와 id로 사용
          title: item.prfnm, // 공연명 (title)
          likes: 0, // 좋아요 데이터가 없다면 임시 값 사용
          location: item.fcltynm, // 시설명 (location)
          // prfpdfrom(시작일)과 prfpdto(종료일)을 조합하여 date 형식으로 만듦
          date: `${item.prfpdfrom.replace(/-/g, '.')} - ${item.prfpdto.replace(/-/g, '.')}`, 
          thumbnailUrl: item.poster, // 포스터 URL (thumbnailUrl)
      }));

      setMyTimetables(transformedData);
      console.log(`✅ [GET ${API_ENDPOINT}] 나의 타임테이블 목록 응답:`, response.data);
      
    } catch (err) {
      console.error(`❌ 나의 타임테이블 목록 (${API_ENDPOINT}) 로드 중 오류 발생:`, err);
      // 로그인 문제 등 4xx 에러 처리를 위해 에러 메시지 업데이트
      setMyListError("나의 타임테이블을 불러오는 데 실패했습니다. (로그인 상태 확인)");
      setMyTimetables([]);
    } finally {
      setIsMyListLoading(false);
    }
  };


  // ⭐️ API 호출 함수: 더 많은 페스티벌 목록 조회 (기존 유지) ⭐️
  const fetchMoreFestivals = async (sortKey: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // api 객체를 사용하여 GET 요청을 보냅니다.
      const response = await api.get(`/kopis/performances/festivals?sort=${sortKey}`); 
      
      // KopisFestivalItem[] 타입으로 가정합니다.
      const apiData: KopisFestivalItem[] = response.data; 
      
      // ⭐️ API 응답을 FestivalItem 타입에 맞게 변환 (매핑 로직) ⭐️
      const transformedData: FestivalItem[] = apiData.map(item => ({
          id: item.id,
          title: item.prfnm, 
          // Kopis API에 좋아요 데이터가 직접 없으므로 0으로 임시 처리
          likes: 0, 
          location: item.fcltynm, 
          // 시작일과 종료일을 묶어 date 필드 생성
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
  };


  useEffect(() => {
    // ⭐️ ⭐️ [수정] 1. 나의 타임테이블 API 호출로 대체 ⭐️ ⭐️
    fetchMyTimetables();
    
    // 2. 추천 페스티벌 (Mock Data 유지)
    const mockData2: RecommendItem[] = [
       { id: 3, title: "COUNTDOWN FANTASY 2025-2026", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/poster1.png" },
      { id: 4, title: "DMZ 피스트레인 뮤직 페스티벌 2025", date: "2025.10.18 - 2025.10.19", thumbnailUrl: "/path/to/poster2.png" },
      { id: 5, title: "2025 부산 락 페스티벌", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/poster3.png" },
      { id: 6, title: "서울 재즈 페스티벌 2025", date: "2025.05.28 - 2025.05.30", thumbnailUrl: "/path/to/poster4.png" },
     ];
    setRecommendedFestivals(mockData2);
    
  }, []);
  
  // ⭐️ currentSort 상태가 변경되거나 컴포넌트 마운트 시 API 호출 (기존 유지) ⭐️
  useEffect(() => {
    fetchMoreFestivals(currentSort);
  }, [currentSort]); 

  // ⭐️ [수정] myTimetables 상태 사용 ⭐️
  const myTimetableDisplayData = myTimetables; 
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

          {/* ⭐️ [수정] 나의 타임테이블 로딩/에러/데이터 표시 로직 ⭐️ */}
          {isMyListLoading && <p className={timetablestyles.loadingText}>나의 타임테이블을 불러오는 중...</p>}
          {myListError && <p className={timetablestyles.errorText}>{myListError}</p>}

          {!isMyListLoading && !myListError && myTimetableDisplayData.length > 0 && (
            <ul className={timetablestyles.timetableList}>
              {myTimetableDisplayData.map((item) => (
                <FestivalListItem
                  key={item.id}
                  itemData={item}
                  onClick={() => handleMyTimetableClick(item.id)}
                />
              ))}
            </ul>
          )}
          
          {!isMyListLoading && !myListError && myTimetableDisplayData.length === 0 && (
            <p className={timetablestyles.noDataText}>나만의 타임테이블을 만들어 보세요!</p>
          )}

        </section>

        {/* --- 추천 페스티벌 섹션은 변경 없음 --- */}
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
        {/* --- */}

        {/* --- 더 많은 페스티벌 섹션은 변경 없음 --- */}
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