import api from "./api";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ROOT_URL = BASE_URL.replace(/\/api\/v1\/?$/, ""); //v1 버전 X


export interface Artist {
  id: number;
  bandName: string;
  relateUrl: string;
  sessionMem: string;
  introBand: string;
  typeofartist: number; // 0 / 1
}

export const getArtists = async () => {
  const res = await api.get<Artist[]>(`${ROOT_URL}/api/artists`);
  return res.data;
};

export const likeArtist = async (artistId: number) => {
  const res = await api.post(`/likes/artists/${artistId}`);
  return res.data;
};
