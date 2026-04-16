import { Outlet, Navigate, useLocation } from "react-router-dom";
import FinanceSidebar from "../components/FinanceSidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function FinanceLayout() {
  const location = useLocation();

  if (location.pathname === "/finance" || location.pathname === "/finance/") {
    return <Navigate to="/finance/transactions" replace />;
  }

  return (
    <div className="min-h-screen bg-[#ececf2]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <FinanceSidebar />
        <main className="flex-1 bg-[#f7f7fb] p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


