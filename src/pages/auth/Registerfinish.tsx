import check from "../../assets/auth/Check.svg"
import registerStyle from "../../css/pages/register.module.css";
import stageonlogo from "../../assets/StageonLogo.svg";
import { Link } from "react-router-dom";

const Registerfinish = () => {
  return (
    <div className={registerStyle.registerfinishcontainer}>
    <img src={check} className={registerStyle.check} /> 
    <span className={registerStyle.finishText1}>회원가입이 완료되었습니다</span>
    <div className={registerStyle.finishText2}>
        <img src={stageonlogo} className={registerStyle.finishlogo} />
        <span>와 공연전의 설렘을 함께 하세요!</span>
    </div>
    <Link className={registerStyle.registercomplete} to="/main/home">완료</Link>
    </div>
  )
}

export default Registerfinish