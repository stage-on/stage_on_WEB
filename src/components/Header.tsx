import headerStyle from "../css/components/header.module.css";
import logoSVG from "../assets/component/header/homeLogo.svg";
import searchSVG from "../assets/component/header/search.svg";
import menuSVG from "../assets/component/header/menu.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [onMenu, setOnMenu] = useState<boolean>(false);
  const [animateMenu, setAnimateMenu] = useState(false);

  // menuDiv 생길 때 delay 주기
  useEffect(() => {
    if (onMenu) {
      const timer = setTimeout(() => setAnimateMenu(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateMenu(false);
    }
  }, [onMenu]);
  return (
    <header className={headerStyle.header}>
      <img src={logoSVG} alt="로고" />
      <div className={headerStyle.iconDiv}>
        <img
          src={searchSVG}
          alt="검색"
          className={headerStyle.searchIcon}
          onClick={() => {
            navigate("/search");
          }}
        />
        <img
          src={menuSVG}
          alt="메뉴"
          onClick={() => {
            setOnMenu(true);
          }}
        />
      </div>
      {onMenu && (
        <div className={headerStyle.overlay}>
          <div
            className={`${headerStyle.menuDiv} ${
              animateMenu ? headerStyle.show : ""
            }`}
          ></div>
        </div>
      )}
    </header>
  );
}
