import { Outlet, useNavigate } from "react-router-dom";
import TopBar from '../components/toolbar';

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <TopBar />
      <main className="content">
        <Outlet />
      </main>

    </div>
  );
}