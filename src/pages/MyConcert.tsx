// src/pages/MyConcert.tsx (파일 경로는 프로젝트 구조에 맞게)
import { useEffect, useState } from "react";
import myConcertsStyle from "../css/pages/myconcert.module.css";
import MyConcertsCard from "../components/MyConcertsCard";
import {
  getMyConcerts,
  cancelLikePerformance,
} from "../api/myConcerts"; // 함수들은 그대로

import type { MyConcertResponse } from "../api/myConcerts"; // 타입은 이렇게!

// 필요하다면 로그인 유지용
// import { useLocalStorage } from "../stores/useStore";  // 실제 경로에 맞게 수정

interface Concert {
  id: number;           // performanceId
  festivalName: string; // title
  location: string;     // fcltynm
  date: string;         // "YYYY.MM.DD - MM.DD" 형식
  liked: boolean;       // 항상 true (My Concerts라서)
}

// 날짜 포맷 유틸 (예: "2025-12-20", "2025-12-21" → "2025.12.20 - 12.21")
const formatDateRange = (from: string, to: string) => {
  if (!from || !to) return "";

  const [fromY, fromM, fromD] = from.split("-");
  const [, toM, toD] = to.split("-");

  return `${fromY}.${fromM}.${fromD} - ${toM}.${toD}`;
};

const MyConcert = () => {
  // useLocalStorage(); // 이 페이지도 로그인 체크 필요하면 주석 해제

  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  // 내 공연 목록 조회
  useEffect(() => {
    const fetchMyConcerts = async () => {
      try {
        const data: MyConcertResponse[] = await getMyConcerts();

        const mapped: Concert[] = data.map((c) => ({
          id: c.performanceId,
          festivalName: c.title,
          location: c.fcltynm,
          date: formatDateRange(c.prfpdfrom, c.prfpdto),
          liked: true,
        }));

        setConcerts(mapped);
      } catch (error) {
        console.error("내 공연 조회 실패:", error);
        alert("My Concerts 조회에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyConcerts();
  }, []);


  const handleToggle = async (id: number) => {

    try {
      await cancelLikePerformance(id);

      // 성공 시 해당 페이지에서 제거됨
      setConcerts((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      console.error("좋아요 취소 실패:", error);

    }
  };

  return (
    <div className={myConcertsStyle.MyConcerts}>
      <div className={myConcertsStyle.MyConcertstitle}>My Concerts</div>

      {loading && <div>불러오는 중...</div>}

      {!loading && concerts.length === 0 && (
        <div>좋아요한 공연이 없습니다.</div>
      )}

      {!loading &&
        concerts.map((concert) => (
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
