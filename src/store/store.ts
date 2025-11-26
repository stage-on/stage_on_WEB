import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";

// 상태 타입 정의
interface Store {
  accessToken: string | null;

  login: (accessToken: string) => void;
  logout: () => void;
  isLogin: () => boolean;
}

// zustand 스토어 생성
const useStore = create<Store>((set, get) => ({
  accessToken: null,

  login: (accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }

    set(() => ({
      accessToken,
    }));
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }

    set(() => ({
      accessToken: null,
    }));
  },

  isLogin: () => get().accessToken !== null,
}));
const useLocalStorage = () => {
  const navigate = useNavigate(); // 리디렉션을 위한 navigate 훅 사용
  const { login } = useStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccessToken = localStorage.getItem("accessToken");

      if (storedAccessToken) {
        // localStorage에서 값이 있으면 상태에 반영
        login(storedAccessToken);
      } else {
        // 로그인하지 않은 경우 로그인 페이지로 리디렉션
        navigate("/login");
      }
    }
  }, [login, navigate]); // 로그인 상태 변경 시 다시 실행
};

export { useStore, useLocalStorage };
