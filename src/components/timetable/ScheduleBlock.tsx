import React, { useMemo, useState } from 'react';
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
    const [active, setActive] = useState(false); // 클릭 상태

    const style = useMemo(() => {
        const scheduleStartMinutes = timeToMinutes(schedule.start);
        const minutesFromStart = scheduleStartMinutes - startTimeMinutes;

        const top = (minutesFromStart / 10) * 20;
        const height = (schedule.minutes / 10) * 20;

        // 클릭 전 기본 색상
        let blockColorClass = active
            ? schedule.stageOrder === 1
                ? blockStyles.colorStage1
                : schedule.stageOrder === 2
                ? blockStyles.colorStage2
                : schedule.stageOrder === 3
                ? blockStyles.colorStage3
                : blockStyles.colorStage4
            : blockStyles.colorInactive; // 초기 상태 회색

        return { top: `${top}px`, height: `${height}px`, blockColorClass };
    }, [schedule, startTimeMinutes, active]);

    const timeRange = `${schedule.start.substring(0,5)}-${schedule.end.substring(0,5)}`;

    return (
        <div 
            className={`${blockStyles.scheduleBlock} ${style.blockColorClass}`} 
            style={{ top: style.top, height: style.height }}
            onClick={() => setActive(prev => !prev)}
        >
            <div className={blockStyles.artist}>{schedule.artist}</div>
            <div className={blockStyles.time}>{timeRange}</div>
            <div className={blockStyles.duration}>({schedule.minutes}분)</div>
        </div>
    );
};

export default ScheduleBlock;