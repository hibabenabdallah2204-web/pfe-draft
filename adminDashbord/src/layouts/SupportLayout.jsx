import { Outlet, Navigate, useLocation } from "react-router-dom";
import SupportSidebar from "../components/SupportSidebar";

export default function SupportLayout() {
  const location = useLocation();

  if (location.pathname === "/support" || location.pathname === "/support/") {
    return <Navigate to="/support/user-management" replace />;
  }

  return (
    <div className="min-h-screen bg-[#ececf2]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <SupportSidebar />
        <main className="flex-1 bg-[#f7f7fb] p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
