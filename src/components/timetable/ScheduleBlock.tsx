// src/components/timetable/ScheduleBlock.tsx

import React, { useMemo } from 'react';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage';
import blockStyles from '../../css/components/timetable/scheduleblock.module.css';

interface ScheduleBlockProps {
    schedule: ScheduleItem;
    startTimeMinutes: number; 
    mode: 'customize' | 'my' | 'view';
}

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({ schedule, startTimeMinutes, mode }) => {
    
    const style = useMemo(() => {
        
        const scheduleStartMinutes = timeToMinutes(schedule.start);
        const minutesFromStart = scheduleStartMinutes - startTimeMinutes;
        
        const top = (minutesFromStart / 10) * 20;
        const height = (schedule.minutes / 10) * 20;
        
        // stageOrder를 2로 나눈 나머지에 따라 색상을 번갈아 가며 부여
        const colorIndex = schedule.stageOrder % 2; 
        let blockColorClass = colorIndex === 1 
            ? blockStyles.colorYellow 
            : blockStyles.colorPurple; 
            
        return { top: `${top}px`, height: `${height}px`, blockColorClass };
    }, [schedule, startTimeMinutes, mode]);


    const timeRange = `${schedule.start.substring(0, 5)}-${schedule.end.substring(0, 5)}`;

    return (
        <div 
            className={`${blockStyles.scheduleBlock} ${style.blockColorClass}`} 
            style={{ top: style.top, height: style.height }}
            onClick={() => console.log(`Clicked ${schedule.artist} (Mode: ${mode})`)}
        >
            <div className={blockStyles.artist}>{schedule.artist}</div>
            <div className={blockStyles.time}>{timeRange}</div>
            <div className={blockStyles.duration}>({schedule.minutes}분)</div>
        </div>
    );
};

export default ScheduleBlock;