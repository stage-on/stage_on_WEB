import bandcardStyle from "../css/components/bandcard.module.css";
import BandCard from "./BandCard";

type Concert = {
  id: number;
  name: string;
  date: string;
  image: string;
  isNew?: boolean;
};

type Band = {
  id: number;
  name: string;
  concerts: Concert[];
};


type BandCardNameProps = {
  band: Band;
};

const BandCardName = ({ band }: BandCardNameProps) => {
  return (
    <>
      <div className={bandcardStyle.bandcardText}>
        <span className={bandcardStyle.bandcardsubText}>나의 관심 밴드인</span>
        <div className={bandcardStyle.bandcardPlanText}>
          <span className={bandcardStyle.bandNameText1}>{band.name}</span>
          <span className={bandcardStyle.bandcardsubText2}>의 공연 일정</span>
        </div>
      </div>

     <div className={bandcardStyle.bandcardRowWrapper}>
    <div className={bandcardStyle.bandcardRow}>
      {band.concerts.map((concert) => (
        <BandCard key={concert.id} concert={concert} />
      ))}
    </div>
</div>
    </>
  );
};

export default BandCardName;