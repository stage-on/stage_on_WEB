// src/components/timetable/TimetableGrid.tsx (Stage 3개 고정 버전)

import React, { useMemo } from 'react';
import ScheduleBlock from './ScheduleBlock';
import TimeAxis from './TimeAxis';
import type { ScheduleItem } from '../../pages/timetable/TimetableDetailPage'; 
import gridStyles from '../../css/components/timetable/timetablegrid.module.css';

interface StageNames {
    1: string;
    2: string;
    3: string;
}

interface TimetableGridProps {
    // ⭐️ Stage 3개 고정 Props ⭐️
    stage1Schedules: ScheduleItem[];
    stage2Schedules: ScheduleItem[];
    stage3Schedules: ScheduleItem[];
    stageNames: StageNames;
    allSchedules: ScheduleItem[]; // 시간 계산용
    mode: 'customize' | 'my' | 'view';
}

// ⭐️ 유틸리티 상수 및 함수 ⭐️
const TIME_UNIT_MINUTES = 10; 
const PIXEL_PER_UNIT = 20;    

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const getStartTimeMinutes = (schedules: ScheduleItem[]): number => {
    if (schedules.length === 0) return 900; 
    
    const startTimes = schedules.map(s => timeToMinutes(s.start));
    const earliestMin = Math.min(...startTimes);
    
    // 시작 시간을 15분 단위로 내림하여 그리드 시작점을 맞춤
    return Math.floor(earliestMin / 15) * 15; 
};


const TimetableGrid: React.FC<TimetableGridProps> = ({ 
    stage1Schedules, 
    stage2Schedules, 
    stage3Schedules, 
    stageNames, 
    allSchedules,
    mode 
}) => {
    
    // ⭐️ 시간 범위 및 높이 계산 ⭐️
    const startTimeMinutes = useMemo(() => getStartTimeMinutes(allSchedules), [allSchedules]);

    const endTimeMinutes = useMemo(() => {
        if (allSchedules.length === 0) return startTimeMinutes + 120;
        const latestEnd = Math.max(...allSchedules.map(s => timeToMinutes(s.end)));
        // 끝 시간을 정시 다음 60분 단위로 올림하여 여유 공간 확보
        return Math.ceil((latestEnd + 1) / 60) * 60; 
    }, [allSchedules, startTimeMinutes]);

    const totalHeightMinutes = endTimeMinutes - startTimeMinutes;
    const totalHeightPixels = (totalHeightMinutes / TIME_UNIT_MINUTES) * PIXEL_PER_UNIT; 
    
    return (
        <div className={gridStyles.timetableContainer}>
            
            <TimeAxis 
                startTimeMinutes={startTimeMinutes}
                endTimeMinutes={endTimeMinutes}
                totalHeightPixels={totalHeightPixels}
            />

            {/* ⭐️ 횡 스크롤 제거, 고정된 너비 그리드 래퍼 ⭐️ */}
            <div className={gridStyles.stageGridWrapper}>
                
                {/* ⭐️ Stage Header: 3개 고정 ⭐️ */}
                <div className={gridStyles.stageHeader}>
                    <div className={gridStyles.stageHeaderBlock}>{stageNames[1]}</div>
                    <div className={gridStyles.stageHeaderBlock}>{stageNames[2]}</div>
                    <div className={gridStyles.stageHeaderBlock}>{stageNames[3]}</div>
                </div>

                {/* Schedule Columns: 3개 고정 */}
                <div className={gridStyles.scheduleArea} style={{ height: `${totalHeightPixels}px` }}>
                    
                    {/* Stage 1 */}
                    <div className={gridStyles.scheduleColumn}>
                        {stage1Schedules.map((schedule) => (
                            <ScheduleBlock
                                key={schedule.start + schedule.artist}
                                schedule={schedule}
                                startTimeMinutes={startTimeMinutes}
                                mode={mode}
                            />
                        ))}
                    </div>

                    {/* Stage 2 */}
                    <div className={gridStyles.scheduleColumn}>
                        {stage2Schedules.map((schedule) => (
                            <ScheduleBlock
                                key={schedule.start + schedule.artist}
                                schedule={schedule}
                                startTimeMinutes={startTimeMinutes}
                                mode={mode}
                            />
                        ))}
                    </div>
                    
                    {/* Stage 3 */}
                    <div className={gridStyles.scheduleColumn}>
                        {stage3Schedules.map((schedule) => (
                            <ScheduleBlock
                                key={schedule.start + schedule.artist}
                                schedule={schedule}
                                startTimeMinutes={startTimeMinutes}
                                mode={mode}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableGrid;