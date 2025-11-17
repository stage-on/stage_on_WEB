import bandcardStyle from "../css/components/bandcard.module.css";
import NewCard from "./NewCard";

type Concert = {
  id: number;
  name: string;
  date: string;
  image: string;
  isNew?: boolean;
};

type BandCardProps = {
  concert: Concert;
};

const BandCard = ({ concert }: BandCardProps) => {
  return (
    <div className={bandcardStyle.bandcardContainer}>
      {/* 이미지 , NEW Card */}
      <div className={bandcardStyle.imageWrapper}>
        <img
          src={concert.image}
          className={bandcardStyle.concert_image}
        />

        {concert.isNew && (
          <div className={bandcardStyle.newBadgeWrapper}>
            <NewCard />
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className={bandcardStyle.cardText}>
        <div className={bandcardStyle.concertName}>{concert.name}</div>
        <div className={bandcardStyle.concertDate}>{concert.date}</div>
      </div>
    </div>
  );
};

export default BandCard;
