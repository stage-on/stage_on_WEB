// src/components/timetable/FestivalListItem.tsx

import { useNavigate } from 'react-router-dom'; 
import festivalListStyles from "../../css/components/timetable/festivallistitem.module.css"; 
import sampleposter from "../../assets/timetable/poster.svg"; 
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; 
import heart from "../../assets/timetable/heart.svg";

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
}


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
                src={arrowIconSVG} 
                alt="상세 페이지 이동" 
                className={festivalListStyles.arrowIcon}
                onClick={handleNavigation}
            />
            
        </li>
    );
}