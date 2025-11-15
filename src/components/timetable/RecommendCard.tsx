// src/components/timetable/RecommendCard.tsx (파일명 변경 필요)

// ⭐️ React import 제거 (TS6133 오류 해결) ⭐️
import cardstyles from "../../css/components/timetable/recommendcard.module.css"; 
import concertImage from "../../assets/timetable/concert_image.svg"

// ⭐️ Props 인터페이스 정의 (TS7031 오류 해결) ⭐️
interface RecommendCardProps {
    itemData: {
        id: number;
        title: string;
        date: string;
        // 다른 필드가 있다면 여기에 추가해야 합니다.
    };
    onCustomizeClick: (id: number) => void; // 함수 타입 명시
}

/**
 * 추천/관심 페스티벌 카드 하나를 렌더링하고, 커스텀 버튼 클릭 이벤트를 처리합니다.
 */
// ⭐️ Props에 타입 명시 ⭐️
const RecommendCard = ({ itemData, onCustomizeClick }: RecommendCardProps) => {
    
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