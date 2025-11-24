import { useState } from "react";
import myConcertsStyle from "../css/pages/myconcert.module.css";
import MyConcertsCard from "../components/MyConcertsCard";

interface Concert {
  id: number;
  festivalName: string;
  location: string;
  date: string;
  liked: boolean;
}

const MyConcert = () => {
  const [concerts, setConcerts] = useState<Concert[]>([ //연동 전 더미데이터
    {
      id: 1,
      festivalName: "COUNTDOWN FANTASY 2025-2026",
      location: "일산 킨텍스",
      date: "2025.12.20 - 12.21",
      liked: true,
    },
    {
      id: 2,
      festivalName: "COUNTDOWN FANTASY 2025-2026",
      location: "일산 킨텍스",
      date: "2025.12.20 - 12.21",
      liked: true,
    },
    {
      id: 3,
      festivalName: "COUNTDOWN FANTASY 2025-2026",
      location: "일산 킨텍스",
      date: "2025.12.20 - 12.21",
      liked: true,
    },
    {
      id: 4,
      festivalName: "COUNTDOWN FANTASY 2025-2026",
      location: "일산 킨텍스",
      date: "2025.12.20 - 12.21",
      liked: true,
    },
    {
      id: 5,
      festivalName: "COUNTDOWN FANTASY 2025-2026",
      location: "일산 킨텍스",
      date: "2025.12.20 - 12.21",
      liked: true,
    },
  ]);
 

  // 하트 비워지면 제거
  const handleToggle = (id: number) => {
    setConcerts((prev) =>
      prev
        .map((c) =>
          c.id === id ? { ...c, liked: !c.liked } : c
        )
        .filter((c) => c.liked) 
    );
  };

  return (
    <div className={myConcertsStyle.MyConcerts}>
      <div className={myConcertsStyle.MyConcertstitle}>My Concerts</div>

      {concerts.map((concert) => (
        <MyConcertsCard
          key={concert.id}
          id={concert.id}
          festivalName={concert.festivalName}
          location={concert.location}
          date={concert.date}
          liked={concert.liked}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default MyConcert;
