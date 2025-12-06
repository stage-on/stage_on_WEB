// src/components/timetable/FestivalListItem.tsx (최종 수정본 - ID/NewState 전달)

import { useState, useEffect } from 'react';
import festivalListStyles from "../../css/components/timetable/festivallistitem.module.css"; 
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; 
import heartFilled from "../../assets/timetable/heart.svg";
import heartEmpty from "../../assets/timetable/heart-empty.svg";
import type { FestivalItem } from "../../pages/timetable/TimetableMainPage"; 
import { likePerformance, cancelLikePerformance } from "../../api/performanceLike";
import axios from 'axios'; 

interface FestivalListItemProps {
    itemData: FestivalItem; 
    onClick: (festivalId: number) => void; 
    // ⭐️⭐️ [수정] onLikeChangeSuccess의 시그니처를 변경: ID와 새로운 isLiked 상태를 전달 ⭐️⭐️
    onLikeChangeSuccess: (festivalId: number, newIsLikedState: boolean) => void;
}


export default function FestivalListItem({ itemData, onClick, onLikeChangeSuccess }: FestivalListItemProps) {
    
    const [isLiked, setIsLiked] = useState(itemData.isLiked); 

    // Props가 변경될 때 내부 상태를 동기화합니다. (서버 응답 반영)
    useEffect(() => {
        setIsLiked(itemData.isLiked);
    }, [itemData.isLiked]);


    const handleNavigation = () => {
        onClick(itemData.id); 
    };

    const handleHeartClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        
        // 1. 낙관적 업데이트 및 이전 상태 저장
        const previousIsLiked = isLiked; 
        const newIsLikedState = !previousIsLiked; // ⭐️⭐️ 토글 후 예상되는 상태 ⭐️⭐️

        // UI를 즉시 변경 (낙관적 업데이트)
        setIsLiked(newIsLikedState);
        console.log(`[CLICK START] ID: ${itemData.id}, 이전 좋아요 상태: ${previousIsLiked}, UI 즉시 ${newIsLikedState}로 업데이트`);

        try {
            // ⭐️⭐️ 핵심 수정: 토글 전 상태인 previousIsLiked를 사용 ⭐️⭐️
            if (previousIsLiked) { // 이전 상태가 좋아요(true)였으면 -> 취소(DELETE)를 시도
                await cancelLikePerformance(itemData.id); 
            } else { // 이전 상태가 비좋아요(false)였으면 -> 등록(POST)을 시도
                await likePerformance(itemData.id);
            }
            
            console.log(`[API SUCCESS] 요청 성공. ID: ${itemData.id}, 최종 상태: ${newIsLikedState}`);
            
            // 2. 성공: 부모에게 항목 ID와 최종 상태(newIsLikedState)를 전달
            // ⭐️⭐️ [핵심 수정] ID와 최종 상태를 부모에게 전달하여 로컬 목록 업데이트를 지시 ⭐️⭐️
            onLikeChangeSuccess(itemData.id, newIsLikedState); 

        } catch (error) {
            // 3. 실패 시 처리 및 롤백
            let errorMessage = '좋아요 처리 중 알 수 없는 오류가 발생했습니다.';
            let needsRollback = true; 
            
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                errorMessage = (error.response.data as any)?.message || errorMessage;
                
                // 4. 롤백 불필요 (서버 상태와 UI 일치): POST 409 (이미 있음), DELETE 404 (이미 없음)
                if ((status === 409 && !previousIsLiked) || (status === 404 && previousIsLiked)) { 
                    needsRollback = false; 
                }
            }
            
            // 5. 롤백 실행
            if (needsRollback) {
                console.log(`[ROLLBACK] API 실패. 이전 상태 ${previousIsLiked}로 복구.`);
                setIsLiked(previousIsLiked);
            }

            console.error(`❌ 좋아요 토글 실패 (ID: ${itemData.id}):`, errorMessage);
            alert(`좋아요 처리 실패: ${errorMessage}`);
        }
    };


    return (
        <li 
            className={festivalListStyles.timetableListItem} 
            onClick={handleNavigation} 
        >
            <img 
                src={itemData.thumbnailUrl} 
                alt={`${itemData.title} 포스터`} 
                className={festivalListStyles.listThumbnail} 
            />
            
            <div className={festivalListStyles.infoContainer}>
                
                <div 
                    className={festivalListStyles.listTitle}
                >
                    {itemData.title}
                </div>
                
                <div className={festivalListStyles.listDetails}>
                    <span> <img 
                        src={isLiked ? heartFilled : heartEmpty} 
                        alt="좋아요 아이콘" 
                        className={festivalListStyles.heartIcon} 
                        onClick={handleHeartClick}
                    /></span>
                   
                    <span className={festivalListStyles.divider}></span> 
                    <span className={festivalListStyles.location}>{itemData.location}</span>
                    <span className={festivalListStyles.divider}></span> 
                    <span className={festivalListStyles.date}>{itemData.date}</span>
                </div>
            </div>
            
            <img 
                src={arrowIconSVG} 
                alt="상세 페이지 이동" 
                className={festivalListStyles.arrowIcon}
            />
            
        </li>
    );
}