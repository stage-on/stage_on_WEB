import myBandsStyle from "../css/pages/myBands.module.css";
import emptySVG from "../assets/pages/mybands/emptyCheckBox.svg";
import fullSVG from "../assets/pages/mybands/fullCheckbox.svg";
import { useEffect, useState } from "react";
import api from "../api/api";

interface MyBands {
  artistId: number;
  artistName: string;
  artistPictureUrl: string;
}
export default function MyBands() {
  const [bandList, setBandList] = useState<MyBands[]>([]);
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
  const fetchMyBands = async () => {
    try {
      const res = await api.get("/likes/my/bands");
      if (res.status === 200) {
        setBandList(res.data);
        setCheckedList(Array(res.data.length).fill(false));
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const removeMyBands = async () => {
    try {
      const res = await api.delete(`/likes/artists`);
      if (res.status === 200) {
        alert("삭제 완료했습니다!");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchMyBands();
  }, []);

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
                  !onCheck ? setOnDelete((prev) => !prev) : removeMyBands()
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
                        onClick={() => toggleCheck(index)}
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
