import React, { useState, useEffect } from "react";
import HomeLayout from "../../layout/HomeLayout";
import timetablestyles from "../../css/pages/timetable/timetablemain.module.css";
// ✅ MyTimetable 컴포넌트 임포트는 그대로 유지합니다 (리스트 아이템을 렌더링하므로)
import MyTimetable from "../../components/timetable/MyTimetable"; 
// ⭐️ SectionHeader 컴포넌트 임포트 추가 ⭐️
import SectionHeader from "../../components/SectionHeader";

const arrowSVG = "/assets/icons/arrow.svg";

const TimetableMainPage = () => {
  const [timetableList, setTimetableList] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        title: "그랜드 민트 페스티벌 2025",
        likes: 12,
        location: "일산 킨텍스",
        date: "2025.12.20 - 12.21",
        thumbnailUrl: "/path/to/img1.png",
      },
      {
        id: 2,
        title: "COUNTDOWN FANTASY 2025-2026",
        likes: 10,
        location: "일산 킨텍스",
        date: "2025.12.30 - 12.31",
        thumbnailUrl: "/path/to/img2.png",
      },
    ];
    setTimetableList(mockData);
  }, []);

  const listData = timetableList;

  return (
    <>
      <HomeLayout />
      <div className={timetablestyles.mainContentWrapper}>
        <section className={timetablestyles.mytimetableSection}>
          
          {/* ⭐️ 기존 timetableHeaderGroup 구조를 SectionHeader 컴포넌트로 대체 ⭐️ */}
          <SectionHeader
            subtitle="공연 관람이 며칠 안 남았다면?"
            mainTitleLines={["나의\u00A0", "타임테이블"]}
            boldParts={[1]} // 두 번째 줄인 "타임테이블"만 굵게 표시
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
      </div>
    </>
  );
};

export default TimetableMainPage;