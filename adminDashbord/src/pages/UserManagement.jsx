import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
  Users,
  Search,
  UserCheck,
  UserX,
  ShieldCheck,
  Briefcase,
  Building2,
  Headset,
  Filter,
  User,
  ShieldAlert,
  GanttChart,
  HardHat,
  Scale,
} from "lucide-react";

// Mapping internal role names to i18n keys
const roleMapping = {
  "Visitor (Visiteur)": "VISITOR",
  "Investor (Investisseur)": "INVESTOR",
  "Promoter (Promoteur individuel)": "PROMOTER",
  "Real Estate Agency (Agence)": "AGENCY",
  "KYC Verifier (Vérificateur KYC)": "KYC",
  "Auditor (Expert / Auditeur)": "AUDITOR",
  "Financial Manager (Gestionnaire Fin)": "FINANCE",
  "Platform Manager (Gest Plat)": "PLATFORM",
  "Judicial Agent (Agent Judiciaire)": "JUDICIAL",
  "Customer Support (Support)": "SUPPORT",
  "Admin": "ADMIN"
};

const statusMapping = {
  "Not Submitted": "NOT_SUBMITTED",
  "Pending": "PENDING",
  "Approved": "APPROVED",
  "Rejected": "REJECTED"
};
import API from "../api/axios";

const allowedSelfRegistrationRoles = [
  "Visitor (Visiteur)",
  "Investor (Investisseur)",
  "Promoter (Promoteur individuel)",
  "Real Estate Agency (Agence)",
];

const internalOnlyRoles = [
  "KYC Verifier (Vérificateur KYC)",
  "Auditor (Expert / Auditeur)",
  "Financial Manager (Gestionnaire Fin)",
  "Platform Manager (Gest Plat)",
  "Judicial Agent (Agent Judiciaire)",
  "Customer Support (Support)",
  "Admin"
];

const allowedStatuses = ["Not Submitted", "Pending", "Approved", "Rejected"];

function validateUser(user) {
  const errors = [];

  if (!user.id || String(user.id).trim() === "") {
    errors.push("User ID is required.");
  }

  const name = user.fullName || user.name;
  if (!name || String(name).trim().length < 3) {
    errors.push("Full Name must contain at least 3 characters.");
  }

  const allRoles = [...allowedSelfRegistrationRoles, ...internalOnlyRoles];
  if (!user.role || !allRoles.includes(user.role)) {
    errors.push("Role is invalid.");
  }

  if (!user.status || !allowedStatuses.includes(user.status)) {
    errors.push("Status must be Not Submitted, Pending, Approved, or Rejected.");
  }

  if (!user.email || !user.email.includes("@")) {
    errors.push("A valid email is required.");
  }

  if (!user.createdAt || String(user.createdAt).trim() === "") {
    errors.push("Created At is required.");
  }

  if (
    internalOnlyRoles.includes(user.role) &&
    user.accountSource === "Self Registration"
  ) {
    errors.push(
      `${user.role} accounts cannot be created by self registration.`
    );
  }

  if (
    allowedSelfRegistrationRoles.includes(user.role) &&
    !["Self Registration", "Admin Created"].includes(user.accountSource)
  ) {
    errors.push("Account source is invalid for this user.");
  }

  if (
    internalOnlyRoles.includes(user.role) &&
    user.accountSource !== "Admin Created"
  ) {
    errors.push(`${user.role} must be created by admin.`);
function getRoleIcon(role) {
  switch (role) {
    case "Visitor (Visiteur)":
    case "Investor (Investisseur)":
      return <User size={16} />;
    case "Promoter (Promoteur individuel)":
      return <HardHat size={16} />;
    case "Real Estate Agency (Agence)":
      return <Building2 size={16} />;
    case "Admin":
      return <ShieldCheck size={16} />;
    case "Judicial Agent (Agent Judiciaire)":
      return <Scale size={16} />;
    case "Customer Support (Support)":
      return <Headset size={16} />;
    case "Financial Manager (Gestionnaire Fin)":
      return <ShieldAlert size={16} />;
    case "Platform Manager (Gest Plat)":
      return <GanttChart size={16} />;
    default:
      return <Users size={16} />;
  }
}

function getStatusClasses(status) {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "Rejected":
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
}

function InfoBox({ label, value }) {
  const { t } = useTranslation();
  const isEmpty = !value || String(value).trim() === "";

  return (
    <div
      className={`rounded-2xl border p-4 rtl:text-right ${
        isEmpty ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p
        className={`mt-2 text-[15px] font-medium ${
          isEmpty ? "text-red-600" : "text-slate-900"
        }`}
      >
        {isEmpty ? t("common.missingValue") : value}
      </p>
    </div>
  );
}

function UserCard({ user }) {
  const { t } = useTranslation();
  const validation = validateUser(user);
  const localizedRole = roleMapping[user.role] ? t(`users.roles.${roleMapping[user.role]}`) : user.role;
  const localizedStatus = statusMapping[user.status] ? t(`users.statuses.${statusMapping[user.status]}`) : user.status;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm rtl:text-right">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between rtl:lg:flex-row-reverse">
        <div>
          <div className="flex flex-wrap items-center gap-3 rtl:flex-row-reverse">
            <h2 className="text-2xl font-bold text-slate-900">
              {user.fullName || user.name || "Unknown User"}
            </h2>

            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 rtl:flex-row-reverse">
              {getRoleIcon(user.role)}
              {localizedRole}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${getStatusClasses(
                user.status
              )}`}
            >
              {localizedStatus}
            </span>

            {validation.isValid ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 rtl:flex-row-reverse">
                <UserCheck size={14} />
                {t("common.valid")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 rtl:flex-row-reverse">
                <UserX size={14} />
                {t("common.incomplete")}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {t("users.reviewDesc")}
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-md">
          {t("users.reviewUser")}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoBox label={t("users.labels.userId")} value={user.id} />
        <InfoBox label={t("users.labels.fullName")} value={user.fullName || user.name} />
        <InfoBox label={t("users.labels.role")} value={localizedRole} />
        <InfoBox label={t("users.labels.status")} value={localizedStatus} />
        <InfoBox label={t("users.labels.accountSource")} value={user.accountSource} />
        <InfoBox label={t("users.labels.email")} value={user.email} />
        <InfoBox label={t("users.labels.createdAt")} value={user.createdAt} />
      </div>

      {!validation.isValid && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-bold text-red-700">{t("validation.errorHeader")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-red-600">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function UserManagement() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsersData(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const keyword = search.toLowerCase();
      const n = user.fullName || user.name || "";

      const matchesSearch =
        n.toLowerCase().includes(keyword) ||
        String(user.id || "").toLowerCase().includes(keyword) ||
        String(user.role || "").toLowerCase().includes(keyword) ||
        String(user.email || "").toLowerCase().includes(keyword);

      const matchesRole = roleFilter === "All" ? true : user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" ? true : user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const totalUsers = usersData.length;
  const validUsers = usersData.filter((user) => validateUser(user).isValid).length;
  const invalidUsers = totalUsers - validUsers;
  const pendingUsers = usersData.filter((user) => user.status === "Pending").length;
  const selfRegisteredUsers = usersData.filter(
    (user) => user.accountSource === "Self Registration"
  ).length;

  return (
    <div className="rtl:text-right">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rtl:lg:flex-row-reverse">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            {t("users.title")}
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("users.sub")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row rtl:lg:flex-row-reverse">
          <div className="relative w-full lg:w-80">
            <Search
              className="pointer-events-none absolute rtl:right-4 left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("users.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white rtl:pr-12 pr-4 pl-12 rtl:pl-4 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-400 rtl:text-right"
          >
            <option value="All">{t("users.allRoles")}</option>
            {Object.keys(roleMapping).map(role => (
              <option key={role} value={role}>{t(`users.roles.${roleMapping[role]}`)}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-400 rtl:text-right"
          >
            <option value="All">{t("users.allStatuses")}</option>
            {Object.keys(statusMapping).map(status => (
              <option key={status} value={status}>{t(`users.statuses.${statusMapping[status]}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between rtl:flex-row-reverse text-right">
            <div className="rtl:text-right">
              <p className="text-sm text-slate-500">{t("users.statsTotal")}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalUsers}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 text-white">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{t("users.statsPending")}</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">{pendingUsers}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{t("users.statsValid")}</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{validUsers}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{t("users.statsInvalid")}</p>
          <p className="mt-3 text-3xl font-bold text-red-600">{invalidUsers}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{t("users.statsSelfReg")}</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {selfRegisteredUsers}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm rtl:text-right">
        <div className="flex items-center gap-3 rtl:flex-row-reverse">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
            <Filter size={22} />
          </div>
          <div className="rtl:text-right">
            <h2 className="text-xl font-bold text-slate-900">{t("users.rulesTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("users.rulesSub")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 rtl:text-right">
            <h3 className="text-sm font-bold text-emerald-700">
              {t("users.rulesSelfReg")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-600">
              {allowedSelfRegistrationRoles.map((role) => (
                <li key={role}>• {roleMapping[role] ? t(`users.roles.${roleMapping[role]}`) : role}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 rtl:text-right">
            <h3 className="text-sm font-bold text-red-700">
              {t("users.rulesAdminOnly")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-red-600">
              {internalOnlyRoles.map((role) => (
                <li key={role}>• {roleMapping[role] ? t(`users.roles.${roleMapping[role]}`) : role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 rtl:flex-row-reverse">
          {allowedStatuses.map((status) => (
            <div
              key={status}
              className={`rounded-2xl px-4 py-5 text-center text-sm font-bold border ${getStatusClasses(
                status
              )}`}
            >
              {statusMapping[status] ? t(`users.statuses.${statusMapping[status]}`) : status}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">{t("users.loadingUsers")}</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id || user.email || user.fullName} user={user} />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">{t("users.noUsers")}</p>
          </div>
        )}
      </div>
    </div>
  );
}