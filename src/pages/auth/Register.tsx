import registerStyle from "../../css/pages/register.module.css";
import vector from "../../assets/auth/Vector.svg"
const Register = () => {
  return (
    <div className={registerStyle.registerHeader}>
        <img src={vector} className={registerStyle.registerVector}/>
        <span className={registerStyle.registerText}>회원가입</span>
    </div>
  )
}

export default Register