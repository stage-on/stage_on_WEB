import { useEffect, useState } from "react";
import Alarm from "../components/Alarm";
import BandCardName from "../components/BandCardName";
import concertimage from "../assets/component/home/concert_image.svg";

import { getMyBandPerformances } from "../api/kopisApi";
import type { KopisBand, KopisPerformance } from "../api/kopisApi";

// 콘서트 타입 정의
type Concert = {
  id: number;     
  name: string;
  date: string;
  image: string;
  isNew?: boolean;
};

type FavoriteBand = {
  id: number;
  name: string;
  concerts: Concert[];
};

const mapPerformanceToConcert = (perf: KopisPerformance): Concert => {
  const period =
    perf.prfpdfrom === perf.prfpdto
      ? perf.prfpdfrom
      : `${perf.prfpdfrom} - ${perf.prfpdto}`;

  return {
  id: Number(perf.mt20id),        

    name: perf.prfnm,
    date: period,
    image: perf.poster || concertimage, 
    isNew: perf.newstate,
  };
};

const mapBandToFavoriteBand = (band: KopisBand): FavoriteBand => ({
  id: band.artistId,
  name: band.artistName,
  concerts: band.performances.map(mapPerformanceToConcert),
});

const Home = () => {
  const [favoriteBands, setFavoriteBands] = useState<FavoriteBand[]>([]);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const data = await getMyBandPerformances();
        const mapped = data.map(mapBandToFavoriteBand);
        setFavoriteBands(mapped);
      } catch (e) {
        console.error("관심 밴드 공연 불러오기 실패:", e);
      }
    };

    fetchBands();
  }, []);

  return (
    <>
      <Alarm />
      {favoriteBands.map((band) => (
        <BandCardName key={band.id} band={band} />
      ))}
    </>
  );
};

export default Home;
