import { useEffect, useState } from "react";
import api from "../api/api";

interface MyBands {
  artistId: number;
  artistName: string;
  artistPictureUrl: string;
}

export default function useMyBands() {
  const [bandList, setBandList] = useState<MyBands[]>([]);
  const [checkedList, setCheckedList] = useState<boolean[]>([]);
  const [deleteReq, setDeleteReq] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // 밴드 선택 함수
  const toggleCheck = (index: number, id: number) => {
    setCheckedList((prev) =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
    setDeleteReq((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // MY BANDS 정보 불러오기
  const fetchMyBands = async () => {
    try {
      const res = await api.get("/likes/my/bands");
      if (res.status === 200) {
        setBandList(res.data);
        setCheckedList(Array(res.data.length).fill(false));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 선택한 밴드 삭제하기
  const removeMyBands = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/likes/artists/delete`, {
        artistIds: deleteReq,
      });
      if (res.status === 200) {
        alert("삭제 완료했습니다!");
        fetchMyBands();
      }
    } catch (error: any) {
      alert(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyBands();
  }, []);
  return {
    bandList,
    checkedList,
    toggleCheck,
    // handleLikeBands,
    removeMyBands,
    loading,
    setCheckedList,
  };
}
