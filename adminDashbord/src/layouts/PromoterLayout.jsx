import { Outlet, Navigate, useLocation } from "react-router-dom";
import PromoterSidebar from "../components/PromoterSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function PromoterLayout() {
  const location = useLocation();

  if (location.pathname === "/promoter" || location.pathname === "/promoter/") {
    return <Navigate to="/promoter/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#ececf2]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <PromoterSidebar />
        <main className="flex-1 bg-[#f7f7fb] p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


