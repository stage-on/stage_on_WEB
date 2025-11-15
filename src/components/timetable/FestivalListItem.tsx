// src/components/timetable/FestivalListItem.tsx (파일명이 .tsx인지 확인)

import { useNavigate } from 'react-router-dom'; 
import festivalListStyles from "../../css/components/timetable/festivallistitem.module.css"; 
import sampleposter from "../../assets/timetable/poster.svg"; 
// ⭐️ 화살표 아이콘을 직접 import합니다. ⭐️
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; // TimetableMainPage에서 사용했던 경로 사용
import heart from "../../assets/timetable/heart.svg";

// ⭐️ Props 인터페이스에서 arrowSVG를 제거합니다. ⭐️
interface FestivalItemData {
    id: number;
    title: string;
    likes: number;
    location: string;
    date: string;
    thumbnailUrl: string;
}

interface FestivalListItemProps {
    itemData: FestivalItemData;
    // arrowSVG: string; ⭐️ 이 줄을 제거합니다. ⭐️
}


// ⭐️ Props에서 arrowSVG를 제거하고 itemData만 받습니다. ⭐️
export default function FestivalListItem({ itemData }: FestivalListItemProps) {
    
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/timetable/detail/${itemData.id}`); 
    };

    return (
        <li 
            className={festivalListStyles.timetableListItem} 
        >
            <img 
                src={sampleposter} 
                alt={`${itemData.title} 포스터`} 
                className={festivalListStyles.listThumbnail} 
            />
            
            <div className={festivalListStyles.infoContainer}>
                
                <div className={festivalListStyles.listTitle}>{itemData.title}</div>
                
                <div className={festivalListStyles.listDetails}>
                    <img src={heart} alt="좋아요 아이콘" className={festivalListStyles.heartIcon} />
                    <span className={festivalListStyles.heartCount}>{itemData.likes}</span>
                    <span className={festivalListStyles.divider}></span> 
                    <span className={festivalListStyles.location}>{itemData.location}</span>
                    <span className={festivalListStyles.divider}></span> 
                    <span className={festivalListStyles.date}>{itemData.date}</span>
                </div>
            </div>
            
            <img 
                // ⭐️ 직접 import한 arrowIconSVG를 사용하여 아이콘 문제 해결 ⭐️
                src={arrowIconSVG} 
                alt="상세 페이지 이동" 
                className={festivalListStyles.arrowIcon}
                onClick={handleNavigation}
            />
            
        </li>
    );
}