// src/components/timetable/TimetableGrid.tsx (Stage 색상 매핑 + 동적 Stage + 횡스크롤)

import React, { useMemo } from 'react';
import ScheduleBlock from './ScheduleBlock';
import TimeAxis from './TimeAxis';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage';
import gridStyles from '../../css/components/timetable/timetablegrid.module.css';

interface TimetableGridProps {
    stageMap: Record<string, ScheduleItem[]>; 
    stageNames: Record<string, string>;
    allSchedules: ScheduleItem[];
    mode: 'customize' | 'my' | 'view';
}

const TIME_UNIT_MINUTES = 10; 
const PIXEL_PER_UNIT = 20;    
const STAGE_WIDTH = 152.5;

const timeToMinutes = (time: string) => { const [h,m] = time.split(':').map(Number); return h*60+m; };
const getStartTimeMinutes = (schedules: ScheduleItem[]) => schedules.length===0?900:Math.floor(Math.min(...schedules.map(s=>timeToMinutes(s.start)))/15)*15;

const TimetableGrid: React.FC<TimetableGridProps> = ({ stageMap, stageNames, allSchedules, mode }) => {
    const startTimeMinutes = useMemo(() => getStartTimeMinutes(allSchedules), [allSchedules]);
    const endTimeMinutes = useMemo(() => {
        if(allSchedules.length===0) return startTimeMinutes+120;
        const latestEnd = Math.max(...allSchedules.map(s=>timeToMinutes(s.end)));
        return Math.ceil((latestEnd+1)/60)*60;
    }, [allSchedules,startTimeMinutes]);

    const totalHeightPixels = ((endTimeMinutes-startTimeMinutes)/TIME_UNIT_MINUTES)*PIXEL_PER_UNIT;

    const stageKeys = Object.keys(stageMap);

    return (
        <div className={gridStyles.timetableContainer}>
            <TimeAxis startTimeMinutes={startTimeMinutes} endTimeMinutes={endTimeMinutes} totalHeightPixels={totalHeightPixels}/>

            <div className={gridStyles.stageGridWrapper} style={{ overflowX: 'auto', width: `calc(100% + 40px)`, marginLeft: '-20px' }}>
                {/* Stage Header */}
                <div className={gridStyles.stageHeader} style={{ width: `${stageKeys.length*STAGE_WIDTH}px` }}>
                    {stageKeys.map((key,index)=>{
                        let colorClass = '';
                        switch(index+1){
                            case 1: colorClass = gridStyles.colorStage1; break;
                            case 2: colorClass = gridStyles.colorStage2; break;
                            case 3: colorClass = gridStyles.colorStage3; break;
                            case 4: colorClass = gridStyles.colorStage4; break;
                            default: colorClass = gridStyles.colorStage1;
                        }
                        return (
                            <div key={key} className={`${gridStyles.stageHeaderBlock} ${colorClass}`} style={{width:`${STAGE_WIDTH}px`}}>
                               LAND STAGE
                            </div>
                        )
                    })}
                </div>

                {/* Schedule Columns */}
                <div className={gridStyles.scheduleArea} style={{ height:`${totalHeightPixels}px`, width:`${stageKeys.length*STAGE_WIDTH}px` }}>
                    {stageKeys.map((key,index)=>(
                        <div key={index} className={gridStyles.scheduleColumn} style={{width:`${STAGE_WIDTH}px`}}>
                            {stageMap[key].map(schedule=>(
                                <ScheduleBlock key={schedule.start+schedule.artist} schedule={schedule} startTimeMinutes={startTimeMinutes} mode={mode}/>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimetableGrid;