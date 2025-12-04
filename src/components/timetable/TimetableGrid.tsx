// src/components/timetable/TimetableGrid.tsx (Stage 색상 매핑 + 동적 Stage + 횡스크롤)

import React, { useMemo } from 'react';
import ScheduleBlock from './ScheduleBlock';
import TimeAxis from './TimeAxis';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage';
import gridStyles from '../../css/components/timetable/timetablegrid.module.css';

interface TimetableGridProps {
    stageMap: Record<string, ScheduleItem[]>; 
    // ⭐️ REQUIRED: stageNames Prop을 제거하여 타입 오류를 해결합니다. ⭐️
    // stageNames: Record<string, string>; 
    allSchedules: ScheduleItem[];
    mode: 'customize' | 'my' | 'view';
}

const TIME_UNIT_MINUTES = 10; 
const PIXEL_PER_UNIT = 20;    
const STAGE_WIDTH = 152.5;

const timeToMinutes = (time: string) => { const [h,m] = time.split(':').map(Number); return h*60+m; };
const getStartTimeMinutes = (schedules: ScheduleItem[]) => schedules.length===0?900:Math.floor(Math.min(...schedules.map(s=>timeToMinutes(s.start)))/15)*15;

// ⭐️ Prop 목록에서 stageNames를 제거했습니다. ⭐️
const TimetableGrid: React.FC<TimetableGridProps> = ({ stageMap, allSchedules, mode }) => {
    const startTimeMinutes = useMemo(() => getStartTimeMinutes(allSchedules), [allSchedules]);
    const endTimeMinutes = useMemo(() => {
        if(allSchedules.length===0) return startTimeMinutes+120;
        const latestEnd = Math.max(...allSchedules.map(s=>timeToMinutes(s.end)));
        return Math.ceil((latestEnd+1)/60)*60;
    }, [allSchedules,startTimeMinutes]);

    const totalHeightPixels = ((endTimeMinutes-startTimeMinutes)/TIME_UNIT_MINUTES)*PIXEL_PER_UNIT;

    const stageKeys = Object.keys(stageMap);
    const totalStageCount = stageKeys.length;

    return (
        <div className={gridStyles.timetableContainer}>
            <TimeAxis startTimeMinutes={startTimeMinutes} endTimeMinutes={endTimeMinutes} totalHeightPixels={totalHeightPixels}/>

            <div className={gridStyles.stageGridWrapper} style={{ overflowX: 'auto', width: `calc(100% + 40px)`, marginLeft: '-20px' }}>
                {/* Stage Header */}
                <div className={gridStyles.stageHeader} style={{ width: `${totalStageCount * STAGE_WIDTH}px` }}>
                    {stageKeys.map((key,index)=>{
                        // ⭐️ 색상 순환 로직 개선: 1, 2, 3, 4 이후 다시 1로 돌아가게 합니다. ⭐️
                        const colorIndex = (index % 4) + 1;
                        let colorClass = '';
                        
                        switch(colorIndex){
                            case 1: colorClass = gridStyles.colorStage1; break;
                            case 2: colorClass = gridStyles.colorStage2; break;
                            case 3: colorClass = gridStyles.colorStage3; break;
                            case 4: colorClass = gridStyles.colorStage4; break;
                            default: colorClass = gridStyles.colorStage1;
                        }
                        return (
                            <div key={key} className={`${gridStyles.stageHeaderBlock} ${colorClass}`} style={{width:`${STAGE_WIDTH}px`}}>
                                {/* ⭐️ Stage 이름 동적 표시: 하드코딩된 'LAND STAGE' 대신 실제 이름(key) 사용 ⭐️ */}
                                {key}
                            </div>
                        )
                    })}
                </div>

                {/* Schedule Columns */}
                <div className={gridStyles.scheduleArea} style={{ height:`${totalHeightPixels}px`, width:`${totalStageCount*STAGE_WIDTH}px` }}>
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