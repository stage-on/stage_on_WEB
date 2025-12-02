import api from "./api";

export interface StyUrl {
  relatenm: string;    
  relateurl: string;    
}

export interface RelateTicket {
  relatenm: string;    
  relateurl: string;   
}

export interface PerformanceDetail {
  id: number;
  mt20id: string;
  prfnm: string;
  prfpdfrom: string;
  prfpdto: string;
  fcltynm: string;
  prfruntime: string;
  prfage: string;
  pcseguidance: string;
  poster: string;
  prfstate: string;
  dtguidance: string;
  tkstdate: string;
  tksttime: string;
  typeofcon: number;
  styurls: StyUrl[];
  relates: RelateTicket[];
  locationUrl: string;
}

export const getPerformanceDetail = async (mt20id: string) => {
  const res = await api.get<PerformanceDetail>(
    `/kopis/performances/detail/${mt20id}`
  );
  return res.data;
};
