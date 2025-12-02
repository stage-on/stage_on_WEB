import menuStyle from "../css/components/menu.module.css";
import menuExitSVG from "../assets/component/menu/btn_exit.svg";
import menuHomeSVG from "../assets/component/menu/home.svg";
import menuSearchSVG from "../assets/component/menu/search.svg";
import menuTimeTableSVG from "../assets/component/menu/calendar.svg";
import menuBandsSVG from "../assets/component/menu/music.svg";
import menuConcertsSVG from "../assets/component/menu/speaker.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useStore } from "../store/store";

type Props = {
  animateMenu: boolean;
  setAnimateMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setOnMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Profile {
  name: string;
  email: string;
  profileImage: string;
}

export default function Menu({
  animateMenu,
  setOnMenu,
  setAnimateMenu,
}: Props) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => setAnimateMenu(true), 10);
    return () => clearTimeout(timer);
  }, []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const logout = useStore((state) => state.logout);
  const handleLogOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const movePage = (e: React.MouseEvent<HTMLLIElement>) => {
    const span = e.currentTarget.dataset.value;
    setOnMenu(false);
    if (span === "HOME") {
      navigate("/main/home");
    } else if (span === "SEARCH") {
      navigate("/search");
    } else if (span === "TIME TABLE") {
      navigate("/main/timetable");
    } else if (span === "MY BANDS") {
      navigate("/main/mybands");
    } else if (span === "MY CONCERTS") {
      navigate("/main/myconcerts");
    }
  };
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.status === 200) {
        setProfile(res.data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className={menuStyle.overlay}>
      <div
        className={`${menuStyle.menuDiv} ${
          animateMenu ? menuStyle.show : menuStyle.hide
        }`}
      >
        <div className={menuStyle.closeIconDiv}>
          <img
            src={menuExitSVG}
            alt="close"
            className={menuStyle.closeIcon}
            onClick={() => {
              setAnimateMenu(false);
              setTimeout(() => setOnMenu(false), 200);
            }}
          />
        </div>
        <div className={menuStyle.profileDiv}>
          <img src={profile?.profileImage} className={menuStyle.profileImg} />
          <span className={menuStyle.profileName}>{profile?.name}</span>
        </div>
        <ul className={menuStyle.menuList}>
          <li
            className={menuStyle.menuItem}
            onClick={movePage}
            data-value="HOME"
          >
            <img src={menuHomeSVG} alt="HOME" />
            <span>HOME</span>
          </li>
          <li
            className={menuStyle.menuItem}
            onClick={movePage}
            data-value="SEARCH"
          >
            <img src={menuSearchSVG} alt="SEARCH" />
            <span>SEARCH</span>
          </li>
          <li
            className={menuStyle.menuItem}
            onClick={movePage}
            data-value="TIME TABLE"
          >
            <img src={menuTimeTableSVG} alt="TIME TABLE" />
            <span>TIME TABLE</span>
          </li>
          <li
            className={menuStyle.menuItem}
            onClick={movePage}
            data-value="MY BANDS"
          >
            <img src={menuBandsSVG} alt="MY BANDS" />
            <span>MY BANDS</span>
          </li>
          <li
            className={menuStyle.menuItem}
            onClick={movePage}
            data-value="MY CONCERTS"
          >
            <img src={menuConcertsSVG} alt="MY CONCERTS" />
            <span>MY CONCERTS</span>
          </li>
        </ul>
        <span className={menuStyle.logout} onClick={handleLogOut}>
          로그아웃
        </span>
      </div>
    </div>
  );
}
