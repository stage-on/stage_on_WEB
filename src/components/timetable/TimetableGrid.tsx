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
    
    // ⭐️ (추가) ⭐️ 토글 처리 함수와 활성화된 키 목록을 받습니다.
    onScheduleToggle: (schedule: ScheduleItem) => void;
    activeScheduleKeys: Set<string>; 
}

const TIME_UNIT_MINUTES = 10; 
const PIXEL_PER_UNIT = 20;    
const STAGE_WIDTH = 152.5;

const timeToMinutes = (time: string) => { const [h,m] = time.split(':').map(Number); return h*60+m; };
const getStartTimeMinutes = (schedules: ScheduleItem[]) => schedules.length===0?900:Math.floor(Math.min(...schedules.map(s=>timeToMinutes(s.start)))/15)*15;

// ⭐️ Prop 목록에서 stageNames를 제거했습니다. ⭐️
const TimetableGrid: React.FC<TimetableGridProps> = ({ 
    stageMap, 
    allSchedules, 
    mode, 
    // ⭐️ (추가) ⭐️ 새로 받은 props를 구조 분해 할당
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

    // ⭐️ (추가) ⭐️ ScheduleItem의 고유 키를 생성하는 헬퍼 함수
    // TimetableDetailPage와 동일하게 정의되어야 합니다.
    const createScheduleKey = (s: ScheduleItem) => `${s.date}-${s.stageId}-${s.artist}-${s.start}`;


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
                            <div className={`${gridStyles.stageHeaderBlock} ${colorClass}`} style={{width:`${STAGE_WIDTH}px`}}>
                                LAND STAGE
                            </div>
                        )
                    })}
                </div>

                {/* Schedule Columns */}
                <div className={gridStyles.scheduleArea} style={{ height:`${totalHeightPixels}px`, width:`${totalStageCount*STAGE_WIDTH}px` }}>
                    {stageKeys.map((key,index)=>(
                        <div key={index} className={gridStyles.scheduleColumn} style={{width:`${STAGE_WIDTH}px`}}>
                            {stageMap[key].map(schedule=>{ // ⭐️ (수정) ⭐️ 중괄호를 사용하여 로직 추가
                                // ⭐️ (추가) ⭐️ ScheduleBlock에 전달할 isActive 상태 결정
                                const scheduleKey = createScheduleKey(schedule); 
                                const isActive = activeScheduleKeys.has(scheduleKey);

                                return (
                                    <ScheduleBlock 
                                        key={scheduleKey} // ⭐️ (수정) ⭐️ 고유 키 사용
                                        schedule={schedule} 
                                        startTimeMinutes={startTimeMinutes} 
                                        mode={mode}
                                        // ⭐️ (추가) ⭐️ isActive 상태와 토글 함수 전달
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