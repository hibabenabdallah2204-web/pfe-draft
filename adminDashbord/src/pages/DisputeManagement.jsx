import { useMemo, useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  CheckCircle2,
  FolderSearch,
  Scale,
} from "lucide-react";
import API from "../api/axios";

const allowedStatuses = ["Open", "Under Review", "Resolved", "Closed"];
const allowedRoles = [
  "Normal User",
  "Real Estate Developer",
  "Real Estate Agent / Agency",
  "Admin",
];
const allowedAssetTypes = [
  "House",
  "Building",
  "Bare Land",
  "Agricultural Land",
  "Unknown",
];

function validateDispute(dispute) {
  const errors = [];

  if (!dispute.id || dispute.id.trim() === "") {
    errors.push("Dispute ID is required.");
  }

  if (!dispute.reason || dispute.reason.trim().length < 10) {
    errors.push("Reason must contain at least 10 characters.");
  }

  if (!dispute.status || !allowedStatuses.includes(dispute.status)) {
    errors.push("Status must be Open, Under Review, Resolved, or Closed.");
  }

  if (!dispute.createdAt || dispute.createdAt.trim() === "") {
    errors.push("Created At is required.");
  }

  if (!dispute.raisedByRole || !allowedRoles.includes(dispute.raisedByRole)) {
    errors.push("Raised By Role is invalid or missing.");
  }

  if (!dispute.againstRole || !allowedRoles.includes(dispute.againstRole)) {
    errors.push("Against Role is invalid or missing.");
  }

  if (!dispute.assetType || !allowedAssetTypes.includes(dispute.assetType)) {
    errors.push("Asset Type is invalid or missing.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function getStatusClasses(status) {
  switch (status) {
    case "Open":
      return "bg-red-50 text-red-600";
    case "Under Review":
      return "bg-amber-50 text-amber-600";
    case "Resolved":
      return "bg-emerald-50 text-emerald-600";
    case "Closed":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function InfoBox({ label, value }) {
  const isEmpty = !value || String(value).trim() === "";

  return (
    <div
      className={`rounded-2xl border p-4 ${isEmpty
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-slate-50"
        }`}
    >
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p
        className={`mt-2 text-[15px] font-medium ${isEmpty ? "text-red-600" : "text-slate-900"
          }`}
      >
        {isEmpty ? "Missing value" : value}
      </p>
    </div>
  );
}

function DisputeCard({ dispute }) {
  const validation = validateDispute(dispute);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {dispute.id || "Unknown Dispute"}
            </h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                dispute.status
              )}`}
            >
              {dispute.status || "Unknown Status"}
            </span>

            {validation.isValid ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} />
                Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                <AlertTriangle size={14} />
                Incomplete
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Review dispute details, involved roles, and related asset information.
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-md">
          Review Case
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBox label="Dispute ID" value={dispute.id} />
        <InfoBox label="Status" value={dispute.status} />
        <InfoBox label="Created At" value={dispute.createdAt} />
        <InfoBox label="Asset Type" value={dispute.assetType} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoBox label="Raised By" value={dispute.raisedByRole} />
        <InfoBox label="Against" value={dispute.againstRole} />
      </div>

      <div className="mt-4">
        <InfoBox label="Reason" value={dispute.reason} />
      </div>

      {!validation.isValid && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-red-700">
            <AlertTriangle size={16} />
            Validation Errors
          </h3>

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

export default function DisputeManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [disputes, setDisputes] = useState([]);

  // ✅ AXIOS FETCH
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await API.get("/disputes");
        setDisputes(res.data);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };

    fetchDisputes();
  }, []);

  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        dispute.id?.toLowerCase().includes(keyword) ||
        dispute.reason?.toLowerCase().includes(keyword) ||
        dispute.status?.toLowerCase().includes(keyword) ||
        dispute.raisedByRole?.toLowerCase().includes(keyword) ||
        dispute.againstRole?.toLowerCase().includes(keyword) ||
        dispute.assetType?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ? true : dispute.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, disputes]);

  const totalDisputes = disputes.length;
  const validDisputes = disputes.filter(
    (d) => validateDispute(d).isValid
  ).length;
  const invalidDisputes = totalDisputes - validDisputes;
  const openDisputes = disputes.filter(
    (d) => d.status === "Open" || d.status === "Under Review"
  ).length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Dispute Management Dashboard
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Manage dispute cases, verify involved roles, and track dispute status.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search dispute..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border px-4"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border px-4"
          >
            <option value="All">All</option>
            {allowedStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {filteredDisputes.map((dispute) => (
          <DisputeCard key={dispute.id} dispute={dispute} />
        ))}
      </div>
    </div>
  );
}