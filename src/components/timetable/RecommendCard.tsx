// src/components/timetable/RecommendCard.jsx

import React from 'react';
import cardstyles from "../../css/components/timetable/recommendcard.module.css"; 
import concertImage from "../../assets/timetable/concert_image.svg"

/**
 * 추천/관심 페스티벌 카드 하나를 렌더링하고, 커스텀 버튼 클릭 이벤트를 처리합니다.
 */
const RecommendCard = ({ itemData, onCustomizeClick }) => {
    
    // 버튼 클릭 시 부모 함수(onCustomizeClick)에 현재 카드의 ID를 전달하여 실행
    const handleClick = () => {
        onCustomizeClick(itemData.id); 
    };

    return (
        <div className={cardstyles.recommendCard}>
            
            {/* 썸네일/포스터 영역 */}
            <div className={cardstyles.cardThumbnail}>
                <img src={concertImage} alt={`${itemData.title} 포스터`} />
            </div>
            
            {/* 정보 영역 */}
            <div className={cardstyles.cardInfo}>
                <p className={cardstyles.cardTitle}>{itemData.title}</p>
                <p className={cardstyles.cardDate}>{itemData.date}</p>
            </div>
            
            {/* 커스텀 버튼 (클릭 핸들러 연결) */}
            <button 
                className={cardstyles.customButton}
                onClick={handleClick}
            >
                커스텀
            </button>
        </div>
    );
};

export default RecommendCard;