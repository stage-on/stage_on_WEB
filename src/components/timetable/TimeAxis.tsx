// src/components/timetable/TimeAxis.tsx (Stage 3개 고정 및 단순화 버전)

import React from 'react';
import gridStyles from '../../css/components/timetable/timetablegrid.module.css';

interface TimeAxisProps {
    startTimeMinutes: number;
    endTimeMinutes: number;
    totalHeightPixels: number;
}

const TimeAxis: React.FC<TimeAxisProps> = ({ startTimeMinutes, endTimeMinutes, totalHeightPixels }) => {

    const hourMarkers: number[] = [];
    
    // 1시간 단위로 마커 생성 (시작 시간의 다음 정시부터 끝 시간까지)
    for (let m = Math.ceil(startTimeMinutes / 60) * 60; m <= endTimeMinutes; m += 60) {
        if (m < endTimeMinutes) { 
             hourMarkers.push(m);
        }
    }

    const minutesToTop = (minutes: number) => {
        const minutesFromStart = minutes - startTimeMinutes;
        // 10분당 20px (2px/분)
        return (minutesFromStart / 10) * 20; 
    };

    const minutesToTimeLabel = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        return `${String(h).padStart(2, '0')}`;
    };

    return (
        <div className={gridStyles.timeAxis} style={{ height: `${totalHeightPixels}px` }}>
            {hourMarkers.map((minutes) => {
                const top = minutesToTop(minutes);
                return (
                    <React.Fragment key={minutes}>
                        <div className={gridStyles.timeLabel} style={{ top: `${top}px` }}>
                            {minutesToTimeLabel(minutes)}:00
                        </div>
                        {/* 횡스크롤 이전 버전에서는 TimeAxis에서 점선을 직접 렌더링했습니다. */}
                        <div className={gridStyles.timeDivider} style={{ top: `${top}px` }} />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default TimeAxis;