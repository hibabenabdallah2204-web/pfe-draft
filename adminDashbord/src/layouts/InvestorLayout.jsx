import { Outlet, Navigate, useLocation } from "react-router-dom";
import InvestorSidebar from "../components/InvestorSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function InvestorLayout() {
  const location = useLocation();

  if (location.pathname === "/investor" || location.pathname === "/investor/") {
    return <Navigate to="/investor/portfolio" replace />;
  }

  return (
    <div className="min-h-screen bg-[#ececf2]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <InvestorSidebar />
        <main className="flex-1 bg-[#f7f7fb] p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


