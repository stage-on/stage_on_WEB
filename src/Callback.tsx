import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "./store/store";

export default function Callback() {
  const location = useLocation();
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log(token);
    if (token) {
      login(token);
      navigate("/main/home");
    }
  }, [location.search]);
  return <></>;
}
