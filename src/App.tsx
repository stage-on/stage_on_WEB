import {Routes, Route } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import Login from "./pages/auth/Login";

export default function App() {
  return (
 
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route index element={<Splash next="/Login" delayMs={3000} />} /> {/*나중에 3초로 조정*/}
          <Route path="login" element={<Login/>}/>
        </Route>
      </Routes>
    
  );
}
