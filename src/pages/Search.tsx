import searchStyle from "../css/pages/search.module.css";
import searchSVG from "../assets/pages/search/search.svg";
import menuSVG from "../assets/pages/search/menu.svg";
import xSVG from "../assets/pages/search/x.svg";
import heartSVG from "../assets/pages/search/heart.svg";
import arrowSVG from "../assets/pages/search/arrow-right.svg";
import { useEffect, useState } from "react";
import Menu from "../components/Menu";
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
// 밴드 검색 결과 interface => 형식 나오면 수정 필요함!!
interface ArtistItem {
  artistId?: number;
  name?: string;
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

export default function Search() {
  // 최근 검색어 담는 배열
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  // 추천 검색어 담는 배열
  const [recommendList, setRecommendList] = useState<Recommend[]>([]);
  // 공연 검색 결과 담는 배열
  const [performances, setPerformances] =
    useState<ListResult<PerformanceItem> | null>(null);
  // 밴드 검색 결과 담는 배열
  const [artists, setArtists] = useState<ListResult<ArtistItem> | null>(null);

  const [inputText, setInputText] = useState<string>("");

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [onFestival, setOnFestival] = useState<boolean>(true);
  const [onMenu, setOnMenu] = useState<boolean>(false);
  const [animateMenu, setAnimateMenu] = useState<boolean>(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // 최근 검색어 불러오는 함수
  const fetchRecentSearch = async () => {
    try {
      const res = await api.get(`${BASE_URL}/search/history`, {});

      if (res.status === 200) {
        setRecent(res.data);
      }
    } catch (error) {}
  };
  // 최근 검색어 삭제 함수
  const deleteRecent = async (id: number) => {
    try {
      const res = await api.delete(`${BASE_URL}/search/history/${id}`, {});
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
      const res = await api.get(`${BASE_URL}/recommend`, {});

      if (res.status === 200) {
        setRecommendList(res.data);
      }
    } catch (error) {}
  };
  // enter key 눌렀을 때 검색 함수 호출
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputText);
    }
  };

  // 검색 함수
  const handleSearch = async (inputText: string) => {
    try {
      const res = await api.get<ApiResponse>(
        `${BASE_URL}/search?query=${inputText}`
      );
      if (res.status === 200) {
        const data = res.data as ApiResponse;
        setPerformances(data.performances);
        setArtists(data.artists);
        setIsSearch(true);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  // 검색 결과 시작, 끝 날짜 포맷팅 함수
  const formatDateRange = (start: string, end: string) => {
    const [sy, sm, sd] = start.split("-");
    const [ey, em, ed] = end.split("-");

    return `${sy}.${sm}.${sd} - ${ey}.${em}.${ed}`;
  };

  // 처음 마운트될 때
  useEffect(() => {
    fetchRecentSearch();
    fetchRecommendSearch();
  }, []);

  // 검색창에 아무것도 입력 안 하면 isSearch = false로 변경
  useEffect(() => {
    if (inputText === "") {
      setIsSearch(false);
      fetchRecentSearch();
      fetchRecommendSearch();
    }
  }, [inputText]);
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
          <img
            src={searchSVG}
            alt="검색"
            className={searchStyle.searchIcon}
            // onClick={() => setIsSearch((prev) => !prev)}
          />
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
                        <span className={searchStyle.heart}>
                          <img src={heartSVG} alt="좋아요" />
                        </span>
                        | <span>{item.artistNames[0]}</span>
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
            {/* {!onFestival && (
              <>
                {artists?.items.map((item) => (
                  <li
                    className={searchStyle.searchResultItem}
                    key={item.artistId}
                  >
                    <img src={item.posterUrl} className={searchStyle.testImg} />
                    <div className={searchStyle.titleAndInfo}>
                      <span className={searchStyle.title}>{item.title}</span>
                      <div className={searchStyle.info}>
                        <span className={searchStyle.heart}>
                          <img src={heartSVG} alt="좋아요" />
                          999
                        </span>
                        | <span>{item.artistNames[0]}</span>
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
            )} */}
          </ul>
        </>
      )}
    </>
  );
}
