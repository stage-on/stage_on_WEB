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
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
  return {
    bandList,
    checkedList,
    toggleCheck,
    removeMyBands,
    loading,
    setCheckedList,
  };
}
