import { useState } from 'react';
import festivalListStyles from "../../css/components/timetable/festivallistitem.module.css"; 
// import sampleposter from "../../assets/timetable/poster.svg"; // ⭐️ 이 줄을 제거하거나 주석 처리합니다. ⭐️
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; 
import heartFilled from "../../assets/timetable/heart.svg";
import heartEmpty from "../../assets/timetable/heart-empty.svg";

// ⭐️ 수정: 'import type'을 명시적으로 사용합니다. ⭐️
import type { FestivalItem } from "../../pages/timetable/TimetableMainPage"; 

interface FestivalListItemProps {
    itemData: FestivalItem; 
    onClick: (festivalId: number) => void; 
}


export default function FestivalListItem({ itemData, onClick }: FestivalListItemProps) {
    
    const [isLiked, setIsLiked] = useState(false); 

    const handleNavigation = () => {
        onClick(itemData.id); 
    };

    const handleHeartClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsLiked(prev => !prev);
    };


    return (
        <li 
            className={festivalListStyles.timetableListItem} 
            onClick={handleNavigation} 
        >
            {/* ⭐️ 수정: src 속성을 itemData.thumbnailUrl로 변경 ⭐️
                이 itemData.thumbnailUrl은 TimetableMainPage에서 item.poster를 매핑한 값입니다.
            */}
            <img 
                src={itemData.thumbnailUrl} // ⭐️ 이 부분을 수정했습니다. ⭐️
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
                    {/* ... (나머지 좋아요, 위치, 날짜 정보는 그대로 유지) ... */}
                    <img 
                        src={isLiked ? heartFilled : heartEmpty} 
                        alt="좋아요 아이콘" 
                        className={festivalListStyles.heartIcon} 
                        onClick={handleHeartClick}
                    />
                    <span className={festivalListStyles.heartCount}>{itemData.likes}</span>
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