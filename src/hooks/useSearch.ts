import { useEffect, useState } from "react";
import api from "../api/api";

// 최근 검색어 interface
interface RecentSearch {
  id: number;
  keyword: string;
}
// 추천 검색어 interface
interface Recommend {
  keyword: string;
}
// 공연 검색 결과 interface
interface PerformanceItem {
  performanceId: number;
  title: string;
  posterUrl: string;
  startDate: string;
  endDate: string;
  artistNames: string[];
}
// 밴드 검색 결과 interface
interface ArtistItem {
  id: number;
  bandName: string;
  relateUrl: string;
  sessionMem: string;
  introBand: string;
  liked: boolean;
}
// 공연, 밴드 객체 interface
interface ListResult<T> {
  count: number;
  items: T[];
}
// API 호출 결과 interface
interface ApiResponse {
  performances: ListResult<PerformanceItem>;
  artists: ListResult<ArtistItem>;
}

export default function useSearch() {
  // 최근 검색어 담는 배열
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  // 추천 검색어 담는 배열
  const [recommendList, setRecommendList] = useState<Recommend[]>([]);
  // 공연 검색 결과 담는 배열
  const [performances, setPerformances] =
    useState<ListResult<PerformanceItem> | null>(null);
  // 밴드 검색 결과 담는 배열
  const [artists, setArtists] = useState<ListResult<ArtistItem> | null>(null);
  // 통합 검색 여부
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // 최근 검색어 불러오는 함수
  const fetchRecentSearch = async () => {
    try {
      const res = await api.get(`/search/history`);

      if (res.status === 200) {
        setRecent(res.data);
      }
    } catch (error) {}
  };

  // 최근 검색어 삭제 함수
  const deleteRecent = async (id: number) => {
    try {
      const res = await api.delete(`/search/history/${id}`);
      if (res.status == 200) {
        alert(res.data);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    } finally {
      fetchRecentSearch();
    }
  };

  // 추천 검색어 불러오는 함수
  const fetchRecommendSearch = async () => {
    try {
      const res = await api.get(`/recommend`);

      if (res.status === 200) {
        setRecommendList(res.data);
      }
    } catch (error) {}
  };

  // 하트 눌렀을 때 MY BANDS에 밴드 추가 함수
  const handleLikeBands = async (id: number) => {
    try {
      const res = await api.post(`/likes/artists/${id}`);
      if (res.status === 200) {
        alert("MY BANDS에 밴드를 추가했습니다!");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // 통합 검색 함수
  const handleSearch = async (inputText: string) => {
    if (inputText === "") {
      alert("검색어를 입력해주세요!");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>(`/search?query=${inputText}`);
      if (res.status === 200) {
        const data = res.data as ApiResponse;
        setPerformances(data.performances);
        setArtists(data.artists);
        setIsSearch(true);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // 처음 마운트될 때
  useEffect(() => {
    fetchRecentSearch();
    fetchRecommendSearch();
  }, []);

  return {
    recent,
    recommendList,
    performances,
    artists,
    isSearch,
    loading,
    setIsSearch,
    handleSearch,
    handleLikeBands,
    deleteRecent,
    fetchRecentSearch,
    fetchRecommendSearch,
  };
}
