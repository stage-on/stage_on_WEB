import concertimage from "../assets/component/home/concert_image.svg";
import myConcertsStyle from "../css/pages/myconcert.module.css";
import { HiChevronRight } from "react-icons/hi2";

import heartFilled from "./../assets/timetable/heart.svg";
import heartEmpty from "./../assets/timetable/heart-empty.svg";
import { Link } from "react-router-dom";

interface MyConcertsCardProps {
  id: number;
  festivalName: string;
  location: string;
  date: string;
  likes: number;
  liked: boolean;
  onToggle: (id: number) => void;
}

const MyConcertsCard = ({
  id,
  festivalName,
  location,
  date,
  likes,
  liked,
  onToggle,
}: MyConcertsCardProps) => {

  const handleLikeToggle = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();   
    e.stopPropagation();   
    onToggle(id);
  };

  return (
    <>
    <Link to={`/main/concert/${id}`}
     className={myConcertsStyle.cardLink}>
      <div className={myConcertsStyle.concertCardContainer}>
        <img src={concertimage} className={myConcertsStyle.concertImg} />

        <div className={myConcertsStyle.concertCardColumn}>
          <span className={myConcertsStyle.festivalName}>{festivalName}</span>

          <div className={myConcertsStyle.concertCardRow}>
            <img
              src={liked ? heartFilled : heartEmpty}
              onClick={handleLikeToggle}
            />
            <span className={myConcertsStyle.likeText}>{likes}</span>
            <span className={myConcertsStyle.location}>{location}</span>
            <span className={myConcertsStyle.date}>{date}</span>
          </div>
        </div>

        <HiChevronRight className={myConcertsStyle.Vector} />
      </div>
      </Link>
    </>
    
  );
};

export default MyConcertsCard;
