// src/api/myConcertsApi.ts
import api from "./api";

export interface MyConcertResponse {
  performanceId: number;
  title: string;
  posterUrl: string;
  prfpdfrom: string; 
  prfpdto: string;   
  fcltynm: string;  
}

// MY Concerts 조회 API
export const getMyConcerts = async (): Promise<MyConcertResponse[]> => {
  const res = await api.get<MyConcertResponse[]>("/likes/my/concerts");
  return res.data;
};
 
// 좋아요 취소  API
export const cancelLikePerformance = async (
  performanceId: number
): Promise<void> => {
  await api.delete(`/likes/performances/${performanceId}`);
};
