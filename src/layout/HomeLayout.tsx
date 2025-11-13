import { Outlet } from "react-router-dom";
import headerStyle from "../css/components/header.module.css";
import logoSVG from "../assets/component/header/homeLogo.svg";
import searchSVG from "../assets/component/header/search.svg";
import menuSVG from "../assets/component/header/menu.svg";

export default function HomeLayout() {
  return (
    <div>
      <header className={headerStyle.header}>
        <img src={logoSVG} alt="로고" />
        <div className={headerStyle.iconDiv}>
          <img src={searchSVG} alt="검색" className={headerStyle.searchIcon} />
          <img src={menuSVG} alt="메뉴" />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
