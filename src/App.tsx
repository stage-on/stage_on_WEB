import { Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/GlobalLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}></Route>
    </Routes>
  );
}

export default App;
