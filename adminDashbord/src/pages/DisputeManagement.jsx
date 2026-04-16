import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

function getStatusKey(status) {
  const s = status?.toUpperCase().replace(" ", "_");
  if (s === "OPEN") return "PENDING";
  if (s === "UNDER_REVIEW") return "UNDER_REVIEW";
  if (s === "RESOLVED") return "APPROVED";
  if (s === "CLOSED") return "COMPLETED";
  return "DRAFT";
}

function validateDispute(dispute, t) {
  const errors = [];

  if (!dispute.id || dispute.id.trim() === "") {
    errors.push(t("dispute.errors.idReq"));
  }

  if (!dispute.reason || dispute.reason.trim().length < 10) {
    errors.push(t("dispute.errors.reasonMin"));
  }

  if (!dispute.status || !allowedStatuses.includes(dispute.status)) {
    errors.push(t("dispute.errors.statusInvalid"));
  }

  if (!dispute.createdAt || dispute.createdAt.trim() === "") {
    errors.push(t("dispute.errors.dateReq"));
  }

  if (!dispute.raisedByRole || !allowedRoles.includes(dispute.raisedByRole)) {
    errors.push(t("dispute.errors.roleInvalid"));
  }

  if (!dispute.againstRole || !allowedRoles.includes(dispute.againstRole)) {
    errors.push(t("dispute.errors.roleInvalid"));
  }

  if (!dispute.assetType || !allowedAssetTypes.includes(dispute.assetType)) {
    errors.push(t("dispute.errors.assetInvalid"));
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
  const { t } = useTranslation();
  const isEmpty = !value || String(value).trim() === "";

  return (
    <div
      className={`rounded-2xl border p-4 ${isEmpty
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-slate-50"
        }`}
    >
      <p className="text-sm font-semibold text-slate-500 rtl:text-right">{label}</p>
      <p
        className={`mt-2 text-[15px] font-medium ${isEmpty ? "text-red-600" : "text-slate-900"
          } rtl:text-right`}
      >
        {isEmpty ? t("common.missingValue") : value}
      </p>
    </div>
  );
}

function DisputeCard({ dispute }) {
  const { t } = useTranslation();
  const validation = validateDispute(dispute, t);
  const statusKey = getStatusKey(dispute.status);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="rtl:text-right">
          <div className="flex flex-wrap items-center gap-3 rtl:flex-row-reverse">
            <h2 className="text-2xl font-bold text-slate-900">
              {dispute.id || t("common.states.Unknown Status")}
            </h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                dispute.status
              )}`}
            >
              {t(`common.states.${statusKey}`)}
            </span>

            {validation.isValid ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} />
                {t("common.valid")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                <AlertTriangle size={14} />
                {t("common.incomplete")}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {t("dispute.reviewDesc")}
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-md">
          {t("dispute.reviewCase")}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBox label={t("dispute.labels.id")} value={dispute.id} />
        <InfoBox label={t("dispute.labels.status")} value={t(`common.states.${statusKey}`)} />
        <InfoBox label={t("dispute.labels.createdAt")} value={dispute.createdAt} />
        <InfoBox label={t("dispute.labels.assetType")} value={dispute.assetType} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoBox label={t("dispute.labels.raisedBy")} value={dispute.raisedByRole} />
        <InfoBox label={t("dispute.labels.against")} value={dispute.againstRole} />
      </div>

      <div className="mt-4">
        <InfoBox label={t("dispute.labels.reason")} value={dispute.reason} />
      </div>

      {!validation.isValid && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-red-700 rtl:flex-row-reverse">
            <AlertTriangle size={16} />
            {t("validation.errorHeader")}
          </h3>

          <ul className="mt-3 space-y-2 text-sm text-red-600 rtl:text-right">
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
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [disputes, setDisputes] = useState([]);

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
        dispute.assetType?.toLowerCase().includes(keyword) ||
        String(dispute.id || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ? true : dispute.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, disputes]);

  const totalDisputes = disputes.length;
  const validDisputes = disputes.filter(
    (d) => validateDispute(d, t).isValid
  ).length;
  const invalidDisputes = totalDisputes - validDisputes;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rtl:text-right">
          <h1 className="text-4xl font-bold text-slate-900">
            {t("dispute.title")}
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("dispute.sub")}
          </p>
        </div>

        <div className="flex gap-3 rtl:flex-row-reverse">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t("dispute.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 rtl:pr-10 rtl:pl-4"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
          >
            <option value="All">{t("common.states.All")}</option>
            <option value="Open">{t("common.states.PENDING")}</option>
            <option value="Under Review">{t("common.states.UNDER_REVIEW")}</option>
            <option value="Resolved">{t("common.states.APPROVED")}</option>
            <option value="Closed">{t("common.states.COMPLETED")}</option>
          </select>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {filteredDisputes.length > 0 ? (
          filteredDisputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
             <Scale className="mx-auto text-slate-400" size={28} />
             <p className="mt-3 text-slate-500">{t("common.noRecords")}</p>
          </div>
        )}
      </div>
    </div>
  );
}