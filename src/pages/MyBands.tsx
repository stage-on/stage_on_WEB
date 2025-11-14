import myBandsStyle from "../css/pages/myBands.module.css";
import emptySVG from "../assets/pages/mybands/emptyCheckBox.svg";
import fullSVG from "../assets/pages/mybands/fullCheckbox.svg";
import { useEffect, useState } from "react";

export default function MyBands() {
  const bandList = [1, 2, 3, 4];

  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<boolean[]>(
    Array(bandList.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    setCheckedList((prev) =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  return (
    <div className={myBandsStyle.container}>
      <div className={myBandsStyle.title}>MY BANDS</div>
      <div
        className={`${myBandsStyle.deleteBtn} ${
          onDelete === true ? myBandsStyle.onDeleteBtn : ""
        }`}
      >
        <span onClick={() => setOnDelete((prev) => !prev)}>선택 삭제</span>
      </div>

      <div className={myBandsStyle.grid}>
        {bandList.map((_, index) => (
          <div key={index} className={myBandsStyle.bandItem}>
            <div className={myBandsStyle.itemInner}>
              <div className={myBandsStyle.checkBoxDiv}>
                {onDelete && (
                  <img
                    src={checkedList[index] ? fullSVG : emptySVG}
                    alt="checkbox"
                    className={myBandsStyle.checkBox}
                    onClick={() => toggleCheck(index)}
                  />
                )}
              </div>
              <div className={myBandsStyle.bandProfile}></div>
              <div className={myBandsStyle.bandName}>밴드 이름</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
