// components/common/FestivalListItem.tsx 파일 내용 (수정됨)

import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import festivalListStyles from "../../css/components/timetable/festivallistitem.module.css"; 
import sampleposter from "../../assets/timetable/poster.svg"; 
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; 
import heart from "../../assets/timetable/heart.svg";

export default function FestivalListItem({ itemData }) {
    
    const navigate = useNavigate();

    // 💡 클릭 핸들러 함수: 상세 페이지로 이동
    const handleNavigation = () => {
        navigate(`/timetable/detail/${itemData.id}`); 
    };

    return (
        // ✅ <li>에는 onClick 이벤트를 제거합니다. (항목 전체 클릭 불가)
        <li 
            key={itemData.id} 
            className={festivalListStyles.timetableListItem} 
            // onClick={handleNavigation} 제거됨
        >
            {/* 썸네일 영역 */}
            <img 
                src={sampleposter} 
                alt={`${itemData.title} 포스터`} 
                className={festivalListStyles.listThumbnail} 
            />
            
            {/* 정보 컨테이너 */}
            <div className={festivalListStyles.infoContainer}>
                
                <div className={festivalListStyles.listTitle}>{itemData.title}</div>
                
                {/* 상세 정보 그룹 (좋아요, 위치, 날짜) */}
                <div className={festivalListStyles.listDetails}>
                    <img src={heart} alt="좋아요 아이콘" className={festivalListStyles.heartIcon} />
                    <span className={festivalListStyles.heartCount}>{itemData.likes}</span>
                    <span className={festivalListStyles.divider}>|</span> 
                    <span className={festivalListStyles.location}>{itemData.location}</span>
                    <span className={festivalListStyles.divider}>|</span> 
                    <span className={festivalListStyles.date}>{itemData.date}</span>
                </div>
            </div>
            
            {/* ✅ Arrow Icon에 다시 onClick 이벤트를 추가합니다. */}
            <img 
                src={arrowIconSVG} 
                alt="상세 페이지 이동" 
                className={festivalListStyles.arrowIcon}
                onClick={handleNavigation} // ⬅️ 클릭 이벤트 복구
            />
            
        </li>
    );
}