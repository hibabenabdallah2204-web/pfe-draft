import { NavLink } from "react-router-dom";
import {
  ShieldAlert,
  LogOut,
  Scale,
} from "lucide-react";

const menuItems = [
  {
    to: "/judicial/disputes",
    label: "Dispute Management",
    description: "Handle active platform disputes",
    icon: ShieldAlert,
  },
  {
    to: "/auth",
    label: "Log Out",
    description: "Securely end your session",
    icon: LogOut,
  },
];

function SidebarCard({ item }) {
  const Icon = item.icon;

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
        <div className="flex items-start gap-3">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
              isActive
                ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            <Icon size={24} />
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-white">{item.label}</h3>
            <p className="mt-1 text-[13px] leading-6 text-white/75">
              {item.description}
            </p>
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default function JudicialSidebar() {
  return (
    <aside className="w-full bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-900 px-5 py-6 lg:min-h-screen lg:w-[380px] lg:px-6 lg:py-8">
      <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
            <Scale size={16} />
            Judicial Panel
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
            Judicial Dashboard
          </h1>

          <p className="mt-4 text-[17px] leading-8 text-white/80">
            Review and resolve platform disputes, manage legal interventions, and enforce compliance.
          </p>
        </div>

        <div className="mt-10 space-y-5">
          {menuItems.map((item) => (
            <SidebarCard key={item.to} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
}
