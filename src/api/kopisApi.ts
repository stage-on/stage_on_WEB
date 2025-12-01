import api from "./api";


export interface KopisPerformance {
  mt20id: string;
  prfnm: string;
  prfpdfrom: string;
  prfpdto: string;   
  poster: string;
  newstate: boolean;
}

export interface KopisBand {
  artistId: number;
  artistName: string;
  artistImageUrl: string;
  performances: KopisPerformance[];
}

export const getMyBandPerformances = async () => {
  const res = await api.get<KopisBand[]>("/kopis/performances/my-bands/sections");
  return res.data;
};
