import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stageonlogo from ".././assets/StageonLogo.svg"; 
import ".././css/Splash.css";

type SplashProps = {
  next?: string;
  delayMs?: number;
};

export default function Splash({
  next = "/",
  delayMs = 3000, /*나중에 3초로 조정 */
}: SplashProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const time = setTimeout(() => navigate(next, { replace: true }), delayMs);
    return () => clearTimeout(time);
  }, [navigate, next, delayMs]);

  return (
    <div
      className="splash-container"
      role="main"
      aria-label="Stage_On splash screen"
    >
   
      <div className="headline">
        <span>무대가</span>
        <span>켜지는 순간의</span>
        <span>설렘,</span>
      </div>

      <div className="brand">
        <img src={stageonlogo} alt="StageonLogo"/>
     
      </div>
    </div>
  );
}
