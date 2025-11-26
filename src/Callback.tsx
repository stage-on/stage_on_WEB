import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "./store/store";
import api from "./api/api";

interface Result {
  email: string;
  name: string;
  profileImgUrl: string;
  firstLogin: boolean;
}
export default function Callback() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const login = useStore((state) => state.login);
  const navigate = useNavigate();
  const [checkResult, setCheckResult] = useState<Result | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log(token);
    if (token) {
      login(token);
      userCheck();
    }
  }, [location.search]);

  useEffect(() => {
    if (checkResult !== null) {
      if (checkResult.firstLogin === true) {
        navigate("/register");
      } else {
        navigate("/main/home");
      }
    }
  }, [checkResult, navigate]);

  const userCheck = async () => {
    try {
      const res = await api.get(`${BASE_URL}/auth/login-check`);

      if (res.status === 200) {
        setCheckResult(res.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return <></>;
}
