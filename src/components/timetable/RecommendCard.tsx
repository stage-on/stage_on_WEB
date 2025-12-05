// src/components/timetable/RecommendCard.tsx (이미지 소스 수정)

import cardstyles from "../../css/components/timetable/recommendcard.module.css"; 
// import concertImage from "../../assets/timetable/concert_image.svg" // ⭐️ 제거: itemData에서 URL 받음 ⭐️

interface RecommendCardProps {
    itemData: {
        id: number;
        title: string;
        date: string;
        thumbnailUrl: string; // ⭐️ 사용될 이미지 URL ⭐️
    };
    onCustomizeClick: (id: number) => void; 
}

const RecommendCard = ({ itemData, onCustomizeClick }: RecommendCardProps) => {
    const handleClick = () => {
        onCustomizeClick(itemData.id); 
    };

    return (
        <div className={cardstyles.recommendCard}>
            
            <div>
                {/* ⭐️ [수정] 이미지 소스를 itemData.thumbnailUrl로 교체 ⭐️ */}
                <img src={itemData.thumbnailUrl} className={cardstyles.cardThumbnail}alt={`${itemData.title} 포스터`} />
            </div>
            
            <div className={cardstyles.cardInfo}>
                <p className={cardstyles.cardTitle}>{itemData.title}</p>
                <p className={cardstyles.cardDate}>{itemData.date}</p>
            </div>
            
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