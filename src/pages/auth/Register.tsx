import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import registerStyle from "../../css/pages/register.module.css";
import vector from "../../assets/auth/Vector.svg";
import icon_microphone from "../../assets/auth/icon_microphone.svg";
import woman_singer_light_skin_tone from "../../assets/auth/Woman Singer Light Skin Tone.svg";

import { getArtists, likeArtist } from "../../api/artistsApi";
import type { Artist } from "../../api/artistsApi";

// 1 = 국내, 2 = 해외
const LOCAL_TYPE = 1;
const GLOBAL_TYPE = 2;

const Register = () => {
  const navigate = useNavigate();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedBandIds, setSelectedBandIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = selectedBandIds.length;
  const isNextEnabled = selectedCount >= 2 && selectedCount <= 5;

  // 전체 아티스트 목록 조회
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getArtists();
        setArtists(data);
      } catch (err: any) {
        console.error("getArtists error:", err);
        setError("밴드 목록을 불러오는 데 실패했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // typeofartist 값으로 국내 / 해외 분리
  const localBand = artists.filter(
    (artist) => artist.typeofartist === LOCAL_TYPE
  );
  const globalBand = artists.filter(
    (artist) => artist.typeofartist === GLOBAL_TYPE
  );

  const handleToggleBand = (id: number) => {
    const isSelected = selectedBandIds.includes(id);

    // 이미 선택된 경우 해제
    if (isSelected) {
      setSelectedBandIds((prev) => prev.filter((bandId) => bandId !== id));
      return;
    }

    // 5개 선택되어 있으면 더 이상 선택 불가
    if (selectedBandIds.length >= 5) {
      return;
    }

    // 새로 선택
    setSelectedBandIds((prev) => [...prev, id]);
  };

  const handleSubmit = async () => {
    if (!isNextEnabled || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await Promise.all(selectedBandIds.map((id) => likeArtist(id)));

      navigate("/Registerfinish");
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 400) {
        alert(err.response.data?.message ?? "선택 가능한 밴드 수를 초과했어요.");
      } else {
        alert("관심 밴드를 저장하는 데 실패했어요. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 회원가입 Header */}
      <div className={registerStyle.registerHeader}>
        <img
          src={vector}
          className={registerStyle.registerVector}
          onClick={() => navigate(-1)}
        />
        <span className={registerStyle.registerText}>회원가입</span>
      </div>

      {/* 관심 밴드 선택 Text */}
      <div className={registerStyle.selectText}>
        <span className={registerStyle.selectText1}>관심 밴드를 선택해 주세요</span>
        <span className={registerStyle.selectText2}>
          최소 2개, 최대 5개까지 선택 가능해요
        </span>
      </div>

      {/* 로딩/에러 메시지 */}
      {loading && <p>밴드 목록을 불러오는 중이에요...</p>}
      {error && <p>{error}</p>}

      {/* 국내 인디 밴드 */}
      <div className={registerStyle.localBand}>
        {/* 국내 인디 밴드 타이틀 */}
        <div className={registerStyle.localText}>
          <img src={icon_microphone} />
          <span>국내 인디 밴드</span>
        </div>

        {/* 국내 인디 밴드 List */}
        <div className={registerStyle.localbandList}>
          {!loading &&
            localBand.map((band) => {
              const isSelected = selectedBandIds.includes(band.id);
              return (
                <button
                  key={band.id}
                  type="button"
                  className={
                    isSelected
                      ? `${registerStyle.bandChip} ${registerStyle.bandChipSelected1}`
                      : registerStyle.bandChip
                  }
                  onClick={() => handleToggleBand(band.id)}
                >
                  {band.bandName}
                </button>
              );
            })}
        </div>

        {/* 해외 밴드 */}
        <div className={registerStyle.globalBand}>
          {/* 해외 밴드 타이틀 */}
          <div className={registerStyle.globalText}>
            <img src={woman_singer_light_skin_tone} />
            <span>해외 밴드</span>
          </div>

          {/* 해외 밴드 List */}
          <div className={registerStyle.globalbandList}>
            {!loading &&
              globalBand.map((band) => {
                const isSelected = selectedBandIds.includes(band.id);
                return (
                  <button
                    key={band.id}
                    type="button"
                    className={
                      isSelected
                        ? `${registerStyle.bandChip} ${registerStyle.bandChipSelected2}`
                        : registerStyle.bandChip
                    }
                    onClick={() => handleToggleBand(band.id)}
                  >
                    {band.bandName}
                  </button>
                );
              })}
          </div>
        </div>

        {/* 관심밴드 선택 후 완료 페이지로 이동 */}
        <button
          type="button"
          className={
            isNextEnabled
              ? `${registerStyle.nextButtonBase} ${registerStyle.nextButtonEnabled}`
              : `${registerStyle.nextButtonBase} ${registerStyle.nextButtonDisabled}`
          }
          disabled={!isNextEnabled || isSubmitting || loading}
          onClick={handleSubmit}
        >
          {isSubmitting ? "저장 중..." : "다음"}
        </button>
      </div>
    </>
  );
};

export default Register;
