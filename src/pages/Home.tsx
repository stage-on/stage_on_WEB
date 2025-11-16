import Alarm from "../components/Alarm"
import BandCardName from "../components/BandCardName"
import concertimage from "../assets/component/home/concert_image.svg";

type Concert = {
  id: number;
  name: string;
  date: string;
  image: string;
};

type Band = {
  id: number;
  name: string;
  concerts: Concert[];
};

const favoriteBands = [ // 연동전 더미데이터
  {
    id: 1,
    name: "쏜애플",
    concerts: [
      {
        id: 1,
        name: "쏜애플 콘서트 '바다와 구름과 무대'",
        date: "2025.12.20 - 2025.12.21",
        image: concertimage,
         isNew: true,
      },
      {
        id: 2,
        name: "쏜애플 콘서트 '도시전설'",
        date: "2024.12.14 - 2024.12.15",
        image: concertimage,
      },
      {
        id: 3,
        name: "쏜애플 콘서트 '불꽃'",
        date: "2025.06.22",
        image: concertimage,
      },
    ],
  },
  {
    id: 2,
    name: "유다빈밴드",
    concerts: [
      { id: 1, name: "콘서트 이름", date: "2025.12.20 - 2025.12.21", image: concertimage, isNew: true, },
      { id: 2, name: "콘서트 이름", date: "2025.12.20 - 2025.12.21", image: concertimage },
      { id: 3, name: "콘서트 이름", date: "2025.12.20 - 2025.12.21", image: concertimage },
    ],
  },
  {
    id: 3,
    name: "터치드",
    concerts: [
      { id: 1, name: "콘서트 이름", date: "2025.12.20 - 2025.12.21", image: concertimage },
      { id: 2, name: "콘서트 이름", date: "2025.12.20 - 2025.12.21", image: concertimage },
      { id: 3, name: "콘서트 이름", date: "2025.12.20 - 2025.12.21", image: concertimage },
    ],
  },
];

const Home = () => {
  return (
    <>
   <Alarm/>
     {favoriteBands.map((band) => (
        <BandCardName key={band.id} band={band} />
      ))}
    </>
  
  )
}

export default Home