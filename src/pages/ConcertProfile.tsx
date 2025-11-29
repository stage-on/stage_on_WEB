import concertProfileStyle from "../css/pages/concertprofile.module.css";
import { HiChevronLeft } from "react-icons/hi2";
import posterImage from "../assets/poster image.svg";
import heartFilled from "../assets/timetable/heart.svg";
import bandListImg from "../assets/bandlistimg.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import heartEmpty from "../assets/myconcertheartEmpty.svg";

const ConcertProfile = () => {
    const navigate = useNavigate();

    const [liked, setLiked] = useState(true);

  return (
    
    <div className={concertProfileStyle.page}>
      <div className={concertProfileStyle.header}>
        {/* 아이콘 클릭시 My Concerts 페이지로 이동 */}
        <HiChevronLeft 
        className={concertProfileStyle.Vector} 
        onClick={() => navigate("/main/myconcerts")} 
        />
        <span className={concertProfileStyle.concertName}>
          COUNTDOWN FANTASY 2025-2026
        </span>
      </div>
    
      <img src={posterImage} className={concertProfileStyle.posterImg} />
    <div className={concertProfileStyle.SectionWrapper}>
      <div className={concertProfileStyle.infoSection}>
        <div className={concertProfileStyle.leftBlock}>
          <span className={concertProfileStyle.title}>
            COUNTDOWN <br />
            FANTSY <br />
            2025-2026
          </span>

          <span className={concertProfileStyle.location}>일산 킨텍스</span>
        </div>

        <div className={concertProfileStyle.rightBlock}>
       
          <div className={concertProfileStyle.likeRow}>
            <img
              src={liked ? heartFilled : heartEmpty}
              className={concertProfileStyle.heartIcon}
           
              onClick={() => {
                if (liked) setLiked(false);
              }}
            />
          
          </div>

          {liked ? (
            // 좋아요 된 상태
            <button className={concertProfileStyle.interestButton}>
              나의 관심 공연
            </button>
          ) : (
            // 좋아요 안 된 상태
            <button
              className={concertProfileStyle.interestButtonInactive}
              onClick={() => setLiked(true)} 
            >
              관심 공연으로 추가하기
            </button>
          )}
        </div>
      </div>


            <div className={concertProfileStyle.detailSection}>
        <div className={concertProfileStyle.detailLeft}>
            <div className={concertProfileStyle.detailTitle}>상세 정보</div>

            <div className={concertProfileStyle.detailItem}>
            <span className={concertProfileStyle.label}>일시</span>
            <span className={concertProfileStyle.value}>2025.12.30 - 12.31</span>
            </div>

            <div className={concertProfileStyle.detailItem}>
            <span className={concertProfileStyle.label}>티켓</span>
            <span className={concertProfileStyle.value}>전석 비지정석 110,000원</span>
            </div>

            <div className={concertProfileStyle.detailItem}>
            <span className={concertProfileStyle.label}>예매일</span>
            <span className={concertProfileStyle.value}>2025.10.02(목) 18:00시</span>
            </div>

            <div className={concertProfileStyle.detailItem}>
            <span className={concertProfileStyle.label}>러닝타임</span>
            <span className={concertProfileStyle.value}>120분</span>
            </div>
        </div>

        <div className={concertProfileStyle.detailRight}>
            <button className={concertProfileStyle.detailButton}>타임테이블 커스텀</button>
            <button className={concertProfileStyle.detailButton}>예매처 바로 가기</button>
            <button className={concertProfileStyle.detailButton}>공연장 위치 보기</button>
           
        </div>
        </div>
    
<div className={concertProfileStyle.bandLineupSection}>
  <div className={concertProfileStyle.bandLineupTitle}>출연 밴드 라인업</div>

  <div className={concertProfileStyle.bandList}>
    <div className={concertProfileStyle.bandItem}>
      <img src={bandListImg} className={concertProfileStyle.bandAvatar} />
      <span className={concertProfileStyle.bandName}>심아일랜드</span>
    </div>

    <div className={concertProfileStyle.bandItem}>
      <img src={bandListImg} className={concertProfileStyle.bandAvatar} />
      <span className={concertProfileStyle.bandName}>CNBLUE</span>
    </div>

    <div className={concertProfileStyle.bandItem}>
      <img src={bandListImg} className={concertProfileStyle.bandAvatar} />
      <span className={concertProfileStyle.bandName}>극동아시아<br/>타이거즈</span>
    </div>

    <div className={concertProfileStyle.bandItem}>
      <img src={bandListImg} className={concertProfileStyle.bandAvatar} />
      <span className={concertProfileStyle.bandName}>ADOY</span>
    </div>

    <div className={concertProfileStyle.bandItem}>
      <img src={bandListImg} className={concertProfileStyle.bandAvatar} />
      <span className={concertProfileStyle.bandName}>유형서점</span>
    </div>
  </div>
</div>
    </div>
    </div>
  );
};

export default ConcertProfile;
