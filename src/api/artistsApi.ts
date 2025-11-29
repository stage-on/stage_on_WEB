import api from "./api";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ROOT_URL = BASE_URL.replace(/\/api\/v1\/?$/, ""); 

export interface Artist {
  id: number;
  bandName: string;
  relateUrl: string;
  sessionMem: string;
  introBand: string;
  typeofartist: number; 
}


export const getArtists = async () => {
  const res = await api.get<Artist[]>(`${ROOT_URL}/api/artists`);
  return res.data;
};


export const submitFirstSelect = async (artistIds: number[]) => {
  const res = await api.post("/first/select", {
    artistIds, 
  });
  return res.data;
};
