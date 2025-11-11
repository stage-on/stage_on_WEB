import { Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";
import Search from "./pages/Search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route path="search" element={<Search/>}/>
      </Route>
    </Routes>
  );
}

export default App;
