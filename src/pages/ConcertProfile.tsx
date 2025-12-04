import { useEffect, useState } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import concertProfileStyle from "../css/pages/concertprofile.module.css";
import posterPlaceholder from "../assets/poster image.svg";
import heartFilled from "../assets/timetable/heart.svg";
import heartEmpty from "../assets/myconcertheartEmpty.svg";
import bandListImg from "../assets/bandlistimg.svg";
import { likePerformance, cancelLikePerformance } from "../api/performanceLike";
import {
  getPerformanceDetail,
  type PerformanceDetail,
} from "../api/performanceDetail";

type RouteParams = {
  mt20id?: string;
};

type LocationState = {
  liked?: boolean;
};

const formatDateRange = (from?: string, to?: string) => {
  if (!from || !to) return "";
  const [fromY, fromM, fromD] = from.split("-");
  const [, toM, toD] = to.split("-");
  return `${fromY}.${fromM}.${fromD} - ${toM}.${toD}`;
};

const ConcertProfile = () => {
  const navigate = useNavigate();
  const { mt20id } = useParams<RouteParams>();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [liked, setLiked] = useState<boolean>(state?.liked ?? false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const handleToggleLike = async () => {
    if (!detail) return;
    if (isProcessing) return;

    const performanceId = detail.id;

    try {
      setIsProcessing(true);

      if (liked) {
        await cancelLikePerformance(performanceId);
        setLiked(false);
      } else {
        await likePerformance(performanceId);
        setLiked(true);
      }
    } catch (error) {
      console.error("관심 공연 처리 실패:", error);
      alert("관심 공연 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!mt20id) return;

    const fetchDetail = async () => {
      try {
        const data = await getPerformanceDetail(mt20id);
        setDetail(data);
      } catch (e) {
        console.error(e);
        alert("공연 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [mt20id]);

  if (loading) {
    return (
      <div className={concertProfileStyle.page}>
        <div className={concertProfileStyle.header}>
          <HiChevronLeft
            className={concertProfileStyle.Vector}
            onClick={() => navigate("/main/myconcerts")}
          />
          <span className={concertProfileStyle.concertName}>로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className={concertProfileStyle.page}>
        <div className={concertProfileStyle.header}>
          <HiChevronLeft
            className={concertProfileStyle.Vector}
            onClick={() => navigate("/main/myconcerts")}
          />
          <span className={concertProfileStyle.concertName}>
            공연 정보를 찾을 수 없습니다.
          </span>
        </div>
      </div>
    );
  }

  const {
    prfnm,
    prfpdfrom,
    prfpdto,
    fcltynm,
    prfruntime,
    pcseguidance,
    poster,
    tkstdate,
    tksttime,
    styurls,
    relates,
    locationUrl,
  } = detail;

  const ticketSite = relates?.[0];

  const handleOpenTicket = () => {
    if (ticketSite?.relateurl) {
      window.open(ticketSite.relateurl, "_blank");
    }
  };

  const handleOpenLocation = () => {
    if (locationUrl) {
      window.open(locationUrl, "_blank");
    }
  };

  return (
    <div className={concertProfileStyle.page}>
      {/* 헤더 */}
      <div className={concertProfileStyle.header}>
        <HiChevronLeft
          className={concertProfileStyle.Vector}
          onClick={() => navigate("/main/myconcerts")}
        />
        <span className={concertProfileStyle.concertName}>{prfnm}</span>
      </div>

      {/* 포스터 */}
      <img
        src={poster || posterPlaceholder}
        className={concertProfileStyle.posterImg}
      />

      <div className={concertProfileStyle.SectionWrapper}>
        <div className={concertProfileStyle.infoSection}>
          <div className={concertProfileStyle.leftBlock}>
            <span className={concertProfileStyle.title}>{prfnm}</span>
            <span className={concertProfileStyle.location}>{fcltynm}</span>
          </div>
<div className={concertProfileStyle.rightBlock}>

  <div className={concertProfileStyle.likeRow}>
    <img
      src={liked ? heartFilled : heartEmpty}
      className={concertProfileStyle.heartIcon}
    />
  </div>

    {liked ? (
      <button
        className={concertProfileStyle.interestButton}
        onClick={handleToggleLike}
        disabled={isProcessing}
      >
        나의 관심 공연
      </button>
    ) : (
      <button
        className={concertProfileStyle.interestButtonInactive}
        onClick={handleToggleLike}
        disabled={isProcessing}
      >
        관심 공연으로 추가하기
      </button>
    )}
  </div>

          </div>
        </div>

        {/* 상세 정보 섹션 */}
        <div className={concertProfileStyle.infoSection2}>
        <div className={concertProfileStyle.detailSection}>
          <div className={concertProfileStyle.detailLeft}>
            <div className={concertProfileStyle.detailTitle}>상세 정보</div>

            <div className={concertProfileStyle.detailItem}>
              <span className={concertProfileStyle.label}>일시</span>
              <span className={concertProfileStyle.value}>
                {formatDateRange(prfpdfrom, prfpdto)}
              </span>
            </div>

            <div className={concertProfileStyle.detailItem}>
              <span className={concertProfileStyle.label}>티켓</span>
              <span className={concertProfileStyle.value}>{pcseguidance}</span>
            </div>

            <div className={concertProfileStyle.detailItem}>
              <span className={concertProfileStyle.label}>예매일</span>
              <span className={concertProfileStyle.value}>
                {tkstdate} {tksttime}
              </span>
            </div>

            <div className={concertProfileStyle.detailItem}>
              <span className={concertProfileStyle.label}>러닝타임</span>
              <span className={concertProfileStyle.value}>{prfruntime}</span>
            </div>
          </div>

          <div className={concertProfileStyle.detailRight}>
            <button className={concertProfileStyle.detailButton}>
              타임테이블 커스텀
            </button>

            <button
              className={concertProfileStyle.detailButton}
              onClick={handleOpenTicket}
            >
              예매처 바로 가기
            </button>

            <button
              className={concertProfileStyle.detailButton}
              onClick={handleOpenLocation}
            >
              공연장 위치 보기
            </button>
          </div>
        </div>

        {/* 밴드 라인업 */}
        <div className={concertProfileStyle.bandLineupSection}>
          <div className={concertProfileStyle.bandLineupTitle}>
            출연 밴드 라인업
          </div>

          <div className={concertProfileStyle.bandList}>
            {styurls && styurls.length > 0 ? (
              styurls.map((s) => (
                <div
                  key={s.relatenm}
                  className={concertProfileStyle.bandItem}
                >
                  <img
                    src={s.relateurl || bandListImg}
                    className={concertProfileStyle.bandAvatar}
                  />
                  <span className={concertProfileStyle.bandName}>
                    {s.relatenm}
                  </span>
                </div>
              ))
            ) : (
              <div>출연진 정보가 아직 등록되지 않았습니다.</div>
            )}
          </div>
        </div>
      </div>
</div>
  );
};

export default ConcertProfile;
