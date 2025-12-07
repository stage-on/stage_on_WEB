import { useNavigate } from "react-router-dom";
import bandcardStyle from "../css/components/bandcard.module.css";
import NewCard from "./NewCard";

type Concert = {
  mt20id: string;
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
  console.log("BandCard render", concert.mt20id); 
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("card clicked!", concert.mt20id);
    navigate(`/main/concert/${concert.mt20id}`);
  };

  return (
    <div className={bandcardStyle.bandcardContainer}
    onClick={handleClick}
      role="button"
    >
      
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
