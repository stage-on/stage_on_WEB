// src/components/timetable/RecommendCard.tsx

import cardstyles from "../../css/components/timetable/recommendcard.module.css"; 
import concertImage from "../../assets/timetable/concert_image.svg"

interface RecommendCardProps {
    itemData: {
        id: number;
        title: string;
        date: string;
        thumbnailUrl: string;
    };
    onCustomizeClick: (id: number) => void; 
}

const RecommendCard = ({ itemData, onCustomizeClick }: RecommendCardProps) => {
    
    const handleClick = () => {
        onCustomizeClick(itemData.id); 
    };

    return (
        <div className={cardstyles.recommendCard}>
            
            <div className={cardstyles.cardThumbnail}>
                <img src={concertImage} alt={`${itemData.title} 포스터`} />
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