import { Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Search from "./pages/Search";
import HomeLayout from "./layout/HomeLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route path="main" element={<HomeLayout />}></Route>
        <Route path="search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default App;
