import React, { useMemo } from 'react';
import ScheduleBlock from './ScheduleBlock';
import TimeAxis from './TimeAxis';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage';
import gridStyles from '../../css/components/timetable/timetablegrid.module.css';

interface TimetableGridProps {
    stageMap: Record<string, ScheduleItem[]>; 
    allSchedules: ScheduleItem[];
    mode: 'customize' | 'my' | 'view';
    onScheduleToggle: (schedule: ScheduleItem) => void;
    activeScheduleKeys: Set<string>; 
}

const TIME_UNIT_MINUTES = 10; 
const PIXEL_PER_UNIT = 20;    
const STAGE_WIDTH = 152.5;

const timeToMinutes = (time: string) => { const [h,m] = time.split(':').map(Number); return h*60+m; };
const getStartTimeMinutes = (schedules: ScheduleItem[]) => schedules.length===0?900:Math.floor(Math.min(...schedules.map(s=>timeToMinutes(s.start)))/15)*15;

const TimetableGrid: React.FC<TimetableGridProps> = ({ 
    stageMap, 
    allSchedules, 
    mode, 
    onScheduleToggle, 
    activeScheduleKeys 
}) => {
    const startTimeMinutes = useMemo(() => getStartTimeMinutes(allSchedules), [allSchedules]);
    const endTimeMinutes = useMemo(() => {
        if(allSchedules.length===0) return startTimeMinutes+120;
        const latestEnd = Math.max(...allSchedules.map(s=>timeToMinutes(s.end)));
        return Math.ceil((latestEnd+1)/60)*60;
    }, [allSchedules,startTimeMinutes]);

    const totalHeightPixels = ((endTimeMinutes-startTimeMinutes)/TIME_UNIT_MINUTES)*PIXEL_PER_UNIT;

    const stageKeys = Object.keys(stageMap);
    const totalStageCount = stageKeys.length;

    const createScheduleKey = (s: ScheduleItem) => `${s.date}-${s.stageId}-${s.artist}-${s.start}`;


    return (
        <div className={gridStyles.timetableContainer}>
            <TimeAxis startTimeMinutes={startTimeMinutes} endTimeMinutes={endTimeMinutes} totalHeightPixels={totalHeightPixels}/>

            <div className={gridStyles.stageGridWrapper} style={{ overflowX: 'auto', width: `calc(100% + 40px)`, marginLeft: '-20px' }}>
                <div className={gridStyles.stageHeader} style={{ width: `${totalStageCount * STAGE_WIDTH}px` }}>
                    {stageKeys.map((_key,index)=>{
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
                            <div className={`${gridStyles.stageHeaderBlock} ${colorClass}`} style={{width:`${STAGE_WIDTH}px`}}>
                                LAND STAGE
                            </div>
                        )
                    })}
                </div>

                <div className={gridStyles.scheduleArea} style={{ height:`${totalHeightPixels}px`, width:`${totalStageCount*STAGE_WIDTH}px` }}>
                    {stageKeys.map((key,index)=>(
                        <div key={index} className={gridStyles.scheduleColumn} style={{width:`${STAGE_WIDTH}px`}}>
                            {stageMap[key].map(schedule=>{
                                const scheduleKey = createScheduleKey(schedule); 
                                const isActive = activeScheduleKeys.has(scheduleKey);

                                return (
                                    <ScheduleBlock 
                                        key={scheduleKey} 
                                        schedule={schedule} 
                                        startTimeMinutes={startTimeMinutes} 
                                        mode={mode}
                                        isActive={isActive} 
                                        onToggle={onScheduleToggle}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimetableGrid;