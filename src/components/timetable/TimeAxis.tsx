import React from 'react';
import gridStyles from '../../css/components/timetable/timetablegrid.module.css';
interface TimeAxisProps { startTimeMinutes:number; endTimeMinutes:number; totalHeightPixels:number }

const TimeAxis:React.FC<TimeAxisProps>=({startTimeMinutes,endTimeMinutes,totalHeightPixels})=>{
    const hourMarkers:number[]=[];
    for(let m=Math.ceil(startTimeMinutes/60)*60;m<=endTimeMinutes;m+=60) if(m<endTimeMinutes) hourMarkers.push(m);
    const minutesToTop=(minutes:number)=>(minutes-startTimeMinutes)/10*20;
    const minutesToTimeLabel=(minutes:number)=>String(Math.floor(minutes/60)).padStart(2,'0');
    return(
        <div className={gridStyles.timeAxis} style={{height:`${totalHeightPixels}px`}}>
            {hourMarkers.map(minutes=>(
                <React.Fragment key={minutes}>
                    <div className={gridStyles.timeLabel} style={{top:`${minutesToTop(minutes)}px`}}>{minutesToTimeLabel(minutes)}:00</div>
                    <div className={gridStyles.timeDivider} style={{top:`${minutesToTop(minutes)}px`}}/>
                </React.Fragment>
            ))}
        </div>
    );
};
export default TimeAxis;