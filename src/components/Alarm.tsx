
import pushpin from "./../assets/component/home/Pushpin.svg"
import alarmStyle from "../css/components/alarm.module.css";

const Alarm = () => {
  return (
    <div className={alarmStyle.alarmContainer}>
      <img className={alarmStyle.pushpin} src={pushpin}/>
      <span className={alarmStyle.concertName}>도시전설</span>
      <span className={alarmStyle.subText}>의 예매일까지</span>
      <span className={alarmStyle.concertData}>5</span>
       <span className={alarmStyle.subText}>일 남았어요!</span>
    </div>
  )
}

export default Alarm