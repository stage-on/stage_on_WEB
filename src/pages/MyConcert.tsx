
import { useEffect, useState } from "react";
import myConcertsStyle from "../css/pages/myconcert.module.css";
import MyConcertsCard from "../components/MyConcertsCard";
import {
  getMyConcerts,
  cancelLikePerformance,
} from "../api/myConcerts";

import type { MyConcertResponse } from "../api/myConcerts";



interface Concert {
  id: number;     
  mt20id: string;    
  festivalName: string;
  location: string;   
  date: string;       
  liked: boolean;      
}


const formatDateRange = (from: string, to: string) => {
  if (!from || !to) return "";

  const [fromY, fromM, fromD] = from.split("-");
  const [, toM, toD] = to.split("-");

  return `${fromY}.${fromM}.${fromD} - ${toM}.${toD}`;
};

const MyConcert = () => {


  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyConcerts = async () => {
      try {
        const data: MyConcertResponse[] = await getMyConcerts();
           console.log("likes/my/concerts 응답", data);
        const mapped: Concert[] = data.map((c) => ({
          id: c.performanceId,
           mt20id: c.mt20id,
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

  
      setConcerts((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      alert("좋아요 취소가 실패하였습니다")

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
              mt20id={concert.mt20id}
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
