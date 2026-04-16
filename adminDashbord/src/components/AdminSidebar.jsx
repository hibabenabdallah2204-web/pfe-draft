import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  CheckCircle2,
  Activity,
  LogOut,
  Users,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

function SidebarCard({ item }) {
  const Icon = item.icon;
  const { t } = useTranslation();

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `block w-full rounded-2xl border p-4 transition-all duration-200 ${
          isActive
            ? "border-indigo-300/60 bg-white/12 shadow-lg shadow-fuchsia-500/10"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`
      }
    >
      {({ isActive }) => (
        <div className="flex items-start gap-4 rtl:flex-row-reverse rtl:text-right">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
              isActive
                ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            <Icon size={24} />
          </div>

          <div className="rtl:text-right">
            <h3 className="text-[16px] font-bold text-white">{t(item.labelKey)}</h3>
            <p className="mt-1 text-[13px] leading-6 text-white/75">
              {t(item.descKey)}
            </p>
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default function AdminSidebar() {
  const { t } = useTranslation();

  const menuItems = [
    {
      to: "/admin/project-validation",
      labelKey: "sidebar.projectValidation",
      descKey: "sidebar.projectValidationDesc",
      icon: CheckCircle2,
    },
    {
      to: "/admin/platform-monitoring",
      labelKey: "sidebar.monitoring",
      descKey: "sidebar.monitoringDesc",
      icon: Activity,
    },
    {
      to: "/admin/user-management",
      labelKey: "sidebar.users",
      descKey: "sidebar.usersDesc",
      icon: Users,
    },
    {
      to: "/admin/audit-logs",
      labelKey: "sidebar.auditLogs",
      descKey: "sidebar.auditLogsDesc",
      icon: ShieldCheck,
    },
    {
      to: "/admin/logout",
      labelKey: "sidebar.logout",
      descKey: "sidebar.logoutDesc",
      icon: LogOut,
    },
  ];

  return (
    <aside className="w-full bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-900 px-5 py-6 lg:min-h-screen lg:w-[380px] lg:px-6 lg:py-8 rtl:text-right">
      <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm rtl:text-right">
        <div className="flex-1 rtl:text-right">
          <div className="inline-flex rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 rtl:flex-row-reverse">
            {t("sidebar.admin")}
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white rtl:text-right">
            {t("dashboards.adminTitle")}
          </h1>

          <p className="mt-4 text-[17px] leading-8 text-white/80 rtl:text-right">
            {t("dashboards.adminSub")}
          </p>

          <div className="mt-10 space-y-5">
             {menuItems.map((item) => (
                <SidebarCard key={item.to} item={item} />
             ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
           <LanguageSwitcher isDark={true} />
        </div>
      </div>
    </aside>
  );
}
