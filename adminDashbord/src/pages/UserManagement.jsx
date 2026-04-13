import { useMemo, useState, useEffect } from "react";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Clock3,
  ShieldCheck,
  Briefcase,
  Building2,
  BadgeDollarSign,
  Headset,
  Filter,
} from "lucide-react";
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
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function getStatusClasses(status) {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-600";
    case "Pending":
      return "bg-amber-50 text-amber-600";
    case "Rejected":
      return "bg-red-50 text-red-600";
    case "Not Submitted":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function getRoleIcon(role) {
  switch (role) {
    case "Investor":
      return <BadgeDollarSign size={18} />;
    case "Promoter":
      return <Briefcase size={18} />;
    case "Real Estate Agent":
      return <Building2 size={18} />;
    case "Customer Support":
      return <Headset size={18} />;
    case "Financial Manager":
      return <ShieldCheck size={18} />;
    default:
      return <Users size={18} />;
  }
}

function InfoBox({ label, value }) {
  const isEmpty = !value || String(value).trim() === "";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isEmpty ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p
        className={`mt-2 text-[15px] font-medium ${
          isEmpty ? "text-red-600" : "text-slate-900"
        }`}
      >
        {isEmpty ? "Missing value" : value}
      </p>
    </div>
  );
}

function UserCard({ user }) {
  const validation = validateUser(user);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {user.fullName || user.name || "Unknown User"}
            </h2>

            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {getRoleIcon(user.role)}
              {user.role || "Unknown Role"}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                user.status
              )}`}
            >
              {user.status || "Unknown Status"}
            </span>

            {validation.isValid ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <UserCheck size={14} />
                Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                <UserX size={14} />
                Invalid
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Verify role eligibility, account source, and account status before approval.
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-md">
          Review User
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoBox label="User ID" value={user.id} />
        <InfoBox label="Full Name" value={user.fullName || user.name} />
        <InfoBox label="Role" value={user.role} />
        <InfoBox label="Status" value={user.status} />
        <InfoBox label="Account Source" value={user.accountSource} />
        <InfoBox label="Email" value={user.email} />
        <InfoBox label="Created At" value={user.createdAt} />
      </div>

      {!validation.isValid && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-bold text-red-700">Validation Errors</h3>
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
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            User Management Dashboard
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Manage platform users, verify registration rules, and control user approval workflow.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
          <div className="relative w-full lg:w-80">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All">All Roles</option>
            <option value="Visitor (Visiteur)">Visitor</option>
            <option value="Investor (Investisseur)">Investor</option>
            <option value="Promoter (Promoteur individuel)">Promoter</option>
            <option value="Real Estate Agency (Agence)">Agency</option>
            <option value="KYC Verifier (Vérificateur KYC)">KYC Verifier</option>
            <option value="Auditor (Expert / Auditeur)">Auditor</option>
            <option value="Financial Manager (Gestionnaire Fin)">Financial Manager</option>
            <option value="Platform Manager (Gest Plat)">Platform Manager</option>
            <option value="Judicial Agent (Agent Judiciaire)">Judicial Agent</option>
            <option value="Customer Support (Support)">Customer Support</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All">All Statuses</option>
            <option value="Not Submitted">Not Submitted</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalUsers}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 text-white">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending Users</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">{pendingUsers}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Valid Users</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{validUsers}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Invalid Users</p>
          <p className="mt-3 text-3xl font-bold text-red-600">{invalidUsers}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Self Registered</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {selfRegisteredUsers}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
            <Filter size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registration Rules</h2>
            <p className="mt-1 text-sm text-slate-500">
              Only Investor, Promoter, and Real Estate Agent can create an account on the platform.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="text-sm font-bold text-emerald-700">
              Self Registration Allowed
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-600">
              {allowedSelfRegistrationRoles.map((role) => (
                <li key={role}>• {role}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="text-sm font-bold text-red-700">
              Admin Creation Only
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-red-600">
              {internalOnlyRoles.map((role) => (
                <li key={role}>• {role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {allowedStatuses.map((status) => (
            <div
              key={status}
              className={`rounded-2xl px-4 py-5 text-center text-sm font-semibold ${getStatusClasses(
                status
              )}`}
            >
              {status}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Loading users...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id || user.email || user.fullName} user={user} />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}