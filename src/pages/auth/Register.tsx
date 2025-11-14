import registerStyle from "../../css/pages/register.module.css";
import vector from "../../assets/auth/Vector.svg"
import icon_microphone from "../../assets/auth/icon_microphone.svg"
import woman_singer_light_skin_tone from "../../assets/auth/Woman Singer Light Skin Tone.svg"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// 백엔드 연동 전 국내 인디 밴드 더미데이터
const localBand = [
   {id: 1, name: "쏜애플" },
  { id: 2, name: "실리카겔" },
  { id: 3, name: "SURL" },
  { id: 4, name: "터치드" },
  { id: 5, name: "유다빈밴드" },
  { id: 6, name: "솔루션스" },
  { id: 7, name: "이승윤" },
  { id: 8, name: "보수동쿨러" },
  { id: 9, name: "hath9way" },
  { id: 10, name: "라쿠나" },
  { id: 11, name: "The Volunteers" },
  { id: 12, name: "비공정" },
  { id: 13, name: "리도어" },
  { id: 14, name: "오월오일" },
  { id: 15, name: "김뜻돌" },
  { id: 16, name: "SUMIN" },
  { id: 17, name: "단편선과 선들" },
]

// 백엔드 연동 전 해외 밴드 더미데이터
const globalBand = [
   {id: 18, name: "밴드이름" },
  { id: 19, name: "밴드이름" },
  { id: 20, name: "밴드이름" },
  { id: 21, name: "밴드이름" },
  { id: 22, name: "밴드이름" },
   { id: 23, name: "밴드이름" },
  { id: 24, name: "밴드이름" },
   { id: 25, name: "밴드이름" },
  { id: 26, name: "밴드이름" },
   { id: 27, name: "밴드이름" },
  { id: 28, name: "밴드이름" },
  
]

const Register = () => {

  const navigate = useNavigate();

  const [selectedBandIds, setSelectedBandIds] = useState<number[]>([]);

  const selectedCount = selectedBandIds.length;
  const isNextEnabled = selectedCount >= 2 && selectedCount <= 5;

  const handleToggleBand = (id: number) => {
    const isSelected = selectedBandIds.includes(id);
     // 선택됐는데 다시 클릭하면 해제
    if(isSelected){
      setSelectedBandIds(prev => prev.filter(bandId => bandId !== id));
      return;
    }

    if (selectedBandIds.length >= 5){ // 5개 선택되어있으면 더 이상 선택 X
      return;
    }

    setSelectedBandIds((prev) => [...prev, id]);
  }

  return (
    <>
    {/* 회원가입 Header */}
    <div className={registerStyle.registerHeader}>
        <img
        src={vector}
        className={registerStyle.registerVector}
        onClick={() => navigate(-1)}
      />
        <span className={registerStyle.registerText}>회원가입</span>
    </div>

    {/* 관심 밴드 선택 Text  */}
    <div className={registerStyle.selectText}>
      <span className={registerStyle.selectText1}>관심 밴드를 선택해 주세요</span>
       <span className={registerStyle.selectText2}>최소 2개, 최대 5개까지 선택 가능해요</span>
    </div>

     {/* 국내 인디 밴드 */}
    <div className={registerStyle.localBand}>
      
     {/* 국내 인디 밴드 타이틀 */}
      <div className={registerStyle.localText}>
        <img src={icon_microphone} />
        <span>국내 인디 밴드</span>
      </div>

        {/* 국내 인디 밴드 List */}
      <div className={registerStyle.localbandList}>
        {localBand.map((band) => {
          const isSelected = selectedBandIds.includes(band.id);
          return (
            <button
              key={band.id}
              type="button"
              className={
                isSelected
                  ? `${registerStyle.bandChip} ${registerStyle.bandChipSelected1}`
                  : registerStyle.bandChip
              }
              onClick={() => handleToggleBand(band.id)}
            >
              {band.name}
            </button>
          );
        })}
      </div>

      <div className={registerStyle.globalBand}>
            {/* 해외 밴드 타이틀 */}
        <div className={registerStyle.globalText}>
          <img src={woman_singer_light_skin_tone} />
          <span>해외 밴드</span>
        </div>
        
        {/* 해외 밴드 List */}
      <div className={registerStyle.globalbandList}>
        {globalBand.map((band) => {
          const isSelected = selectedBandIds.includes(band.id);
          return (
            <button
              key={band.id}
              type="button"
              className={
                isSelected
                  ? `${registerStyle.bandChip} ${registerStyle.bandChipSelected2}`
                  : registerStyle.bandChip
              }
              onClick={() => handleToggleBand(band.id)}
            >
              {band.name}
            </button>
          );
        })}
      </div>
      </div>

     {/* 관심밴드 선택 후 완료 페이지로 이동 */}
      <Link
  className={
    isNextEnabled
      ? `${registerStyle.nextButtonBase} ${registerStyle.nextButtonEnabled}`
      : `${registerStyle.nextButtonBase} ${registerStyle.nextButtonDisabled}`
  }
  to="/Registerfinish"
  onClick={(e) => {
    if (!isNextEnabled) {
      e.preventDefault();
    }
  }}
>
  다음
</Link>

    </div>
    </>
  )
}

export default Register