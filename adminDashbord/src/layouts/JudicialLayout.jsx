import { Outlet, Navigate, useLocation } from "react-router-dom";
import JudicialSidebar from "../components/JudicialSidebar";

export default function JudicialLayout() {
  const location = useLocation();

  if (location.pathname === "/judicial" || location.pathname === "/judicial/") {
    return <Navigate to="/judicial/disputes" replace />;
  }

  return (
    <div className="min-h-screen bg-[#ececf2]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <JudicialSidebar />
        <main className="flex-1 bg-[#f7f7fb] p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
