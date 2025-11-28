import myBandsStyle from "../css/pages/myBands.module.css";
import emptySVG from "../assets/pages/mybands/emptyCheckBox.svg";
import fullSVG from "../assets/pages/mybands/fullCheckbox.svg";
import { useEffect, useState } from "react";
import useMyBands from "../hooks/useMyBands";

interface MyBands {
  artistId: number;
  artistName: string;
  artistPictureUrl: string;
}
export default function MyBands() {
  const [onCheck, setOnCheck] = useState<boolean>(false);
  const {
    bandList,
    checkedList,
    toggleCheck,
    removeMyBands,
    loading,
    onDelete,
    setOnDelete,
  } = useMyBands();

  useEffect(() => {
    setOnCheck(checkedList.some((v) => v));
  }, [checkedList]);
  if (loading) return <div>로딩중...</div>;
  return (
    <div className={myBandsStyle.container}>
      <div className={myBandsStyle.title}>MY BANDS</div>
      {bandList.length > 0 ? (
        <>
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
                  !onCheck ? setOnDelete((prev) => !prev) : removeMyBands(-1)
                }
              >
                삭제하기
              </span>
            ) : (
              <span onClick={() => setOnDelete((prev) => !prev)}>
                선택 삭제
              </span>
            )}
          </div>

          <div className={myBandsStyle.grid}>
            {bandList.map((item, index) => (
              <div key={item.artistId} className={myBandsStyle.bandItem}>
                <div className={myBandsStyle.itemInner}>
                  <div className={myBandsStyle.checkBoxDiv}>
                    {(onDelete || onCheck) && (
                      <img
                        src={checkedList[index] ? fullSVG : emptySVG}
                        alt="checkbox"
                        className={myBandsStyle.checkBox}
                        onClick={() => toggleCheck(index, item.artistId)}
                      />
                    )}
                  </div>
                  <img
                    src={item.artistPictureUrl}
                    className={myBandsStyle.bandProfile}
                  />
                  <div className={myBandsStyle.bandName}>{item.artistName}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={myBandsStyle.emptyContainer}>
            MY BANDS가 없습니다.
          </div>
        </>
      )}
    </div>
  );
}
