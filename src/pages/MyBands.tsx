import myBandsStyle from "../css/pages/myBands.module.css";
import emptySVG from "../assets/pages/mybands/emptyCheckBox.svg";
import fullSVG from "../assets/pages/mybands/fullCheckbox.svg";
import { useEffect, useState } from "react";

export default function MyBands() {
  const bandList = [1, 2, 3, 4];

  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [onCheck, setOnCheck] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<boolean[]>(
    Array(bandList.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    setCheckedList((prev) =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  useEffect(() => {
    const trueCount = checkedList.filter((v) => v === true).length;
    if (trueCount > 0) {
      setOnCheck(true);
    } else if (trueCount === 0) {
      setOnCheck(false);
    }
  }, [checkedList]);

  return (
    <div className={myBandsStyle.container}>
      <div className={myBandsStyle.title}>MY BANDS</div>
      <div
        className={`${myBandsStyle.deleteBtn} ${
          onDelete && onCheck
            ? myBandsStyle.deleteBtn
            : onDelete
            ? myBandsStyle.onDeleteBtn
            : ""
        }`}
      >
        {onDelete ? (
          <span
            onClick={() =>
              !onCheck ? setOnDelete((prev) => !prev) : console.log("삭제로직")
            }
          >
            삭제하기
          </span>
        ) : (
          <span onClick={() => setOnDelete((prev) => !prev)}>선택 삭제</span>
        )}
      </div>

      <div className={myBandsStyle.grid}>
        {bandList.map((_, index) => (
          <div key={index} className={myBandsStyle.bandItem}>
            <div className={myBandsStyle.itemInner}>
              <div className={myBandsStyle.checkBoxDiv}>
                {(onDelete || onCheck) && (
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
