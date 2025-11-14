import { Routes, Route } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import Login from "./pages/auth/Login";
import Search from "./pages/Search";
import HomeLayout from "./layout/HomeLayout";
import TimetableMainPage from "./pages/timetable/TimetableMainPage";
import TimetableDetailPage from "./pages/timetable/TimetableDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route index element={<Splash next="/Login" delayMs={3000} />} />
        {/*나중에 3초로 조정*/}
        <Route path="login" element={<Login />} />
        <Route path="main" element={<HomeLayout />}></Route>
        <Route path="search" element={<Search />} />
         <Route path="timetable">
          <Route index element={<TimetableMainPage />} />     
          <Route path=":id" element={<TimetableDetailPage />} /> 
        </Route>
      </Route>
    </Routes>
  );
}
