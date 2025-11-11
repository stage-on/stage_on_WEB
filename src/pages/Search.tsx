import searchStyle from "../css/pages/search.module.css";
import searchSVG from "../assets/search/search.svg";
import menuSVG from "../assets/search/menu.svg";
import xSVG from "../assets/search/x.svg";
import heartSVG from "../assets/search/heart.svg";
import arrowSVG from "../assets/search/arrow-right.svg";
import { useEffect, useState } from "react";

export default function Search() {
  const [inputText, setInputText] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(true);
  const [onFestival, setOnFestival] = useState<boolean>(true);
  const recommendLista: any[] = [
    {
      id: 1,
      title: "팔칠댄스 ［I LOVE YOUR COMPLEX］ 부산 쇼케이스",
      location: "부산",
    },
    {
      id: 2,
      title: "2025 비공정 단독공연 〈Hellvetica : Sabotage〉 in Busan",
      location: "부산",
    },
    {
      id: 3,
      title: "2025 LUCY 8TH CONCERT 〈LUCID LINE〉",
      location: "서울",
    },
    {
      id: 4,
      title: "원 오크 록 내한공연",
      location: "서울",
    },
    {
      id: 5,
      title: "쏜애플 콘서트 ‘바다와 구름과 무대’",
      location: "서울",
    },
  ];

  // enter key 눌렀을 때 검색 함수 호출
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputText);
    }
  };

  // 검색 함수
  const handleSearch = async (inputText: string) => {
    // 검색 api 연동 하기
    // if (res.status === 200) {
    //   setIsSearch(true);
    // }
  };
  // 나중에 지울거
  useEffect(() => {
    console.log(inputText);
  }, [inputText]);
  return (
    <>
      <div className={searchStyle.inputDiv}>
        <img
          src={searchSVG}
          alt="검색"
          className={searchStyle.searchIcon}
          onClick={(prev) => setIsSearch(!prev)}
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
        <img src={menuSVG} alt="메뉴" className={searchStyle.menuIcon} />
      </div>
      {isSearch == false ? (
        <>
          <div className={searchStyle.recentSearchDiv}>
            <span className={searchStyle.recentSearchHeader}>최근 검색어</span>
            <ul className={searchStyle.recentSearchList}>
              <li className={searchStyle.recentSearchItem}>
                쏜애플 콘서트
                <img src={xSVG} alt="삭제" className={searchStyle.xIcon} />
              </li>
              <li className={searchStyle.recentSearchItem}>
                쏜애플 콘서트
                <img src={xSVG} alt="삭제" className={searchStyle.xIcon} />
              </li>
              <li className={searchStyle.recentSearchItem}>
                쏜애플 콘서트
                <img src={xSVG} alt="삭제" className={searchStyle.xIcon} />
              </li>
              <li className={searchStyle.recentSearchItem}>
                쏜애플 콘서트
                <img src={xSVG} alt="삭제" className={searchStyle.xIcon} />
              </li>
              <li className={searchStyle.recentSearchItem}>
                쏜애플 콘서트
                <img src={xSVG} alt="삭제" className={searchStyle.xIcon} />
              </li>
            </ul>
          </div>
          <div className={searchStyle.recommendSearchDiv}>
            <span className={searchStyle.recommendSearchHeader}>
              추천 검색어
            </span>
            <ul className={searchStyle.recommendSearchList}>
              {recommendLista.map((item) => (
                <li
                  key={item.id}
                  className={searchStyle.recommendSearchItem}
                  onClick={() => {
                    setInputText(item.title);
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className={searchStyle.searchResultDiv}>
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
                    onFestival ? searchStyle.selected : searchStyle.default
                  }     `}
                >
                  159
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
                    !onFestival ? searchStyle.selected : searchStyle.default
                  }`}
                >
                  1
                </span>
              </div>
            </div>
            <ul className={searchStyle.searchResultDiv}>
              {onFestival && (
                <li className={searchStyle.searchResultItem}>
                  <span className={searchStyle.testImg}>test</span>
                  <div className={searchStyle.titleAndInfo}>
                    <span className={searchStyle.title}>
                      쏜애플 콘서트 ‘바다와 구름과 무대
                    </span>
                    <div className={searchStyle.info}>
                      <span className={searchStyle.heart}>
                        <img src={heartSVG} alt="좋아요" />
                        999
                      </span>
                      | <span>쏜애플</span>| <span>2025.12.20 - 12.21</span>
                    </div>
                  </div>
                  <img
                    src={arrowSVG}
                    alt="이동"
                    className={searchStyle.arrowIcon}
                  />
                </li>
              )}
              {!onFestival && (
                <li className={searchStyle.searchResultItem}>
                  <span className={searchStyle.bandTestImg}></span>
                  <div className={searchStyle.bandNameAndInfo}>
                    <span className={searchStyle.bandName}>쏜애플</span>
                    <span className={searchStyle.bandHeart}>
                      <img src={heartSVG} alt="좋아요" />
                      999
                    </span>
                  </div>
                  <img
                    src={arrowSVG}
                    alt="이동"
                    className={searchStyle.arrowIcon}
                  />
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
