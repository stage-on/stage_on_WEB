import { Routes, Route } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import Login from "./pages/auth/Login";
import Search from "./pages/Search";
import Register from "./pages/auth/Register";
import HomeLayout from "./layout/HomeLayout";
import Registerfinish from "./pages/auth/Registerfinish";
import MyBands from "./pages/MyBands";
import Home from "./pages/Home";



export default function App() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route index element={<Splash next="/Login" delayMs={3000} />} />
        <Route path="login" element={<Login />} />
        <Route path="main" element={<HomeLayout />}>
          <Route path="mybands" element={<MyBands />} />
           <Route path="home" element={<Home />} />
        </Route>
        <Route path="search" element={<Search />} />
        <Route path="register" element={<Register/>}/>
         <Route path="registerfinish" element={<Registerfinish/>}/>
         
      </Route>
    </Routes>

  );
}
