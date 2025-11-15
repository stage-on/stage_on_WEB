import { Outlet } from "react-router-dom";
import "../css/style.css";

export default function GlobalLayout() {
  return (
    <div className="layoutContainer">
      <Outlet />
    </div>
  );
}
