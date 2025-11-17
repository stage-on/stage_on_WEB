// src/components/timetable/FestivalListItem.tsx

import { useState } from 'react'; // ⭐️ 1. useState import 추가 ⭐️
import { useNavigate } from 'react-router-dom'; 
import festivalListStyles from "../../css/components/timetable/festivallistitem.module.css"; 
import sampleposter from "../../assets/timetable/poster.svg"; 
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; 

// ⭐️ 2. 두 가지 하트 이미지 import ⭐️
import heartFilled from "../../assets/timetable/heart.svg";    // 채워진 하트 (기존 heart.svg 사용)
import heartEmpty from "../../assets/timetable/heart-empty.svg"; // 빈 하트 이미지 경로 가정 (파일 준비 필요)

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
    // ⭐️ 3. 좋아요 상태를 관리하는 로컬 state 추가 (초기값: false) ⭐️
    const [isLiked, setIsLiked] = useState(false); 

    const handleNavigation = () => {
        navigate(`/timetable/detail/${itemData.id}`); 
    };

    // ⭐️ 4. 하트 클릭 핸들러 추가 ⭐️
    const handleHeartClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // li 태그의 클릭 이벤트(상세 페이지 이동) 전파 방지
        setIsLiked(prev => !prev); // 상태 토글 (false -> true, true -> false)
        
        // *참고: 만약 이 시점에 상위 컴포넌트나 API로 좋아요 상태를 알려야 한다면 여기에 로직이 추가됩니다.
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
                
                <div 
                    className={festivalListStyles.listTitle}
                    onClick={handleNavigation} // 타이틀 클릭 시 상세 이동
                >
                    {itemData.title}
                </div>
                
                <div className={festivalListStyles.listDetails}>
                    <img 
                        // ⭐️ 5. isLiked 상태에 따라 이미지 동적 선택 ⭐️
                        src={isLiked ? heartFilled : heartEmpty} 
                        alt="좋아요 아이콘" 
                        className={festivalListStyles.heartIcon} 
                        onClick={handleHeartClick} // ⭐️ 6. 클릭 핸들러 연결 ⭐️
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
                onClick={handleNavigation} // 화살표 클릭 시 상세 이동
            />
            
        </li>
    );
}