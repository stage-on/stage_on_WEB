import React, { useState, useEffect } from "react";
import HomeLayout from "../../layout/HomeLayout.tsx";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
import FestivalListItem from "../../components/timetable/FestivalListItem";
import SectionHeader from "../../components/SectionHeader";
import RecommendCard from "../../components/timetable/RecommendCard";

const arrowSVG = "/assets/icons/arrow.svg";

// ⭐️ 정렬 옵션 정의
const sortOptions = [
  { label: "최신 등록순", key: "latest" },
  { label: "인기순", key: "likes" },
  { label: "예매 임박순", key: "deadline" },
];

const TimetableMainPage = () => {
  const [timetableList, setTimetableList] = useState([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState([]);
  const [morefestival, setMorefestival] = useState([]);

  // ⭐️ 현재 선택된 정렬 상태를 추적하는 state 추가
  const [currentSort, setCurrentSort] = useState(sortOptions[0].key); // 기본값: latest

  const handleCustomizeClick = (festivalId) => {
    console.log(`Festival ID ${festivalId}의 커스텀 페이지로 이동 요청.`);
    alert(`[라우팅]: 페스티벌 ID ${festivalId}의 커스텀 페이지로 이동합니다.`);
  };

  // ⭐️ API 연동을 위한 useEffect 구조 (currentSort 변경 시 재실행)
  useEffect(() => {
    async function fetchSortedFestivals() {
      // currentSort 상태가 변경될 때마다 실행됨
      const sortParam = currentSort;
      console.log(`[API 준비됨 가정] 현재 정렬 기준: ${sortParam}`);
      
      /* // 🚨 [향후 API 연동 시 사용할 실제 로직] 🚨
      try {
          // const response = await fetch(`/api/festivals?sort=${sortParam}`);
          // const data = await response.json();
          // setMorefestival(data); 
      } catch (error) {
          // console.error("데이터 로드 실패", error);
      }
      */
      
      // UI가 비어있지 않도록 Mock Data는 최초 1회만 로드
      if (morefestival.length === 0) {
        const mockData3 = [
          { id: 7, title: "페스티벌 이름", likes: 999, location: "페스티벌 위치", date: "2025.12.20 - 12.21", thumbnailUrl: "/path/to/img1.png" },
          { id: 8, title: "페스티벌 이름", likes: 999, location: "페스티벌 위치", date: "2025.12.20 - 12.21", thumbnailUrl: "/path/to/img1.png" },
          { id: 9, title: "페스티벌 이름", likes: 999, location: "페스티벌 위치", date: "2025.12.20 - 12.21", thumbnailUrl: "/path/to/img1.png" },
          { id: 10, title: "페스티벌 이름", likes: 999, location: "페스티벌 위치", date: "2025.12.20 - 12.21", thumbnailUrl: "/path/to/img1.png" },
          { id: 11, title: "페스티벌 이름", likes: 999, location: "페스티벌 위치", date: "2025.12.20 - 12.21", thumbnailUrl: "/path/to/img1.png" },
          { id: 12, title: "페스티벌 이름", likes: 999, location: "페스티벌 위치", date: "2025.12.20 - 12.21", thumbnailUrl: "/path/to/img1.png" },
        ];
        setMorefestival(mockData3);
      }
    }
    
    fetchSortedFestivals();
  }, [currentSort]); // currentSort가 의존성 배열에 추가되어 상태 변화 시 API 호출 준비

  // 기존 초기 데이터 로드 (timetableList, recommendedFestivals)
  useEffect(() => {
    const mockData1 = [
      {
        id: 1,
        title: "그랜드 민트 페스티벌 2025",
        likes: 12,
        location: "일산 킨텍스",
        date: "2025.12.20 - 2025.12.21",
        thumbnailUrl: "/path/to/img1.png",
      },
      {
        id: 2,
        title: "COUNTDOWN FANTASY 2025-2026",
        likes: 10,
        location: "일산 킨텍스",
        date: "2025.12.30 - 2025.12.31",
        thumbnailUrl: "/path/to/img2.png",
      },
    ];
    setTimetableList(mockData1);

    const mockData2 = [
      {
        id: 3,
        title: "COUNTDOWN FANTASY 2025-2026",
        date: "2025.12.20 - 2025.12.21",
        thumbnailUrl: "/path/to/poster1.png",
      },
      {
        id: 4,
        title: "DMZ 피스트레인 뮤직 페스티벌 2025",
        date: "2025.10.18 - 2025.10.19",
        thumbnailUrl: "/path/to/poster2.png",
      },
      {
        id: 5,
        title: "2025 부산 락 페스티벌",
        date: "2025.12.20 - 2025.12.21",
        thumbnailUrl: "/path/to/poster3.png",
      },
      {
        id: 6,
        title: "서울 재즈 페스티벌 2025",
        date: "2025.05.28 - 2025.05.30",
        thumbnailUrl: "/path/to/poster4.png",
      },
    ];
    setRecommendedFestivals(mockData2);
  }, []);

  const listData = timetableList;
  const recommendData = recommendedFestivals;
  // 임시 정렬 로직이 없으므로 morefestival을 그대로 사용
  const displayFestivalData = morefestival; 

  return (
    <>
      <HomeLayout />
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
                arrowSVG={arrowSVG}
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
                onCustomizeClick={handleCustomizeClick}
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
          
          {/* ⭐️ 필터링 버튼 UI 렌더링 ⭐️ */}
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
          

          <ul className={timetablestyles.timetableList}>
            {/* ⭐️ Mock Data를 렌더링 (순서는 변하지 않음) ⭐️ */}
            {displayFestivalData.map((item) => (
              <FestivalListItem
                key={item.id}
                itemData={item}
                arrowSVG={arrowSVG}
              />
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default TimetableMainPage;