import api from "./api";

// 공연 좋아요 등록 (POST)
export const likePerformance = async (performanceId: number): Promise<void> => {
  await api.post(`/likes/performances/${performanceId}`);
};

// 공연 좋아요 취소 (DELETE)
export const cancelLikePerformance = async (
  performanceId: number
): Promise<void> => {
  await api.delete(`/likes/performances/${performanceId}`);
};
