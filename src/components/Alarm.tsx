import { useEffect, useState } from "react";
import pushpin from "./../assets/component/home/Pushpin.svg";
import alarmStyle from "../css/components/alarm.module.css";
import { getMyBandPerformances } from "../api/kopisApi";

type AlarmItem = {
  id: string;
  bandName: string;
  concertName: string;
  daysLeft: number;
};

const calcDaysLeft = (dateStr: string): number => {
  if (!dateStr) return -1;

  const normalized = dateStr.replace(/\./g, "-").slice(0, 10);
  const [y, m, d] = normalized.split("-").map(Number);

  if (!y || !m || !d) return -1;

  const today = new Date();
  const target = new Date(y, m - 1, d);

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const Alarm = () => {
  const [index, setIndex] = useState<number>(0);
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

 
  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const bands = await getMyBandPerformances();

        const list: AlarmItem[] = [];

        bands.forEach((band) => {
          band.performances.forEach((perf) => {
            const daysLeft = calcDaysLeft(perf.prfpdfrom);

          
            if (daysLeft >= 0) {
              list.push({
                id: perf.mt20id,
                bandName: band.artistName,
                concertName: perf.prfnm,
                daysLeft,
              });
            }
          });
        });

        
        list.sort((a, b) => a.daysLeft - b.daysLeft);

        setAlarms(list);
        setIndex(0);
      } catch (e) {
        console.error("알람 데이터 불러오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlarms();
  }, []);


  useEffect(() => {
    if (alarms.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % alarms.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [alarms.length]);

  const current = alarms[index];


  if (isLoading) {
    return null;
  }

  // 공연이 없을 경우 
  if (!current) {
    return (
      <div className={alarmStyle.alarmContainer}>
        <img className={alarmStyle.pushpin} src={pushpin} />
        <span className={alarmStyle.textWrap}>
          <span className={alarmStyle.subText}>
            현재 예정된 공연 알림이 없어요.
          </span>
        </span>
      </div>
    );
  }

  // 3) 정상 알림
  return (
    <div className={alarmStyle.alarmContainer}>
      <img className={alarmStyle.pushpin} src={pushpin} />
      <span className={alarmStyle.textWrap}>
        <span className={alarmStyle.concertName}>{current.bandName}</span>
        <span className={alarmStyle.subText}>의 </span>
        <span className={alarmStyle.concertName}>{current.concertName}</span>
        <span className={alarmStyle.subText}>까지 </span>
        <span className={alarmStyle.concertData}>{current.daysLeft}</span>
        <span className={alarmStyle.subText}>일 남았어요!</span>
      </span>
    </div>
  );
};

export default Alarm;
