import React, { useState, useEffect } from "react";
import HomeLayout from "../../layout/HomeLayout";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
import MyTimetable from "../../components/timetable/MyTimetable"; 
import SectionHeader from "../../components/SectionHeader"; 
import RecommendCard from "../../components/timetable/RecommendCard"; 

const arrowSVG = "/assets/icons/arrow.svg";

const TimetableMainPage = () => {
  const [timetableList, setTimetableList] = useState([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState([]);

  // ⭐️ 클릭 핸들러: 부모 컴포넌트에 유지 ⭐️
  const handleCustomizeClick = (festivalId) => {
    console.log(`Festival ID ${festivalId}의 커스텀 페이지로 이동 요청.`);
    // 💡 여기에 실제 라우팅 로직 구현 (예: history.push)
    alert(`[라우팅]: 페스티벌 ID ${festivalId}의 커스텀 페이지로 이동합니다.`);
  };


  useEffect(() => {
    // 나의 타임테이블 데이터 (List 1)
    const mockData1 = [ 
      { id: 1, title: "그랜드 민트 페스티벌 2025", likes: 12, location: "일산 킨텍스", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/img1.png" },
      { id: 2, title: "COUNTDOWN FANTASY 2025-2026", likes: 10, location: "일산 킨텍스", date: "2025.12.30 - 2025.12.31", thumbnailUrl: "/path/to/img2.png" },
    ];
    setTimetableList(mockData1);

    // 추천/관심 페스티벌 데이터 (List 2)
    const mockData2 = [ 
      { id: 3, title: "COUNTDOWN FANTASY 2025-2026", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/poster1.png" },
      { id: 4, title: "DMZ 피스트레인 뮤직 페스티벌 2025", date: "2025.10.18 - 2025.10.19", thumbnailUrl: "/path/to/poster2.png" },
      { id: 5, title: "2025 부산 락 페스티벌", date: "2025.12.20 - 2025.12.21", thumbnailUrl: "/path/to/poster3.png" },
      { id: 6, title: "서울 재즈 페스티벌 2025", date: "2025.05.28 - 2025.05.30", thumbnailUrl: "/path/to/poster4.png" },
    ];
    setRecommendedFestivals(mockData2);
  }, []);

  const listData = timetableList;
  const recommendData = recommendedFestivals;

  return (
    <>
      <HomeLayout />
      <div className={timetablestyles.mainContentWrapper}>
        
        {/* 1. 나의 타임테이블 섹션 */}
        <section className={timetablestyles.mytimetableSection}>
          <SectionHeader
            subtitle="공연 관람이 며칠 안 남았다면?"
            mainTitleLines={["나의\u00A0", "타임테이블"]}
            boldParts={[1]} 
          />
          
          <ul className={timetablestyles.timetableList}>
            {listData.map((item) => (
              <MyTimetable
                key={item.id}
                itemData={item}
                arrowSVG={arrowSVG}
              />
            ))}
          </ul>
        </section>
        
        {/* ======================================= */}
        {/* 2. 관심 페스티벌 확인 섹션 */}
        {/* ======================================= */}
        <section className={timetablestyles.check}>
           <SectionHeader
            subtitle="나의 관심 페스티벌의"
            mainTitleLines={["타임테이블\u00A0", "확인하기"]}
            boldParts={[0, 1]} 
          />
          
          <div className={timetablestyles.recommendListWrapper}>
            {recommendData.map((item) => (
              // ⭐️ JSX 구조를 단순화하여 문법 오류를 방지합니다. ⭐️
              <RecommendCard
                key={item.id}
                itemData={item}
                // 클릭 핸들러를 prop으로 전달
                onCustomizeClick={handleCustomizeClick} 
              />
            ))}
          </div>
          
        </section>
      </div>
    </>
  );
};

export default TimetableMainPage;