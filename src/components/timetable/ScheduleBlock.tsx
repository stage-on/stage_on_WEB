// src/components/timetable/ScheduleBlock.tsx (수정된 코드: 상태 위임)

import React, { useMemo } from 'react';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage';
import blockStyles from '../../css/components/timetable/scheduleblock.module.css';

interface ScheduleBlockProps {
    schedule: ScheduleItem;
    startTimeMinutes: number; 
    mode: 'customize' | 'my' | 'view';
    
    // ⭐️ (추가) 활성화 상태를 부모로부터 받습니다. ⭐️
    isActive: boolean;
    
    // ⭐️ (추가) 클릭 시 부모에게 상태 변경을 알릴 콜백 함수를 받습니다. ⭐️
    onToggle: (schedule: ScheduleItem) => void; 
}

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({ 
    schedule, 
    startTimeMinutes, 
    mode, 
    // ⭐️ (수정) Props를 구조 분해 할당하고, 기존 useState를 제거합니다. ⭐️
    isActive, 
    onToggle 
}) => {
    // ⭐️ (제거) 로컬 상태 useState(active) 제거 ⭐️

    const style = useMemo(() => {
        const scheduleStartMinutes = timeToMinutes(schedule.start);
        const minutesFromStart = scheduleStartMinutes - startTimeMinutes;

        const top = (minutesFromStart / 10) * 20;
        const height = (schedule.minutes / 10) * 20;

        // ⭐️ (수정) isActive Props를 사용하여 색상을 결정합니다. ⭐️
        let blockColorClass = isActive
            ? schedule.stageOrder === 1
                ? blockStyles.colorStage1
                : schedule.stageOrder === 2
                ? blockStyles.colorStage2
                : schedule.stageOrder === 3
                ? blockStyles.colorStage3
                : blockStyles.colorStage4
            : blockStyles.colorInactive; // 초기 상태 회색 (비활성화)

        // ⭐️ (수정) useMemo의 의존성 배열에 isActive를 추가합니다. ⭐️
        return { top: `${top}px`, height: `${height}px`, blockColorClass };
    }, [schedule, startTimeMinutes, isActive]);

    const timeRange = `${schedule.start.substring(0,5)}-${schedule.end.substring(0,5)}`;

    return (
        <div 
            className={`${blockStyles.scheduleBlock} ${style.blockColorClass}`} 
            style={{ top: style.top, height: style.height }}
            // ⭐️ (수정) 클릭 시 부모 컴포넌트의 onToggle 함수를 호출하고, 자신의 schedule 정보를 전달합니다. ⭐️
            onClick={() => onToggle(schedule)}
        >
            <div className={blockStyles.artist}>{schedule.artist}</div>
            <div className={blockStyles.time}>{timeRange}</div>
            <div className={blockStyles.duration}>({schedule.minutes}분)</div>
        </div>
    );
};

export default ScheduleBlock;