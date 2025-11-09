import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Splash from "./pages/Splash";
import Login from "./pages/auth/Login";

export default function App() {
  return (
 
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route index element={<Splash next="/Login" delayMs={10000000} />} />
          <Route path="login" element={<Login/>}/>
        </Route>
      </Routes>
    
  );
}
