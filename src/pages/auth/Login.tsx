import loginlogo from "../../assets/auth/LoginLogo.svg";
import loginStyle from "../../css/pages/login.module.css";
import googlelogo from  "../../assets/auth/Google.svg";
import kakaologo from "../../assets/auth/KaKao.svg"

const Login = () => {
  const REST_API_KEY = '백엔드 연동전';
  const REDIRECT_URI = '백엔드한테 연동전';
  const kakaolink = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
  const GOOGLE_REDIRECT_URI = "http://localhost:5173/login"; // 백엔드 연동 전 임시
  const googlelink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;

  const handleGoogleLogin = () => {
    window.location.href = googlelink;
  }

  const handleKaKaoLogin = () => {
    window.location.href = kakaolink;
  }

  return (
  <div className={loginStyle.fixedDiv}>
    <img
      src={loginlogo}
      alt="로그인화면로고"
      className={loginStyle.loginLogo}
    />
    <span className={loginStyle.loginText}>로그인</span>

    <div className={loginStyle.loginButton}>
    <button type="button"
    onClick={handleGoogleLogin}
    className={loginStyle.GoogleLogin}>
    <img src={googlelogo} alt="구글로고" className={loginStyle.googleLogo}/>
    Google 계정으로 계속</button>

    <button type="button"
    onClick={handleKaKaoLogin}
    className={loginStyle.KaKaoLogin}>
      <img src={kakaologo} alt="카카오로고" className={loginStyle.kakaoLogo}/>
      KaKao 계정으로 계속</button>
    </div>
    </div>
  );
};

export default Login;
