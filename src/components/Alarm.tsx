import { useEffect, useState } from "react";
import pushpin from "./../assets/component/home/Pushpin.svg";
import alarmStyle from "../css/components/alarm.module.css";


type AlarmItem = {
  id: number;
  concertName: string;
  daysLeft: number;  
};

// 캐러셀 효과 Test 더미 데이터
const dummyAlarms: AlarmItem[] = [
  { id: 1, concertName: "도시전설", daysLeft: 5 },
  { id: 2, concertName: "바다와 구름과 무대", daysLeft: 12 },
  { id: 3, concertName: "불꽃", daysLeft: 30 },
];

const Alarm = () => {
  const [index, setIndex] = useState<number>(0);
  
  const current = dummyAlarms[index];

  // 캐러셀 효과 15초 설정
  useEffect(() => {
    // 알림 1개 이하시 X
    if (dummyAlarms.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % dummyAlarms.length);
    }, 15000); // 15초

    return () => clearInterval(timer); 
  }, []);

  if (!current) return null;

  return (
    <div className={alarmStyle.alarmContainer}>
      <img className={alarmStyle.pushpin} src={pushpin} />
      <span className={alarmStyle.concertName}>{current.concertName}</span>
      <span className={alarmStyle.subText}>의 예매일까지</span>
      <span className={alarmStyle.concertData}>{current.daysLeft}</span>
      <span className={alarmStyle.subText}>일 남았어요!</span>
    </div>
  );
};

export default Alarm;
