import searchStyle from "../css/pages/search.module.css";
import searchSVG from "../assets/pages/search/search.svg";
import menuSVG from "../assets/pages/search/menu.svg";
import xSVG from "../assets/pages/search/x.svg";
import arrowSVG from "../assets/pages/search/arrow-right.svg";
import emptyHeart from "../assets/pages/mybands/empty_heart.svg";
import fullHeart from "../assets/pages/mybands/full_heart.svg";
import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import useSearch from "../hooks/useSearch";
import useMyBands from "../hooks/useMyBands";

export default function Search() {
  // 입력된 검색어
  const [inputText, setInputText] = useState<string>("");
  // 공연 탭인지 아닌지
  const [onFestival, setOnFestival] = useState<boolean>(true);
  // 메뉴 눌렀는지 아닌지
  const [onMenu, setOnMenu] = useState<boolean>(false);
  const [animateMenu, setAnimateMenu] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean[]>([]);
  const {
    recent,
    recommendList,
    performances,
    artists,
    loading,
    isSearch,
    setIsSearch,
    handleSearch,
    handleLikeBands,
    deleteRecent,
    fetchRecentSearch,
    fetchRecommendSearch,
  } = useSearch();
  const { removeMyBands } = useMyBands();

  // enter key 눌렀을 때 검색 함수 호출
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputText);
    }
  };

  // 검색 결과 시작, 끝 날짜 포맷팅 함수
  const formatDateRange = (start: string, end: string) => {
    const [sy, sm, sd] = start.split("-");
    const [ey, em, ed] = end.split("-");

    return `${sy}.${sm}.${sd} - ${ey}.${em}.${ed}`;
  };

  // 검색창에 아무것도 입력 안 하면 isSearch = false로 변경
  useEffect(() => {
    if (inputText === "") {
      setIsSearch(false);
      fetchRecentSearch();
      fetchRecommendSearch();
    }
  }, [inputText]);

  // artists가 바뀔 때 liked 배열 초기화
  useEffect(() => {
    if (artists?.items) {
      setLiked(artists.items.map((artist) => artist.liked ?? false));
    }
  }, [artists]);

  if (loading) return <div>로딩중...</div>;
  return (
    <>
      {onMenu && (
        <Menu
          animateMenu={animateMenu}
          setOnMenu={setOnMenu}
          setAnimateMenu={setAnimateMenu}
        />
      )}
      <div className={searchStyle.fixedDiv}>
        <div className={searchStyle.inputDiv}>
          <img src={searchSVG} alt="검색" className={searchStyle.searchIcon} />
          <input
            placeholder="검색어를 입력하세요"
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            onKeyDown={handleEnter}
          />
          <img
            src={menuSVG}
            alt="메뉴"
            className={searchStyle.menuIcon}
            onClick={() => {
              setOnMenu(true);
            }}
          />
        </div>
        {isSearch && (
          <div className={searchStyle.festivalAndBand}>
            <div
              className={searchStyle.festivalDiv}
              onClick={() => {
                setOnFestival(true);
              }}
            >
              <span
                className={`${searchStyle.festival} ${
                  onFestival ? searchStyle.selected : searchStyle.default
                }`}
              >
                공연
              </span>
              <span
                className={`${searchStyle.count} ${
                  onFestival
                    ? searchStyle.selected
                    : `${searchStyle.default} ${searchStyle.defaultCnt}`
                }     `}
              >
                {performances?.count}
              </span>
            </div>
            <div
              className={searchStyle.bandDiv}
              onClick={() => {
                setOnFestival(false);
              }}
            >
              <span
                className={`${searchStyle.band} ${
                  !onFestival ? searchStyle.selected : searchStyle.default
                }`}
              >
                밴드
              </span>
              <span
                className={`${searchStyle.count} ${
                  !onFestival
                    ? searchStyle.selected
                    : `${searchStyle.default} ${searchStyle.defaultCnt}`
                }`}
              >
                {artists?.count}
              </span>
            </div>
          </div>
        )}
      </div>
      {isSearch == false ? (
        <>
          <div className={searchStyle.recentSearchDiv}>
            <span className={searchStyle.recentSearchHeader}>최근 검색어</span>
            <ul className={searchStyle.recentSearchList}>
              {recent.map((item) => (
                <li className={searchStyle.recentSearchItem} key={item.id}>
                  {item.keyword}
                  <img
                    src={xSVG}
                    alt="삭제"
                    className={searchStyle.xIcon}
                    onClick={() => {
                      deleteRecent(item.id);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className={searchStyle.recommendSearchDiv}>
            <span className={searchStyle.recommendSearchHeader}>
              추천 검색어
            </span>
            <ul className={searchStyle.recommendSearchList}>
              {recommendList.map((item, idx) => (
                <li
                  key={idx}
                  className={searchStyle.recommendSearchItem}
                  onClick={() => {
                    setInputText(item.keyword);
                  }}
                >
                  {item.keyword}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <ul className={searchStyle.searchResultDiv}>
            {onFestival && (
              <>
                {performances?.items.map((item) => (
                  <li
                    className={searchStyle.searchResultItem}
                    key={item.performanceId}
                  >
                    <img src={item.posterUrl} className={searchStyle.testImg} />
                    <div className={searchStyle.titleAndInfo}>
                      <span className={searchStyle.title}>{item.title}</span>
                      <div className={searchStyle.info}>
                        <img src={emptyHeart} alt="좋아요" />
                        <span className={searchStyle.innerText}>|</span>
                        <span>{item.artistNames[0]}</span>
                        <span className={searchStyle.innerText}>|</span>
                        <span>
                          {formatDateRange(item.startDate, item.endDate)}
                        </span>
                      </div>
                    </div>
                    <img
                      src={arrowSVG}
                      alt="이동"
                      className={searchStyle.arrowIcon}
                    />
                  </li>
                ))}
              </>
            )}
            {!onFestival && (
              <>
                {artists?.items.map((item, index) => (
                  <li className={searchStyle.searchResultItem} key={item.id}>
                    <img
                      src={item.relateUrl}
                      className={searchStyle.bandTestImg}
                    />
                    <div className={searchStyle.bandNameAndInfo}>
                      <span className={searchStyle.bandName}>
                        {item.bandName}
                      </span>
                    </div>
                    <img
                      src={liked[index] ? fullHeart : emptyHeart}
                      alt="하트"
                      className={searchStyle.hearIcon}
                      onClick={() => {
                        if (liked[index]) {
                          removeMyBands(item.id);
                        } else {
                          handleLikeBands(item.id);
                        }
                        // 클릭 시 해당 인덱스 liked만 토글
                        setLiked((prev) =>
                          prev.map((v, i) => (i === index ? !v : v))
                        );
                      }}
                    />
                  </li>
                ))}
              </>
            )}
          </ul>
        </>
      )}
    </>
  );
}
