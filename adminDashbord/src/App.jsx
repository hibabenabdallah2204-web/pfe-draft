import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import PromoterLayout from "./layouts/PromoterLayout";
import InvestorLayout from "./layouts/InvestorLayout";

import ProjectValidation from "./pages/ProjectValidation";
import DisputeManagement from "./pages/DisputeManagement";
import PlatformMonitoring from "./pages/PlatformMonitoring";
import UserManagement from "./pages/UserManagement";
import AdminTransactions from "./pages/AdminTransactions";
import AdminFinancials from "./pages/AdminFinancials";
import AuditLogs from "./pages/AuditLogs";
import LogoutPage from "./pages/LogoutPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ChatbotWidget from "./components/ChatbotWidget";

// Import Promoter Pages
import PromoterDashboard from "./pages/promoter/PromoterDashboard";
import SubmitProject from "./pages/promoter/SubmitProject";

// Import Investor Pages
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import ProjectDetails from "./pages/investor/ProjectDetails"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/project-validation" replace />}
        />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetails />} />

        {/* --- Admin Module --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="project-validation" replace />} />
          <Route path="project-validation" element={<ProjectValidation />} />
          <Route path="dispute-management" element={<DisputeManagement />} />
          <Route path="platform-monitoring" element={<PlatformMonitoring />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="financials" element={<AdminFinancials />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="logout" element={<LogoutPage />} />
        </Route>

        {/* --- Promoter Module --- */}
        <Route path="/promoter" element={<PromoterLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PromoterDashboard />} />
          <Route path="submit-project" element={<SubmitProject />} />
        </Route>

        {/* --- Investor Module --- */}
        <Route path="/investor" element={<InvestorLayout />}>
          <Route index element={<Navigate to="portfolio" replace />} />
          <Route path="portfolio" element={<InvestorDashboard />} />
        </Route>

      </Routes>
      <ChatbotWidget />
    </BrowserRouter>
  );
}

export default App;