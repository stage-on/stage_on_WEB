import React, { useMemo } from 'react';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage';
import blockStyles from '../../css/components/timetable/scheduleblock.module.css';

interface ScheduleBlockProps {
    schedule: ScheduleItem;
    startTimeMinutes: number; 
    mode: 'customize' | 'my' | 'view';
    isActive: boolean;
    onToggle: (schedule: ScheduleItem) => void; 
}

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({ 
    schedule, 
    startTimeMinutes,  
    isActive, 
    onToggle 
}) => {

    const style = useMemo(() => {
        const scheduleStartMinutes = timeToMinutes(schedule.start);
        const minutesFromStart = scheduleStartMinutes - startTimeMinutes;

        const top = (minutesFromStart / 10) * 20;
        const height = (schedule.minutes / 10) * 20;

        let blockColorClass = isActive
            ? schedule.stageOrder === 1
                ? blockStyles.colorStage1
                : schedule.stageOrder === 2
                ? blockStyles.colorStage2
                : schedule.stageOrder === 3
                ? blockStyles.colorStage3
                : schedule.stageOrder === 4
                ? blockStyles.colorStage4
                : schedule.stageOrder === 5
                ? blockStyles.colorStage5
                : blockStyles.colorStage4
            : blockStyles.colorInactive;

        return { top: `${top}px`, height: `${height}px`, blockColorClass };
    }, [schedule, startTimeMinutes, isActive]);

    const timeRange = `${schedule.start.substring(0,5)}-${schedule.end.substring(0,5)}`;

    return (
        <div 
            className={`${blockStyles.scheduleBlock} ${style.blockColorClass}`} 
            style={{ top: style.top, height: style.height }}
            onClick={() => onToggle(schedule)}
        >
            <div className={blockStyles.artist}>{schedule.artist}</div>
            <div className={blockStyles.time}>{timeRange}</div>
            <div className={blockStyles.duration}>({schedule.minutes}분)</div>
        </div>
    );
};

export default ScheduleBlock;