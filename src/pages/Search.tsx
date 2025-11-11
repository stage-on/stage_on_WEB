import searchStyle from "../css/pages/search.module.css";
import searchSVG from "../assets/search/search.svg";
import menuSVG from "../assets/search/menu.svg";
import xSVG from "../assets/search/x.svg";

export default function Search() {
  return (
    <>
      <div className={searchStyle.inputDiv}>
        <img src={searchSVG} alt="검색" className={searchStyle.searchIcon} />
        <input placeholder="검색어를 입력하세요" type="text" />
        <img src={menuSVG} alt="메뉴" className={searchStyle.menuIcon} />
      </div>
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
        <span className={searchStyle.recommendSearchHeader}>추천 검색어</span>
        <ul className={searchStyle.recommendSearchList}>
          <li className={searchStyle.recommendSearchItem}>
            팔칠댄스 ［I LOVE YOUR COMPLEX］ 부산 쇼케이스 - 부산
          </li>
          <li className={searchStyle.recommendSearchItem}>
            2025 비공정 단독공연 〈Hellvetica : Sabotage〉 in Busan - 부산
          </li>
          <li className={searchStyle.recommendSearchItem}>
            2025 LUCY 8TH CONCERT 〈LUCID LINE〉 서울
          </li>
          <li className={searchStyle.recommendSearchItem}>
            원 오크 록 내한공연
          </li>
          <li className={searchStyle.recommendSearchItem}>
            쏜애플 콘서트 ‘바다와 구름과 무대’
          </li>
        </ul>
      </div>
    </>
  );
}
