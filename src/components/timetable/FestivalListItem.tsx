// src/components/timetable/FestivalListItem.tsx (최종 수정본 - 좋아요 개수 로직 제거)

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
    onLikeChangeSuccess: () => void;
}


export default function FestivalListItem({ itemData, onClick, onLikeChangeSuccess }: FestivalListItemProps) {
    
    // ⭐️ 좋아요 개수 (likeCount) 관련 상태 제거 ⭐️
    const [isLiked, setIsLiked] = useState(itemData.isLiked); 

    // Props가 변경될 때 내부 상태를 동기화합니다. (서버 응답 반영)
    useEffect(() => {
        setIsLiked(itemData.isLiked);
        // setLikeCount(isNaN(itemData.likeCount) ? 0 : itemData.likeCount); // ⭐️ 제거 ⭐️
    }, [itemData.isLiked /* itemData.likeCount 제거 */]);


    const handleNavigation = () => {
        onClick(itemData.id); 
    };

    const handleHeartClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        
        // 1. 낙관적 업데이트 및 이전 상태 저장
        const previousIsLiked = isLiked; // ⭐️⭐️⭐️ 토글 전 원래 상태를 저장 ⭐️⭐️⭐️
        // const previousLikeCount = likeCount; // ⭐️ 제거 ⭐️

        // ⭐️ 디버깅 로그 1: 함수 진입 확인
        console.log(`[CLICK START] ID: ${itemData.id}, 이전 좋아요 상태: ${previousIsLiked}`); // 카운트 로그 제거

        // UI를 즉시 변경 (낙관적 업데이트)
        setIsLiked(prev => !prev);
        // setLikeCount(prev => prev + (previousIsLiked ? -1 : 1)); // ⭐️ 제거 ⭐️

        try {
            // ⭐️⭐️ 핵심 수정: 토글 전 상태인 previousIsLiked를 사용 ⭐️⭐️
            if (previousIsLiked) { // 이전 상태가 좋아요(true)였으면 -> 취소(DELETE)를 시도
                console.log(`[API CALL] DELETE /likes/performances/${itemData.id} 호출 직전`);
                await cancelLikePerformance(itemData.id); 
            } else { // 이전 상태가 비좋아요(false)였으면 -> 등록(POST)을 시도
                console.log(`[API CALL] POST /likes/performances/${itemData.id} 호출 직전`);
                await likePerformance(itemData.id);
            }
            
            // ⭐️ 디버깅 로그 2: API 성공 확인
            console.log(`[API SUCCESS] 요청 성공. 부모 목록 새로고침 호출.`);
            // 2. 성공: 부모에게 목록 새로고침 요청
            onLikeChangeSuccess(); 

        } catch (error) {
            // 3. 실패 시 처리 및 롤백
            let errorMessage = '좋아요 처리 중 알 수 없는 오류가 발생했습니다.';
            let needsRollback = true; // 롤백 여부 플래그
            
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                errorMessage = (error.response.data as any)?.message || errorMessage;
                
                // 4. 롤백 불필요 (서버 상태와 UI 일치) - 카운트 관련 로직 제거
                if (status === 409 && !previousIsLiked) { 
                    // setLikeCount(previousLikeCount); // ⭐️ 제거 ⭐️
                    needsRollback = false; // UI는 채워진 상태로 유지 (서버와 일치)
                } 
                else if (status === 404 && previousIsLiked) { 
                    // setLikeCount(previousLikeCount); // ⭐️ 제거 ⭐️
                    needsRollback = false; // UI는 빈 상태로 유지 (서버와 일치)
                }
            }
            
            // 5. 롤백 실행
            if (needsRollback) {
                // ⭐️ 디버깅 로그 3: 롤백 실행 확인
                console.log(`[ROLLBACK] API 실패 (needsRollback=true). 이전 상태로 복구.`);
                setIsLiked(previousIsLiked);
                // setLikeCount(previousLikeCount); // ⭐️ 제거 ⭐️
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
                    {/* ⭐️ 하트 아이콘과 감싸는 span 태그 유지 ⭐️ */}
                    <span> <img 
                        src={isLiked ? heartFilled : heartEmpty} 
                        alt="좋아요 아이콘" 
                        className={festivalListStyles.heartIcon} 
                        onClick={handleHeartClick}
                    /></span>
                   
                    {/* <span className={festivalListStyles.heartCount}>...</span> */} {/* ⭐️ 제거 ⭐️ */}
                    
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