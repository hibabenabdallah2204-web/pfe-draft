import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Search,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FolderSearch,
  MonitorSmartphone,
  BarChart3,
  Building2,
  Briefcase,
  MapPin,
} from "lucide-react";
import API from "../api/axios";

const allowedStatuses = ["Not Submitted", "Pending", "Approved", "Rejected"];
const allowedAssetTypes = [
  "Building",
  "House",
  "Bare Land",
  "Agricultural Land",
];
const allowedOwnerRoles = [
  "Real Estate Developer",
  "Real Estate Agent / Agency",
];

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

function getStatusKey(status) {
  const s = status?.toUpperCase().replace(" ", "_");
  if (["APPROVED", "PUBLISHED", "FUNDING_OPEN"].includes(s)) return s;
  if (["SUBMITTED", "KYC_PENDING", "UNDER_REVIEW"].includes(s)) return s;
  if (s === "PENDING" || s === "REJECTED") return s;
  if (s === "NOT_SUBMITTED") return s;
  return "DRAFT";
}

function getOwnerRoleIcon(role) {
  switch (role) {
    case "Real Estate Developer":
      return <Briefcase size={14} />;
    case "Real Estate Agent / Agency":
      return <Building2 size={14} />;
    default:
      return <MapPin size={14} />;
  }
}

function isDeletable(status) {
  return status !== "Approved";
}

function validateAsset(asset, t) {
  const errors = [];

  if (!asset.id || asset.id.trim() === "") {
    errors.push(t("monitoring.errors.idReq"));
  }

  if (!asset.title || asset.title.trim().length < 3) {
    errors.push(t("monitoring.errors.titleMin"));
  }

  if (!asset.location || asset.location.trim().length < 2) {
    errors.push(t("monitoring.errors.locationReq"));
  }

  if (!asset.assetType || !allowedAssetTypes.includes(asset.assetType)) {
    errors.push(t("monitoring.errors.typeInvalid"));
  }

  if (!asset.status || !allowedStatuses.includes(asset.status)) {
    errors.push(t("monitoring.errors.statusInvalid"));
  }

  if (!asset.createdAt || asset.createdAt.trim() === "") {
    errors.push(t("monitoring.errors.dateReq"));
  }

  if (
    !asset.submittedByRole ||
    !allowedOwnerRoles.includes(asset.submittedByRole)
  ) {
    errors.push(t("monitoring.errors.roleInvalid"));
  }

  if (!asset.ownerName || asset.ownerName.trim().length < 2) {
    errors.push(t("monitoring.errors.ownerReq"));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function InfoBox({ label, value }) {
  const { t } = useTranslation();
  const isEmpty = !value && value !== 0;

  return (
    <div
      className={`rounded-2xl border p-4 ${isEmpty ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
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

function AssetPlatformCard({ asset, onDelete }) {
  const { t } = useTranslation();
  const validation = validateAsset(asset, t);
  const deletable = isDeletable(asset.status);
  const statusKey = getStatusKey(asset.status);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 rtl:text-right">{asset.title}</h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                asset.status
              )}`}
            >
              {t(`common.states.${statusKey}`)}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {getOwnerRoleIcon(asset.submittedByRole)}
              {asset.submittedByRole}
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

            {deletable ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                <Trash2 size={14} />
                {t("monitoring.actions.deletable")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <ShieldCheck size={14} />
                {t("monitoring.actions.protected")}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500 rtl:text-right">
            {t("monitoring.sub")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 rtl:flex-row-reverse">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600">
            {t("monitoring.actions.viewDetails")}
          </button>

          <button
            onClick={() => deletable && onDelete(asset.id)}
            disabled={!deletable}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md ${deletable
              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
              : "cursor-not-allowed bg-slate-300"
              }`}
          >
            {t("monitoring.actions.deleteListing")}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBox label={t("monitoring.labels.assetId")} value={asset.id} />
        <InfoBox label={t("monitoring.labels.location")} value={asset.location} />
        <InfoBox label={t("monitoring.labels.assetType")} value={asset.assetType} />
        <InfoBox label={t("monitoring.labels.createdAt")} value={asset.createdAt} />
        <InfoBox label={t("monitoring.labels.views")} value={asset.views} />
        <InfoBox label={t("monitoring.labels.reports")} value={asset.reports} />
        <InfoBox label={t("monitoring.labels.ownerName")} value={asset.ownerName} />
        <InfoBox label={t("monitoring.labels.submittedBy")} value={asset.submittedByRole} />
        <InfoBox label={t("monitoring.labels.status")} value={t(`common.states.${statusKey}`)} />
        <InfoBox
          label={t("monitoring.labels.adminRule")}
          value={deletable ? t("monitoring.rules.canDelete") : t("monitoring.rules.noDelete")}
        />
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

export default function PlatformMonitoring() {
  const { t } = useTranslation();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get("/assets");
        setAssets(res.data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  async function handleDeleteAsset(assetId) {
    try {
      await API.delete(`/assets/${assetId}`);
      setAssets((prev) =>
        prev.filter((asset) => {
          if (asset.id !== assetId) return true;
          return asset.status === "Approved";
        })
      );
    } catch (error) {
      console.error("Failed to delete asset", error);
    }
  }

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        asset.title?.toLowerCase().includes(keyword) ||
        asset.id?.toLowerCase().includes(keyword) ||
        asset.location?.toLowerCase().includes(keyword) ||
        asset.assetType?.toLowerCase().includes(keyword) ||
        asset.ownerName?.toLowerCase().includes(keyword) ||
        asset.submittedByRole?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ? true : asset.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  const totalAssets = assets.length;
  const approvedAssets = assets.filter(
    (asset) => asset.status === "Approved"
  ).length;
  const nonApprovedAssets = assets.filter(
    (asset) => asset.status !== "Approved"
  ).length;
  const deletableAssets = assets.filter((asset) =>
    isDeletable(asset.status)
  ).length;
  const reportedAssets = assets.filter((asset) => asset.reports > 0).length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rtl:text-right">
          <h1 className="text-4xl font-bold text-slate-900">
            {t("monitoring.title")}
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("monitoring.sub")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row rtl:flex-row-reverse">
          <div className="relative w-full lg:w-80">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("monitoring.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All">{t("monitoring.allStats")}</option>
            <option value="Not Submitted">{t("common.states.NOT_SUBMITTED")}</option>
            <option value="Pending">{t("common.states.PENDING")}</option>
            <option value="Approved">{t("common.states.APPROVED")}</option>
            <option value="Rejected">{t("common.states.REJECTED")}</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rtl:text-right">
              <p className="text-sm text-slate-500">{t("monitoring.statsTotal")}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalAssets}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 text-white">
              <Activity size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm rtl:text-right">
          <p className="text-sm text-slate-500">{t("monitoring.statsApproved")}</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{approvedAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm rtl:text-right">
          <p className="text-sm text-slate-500">{t("monitoring.statsNonApproved")}</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">{nonApprovedAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm rtl:text-right">
          <p className="text-sm text-slate-500">{t("monitoring.statsDeletable")}</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">{deletableAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm rtl:text-right">
          <p className="text-sm text-slate-500">{t("monitoring.statsReported")}</p>
          <p className="mt-3 text-3xl font-bold text-red-600">{reportedAssets}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 rtl:flex-row-reverse">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
            <MonitorSmartphone size={22} />
          </div>
          <div className="rtl:text-right">
            <h2 className="text-xl font-bold text-slate-900">{t("monitoring.rulesTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("monitoring.rulesSub")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 rtl:text-right">
            <h3 className="text-sm font-bold text-emerald-700">{t("monitoring.protectedTitle")}</h3>
            <p className="mt-2 text-sm text-emerald-600">
              {t("monitoring.protectedDesc")}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 rtl:text-right">
            <h3 className="text-sm font-bold text-amber-700">{t("monitoring.reviewReqTitle")}</h3>
            <p className="mt-2 text-sm text-amber-600">
              {t("monitoring.reviewReqDesc")}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 rtl:text-right">
            <h3 className="text-sm font-bold text-red-700">{t("monitoring.deletableTitle")}</h3>
            <p className="mt-2 text-sm text-red-600">
              {t("monitoring.deletableDesc")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5 rtl:text-right">
            <div className="flex items-center gap-2 text-slate-700 rtl:flex-row-reverse">
              <Eye size={18} />
              <h3 className="text-sm font-bold">{t("monitoring.visibilityTitle")}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {t("monitoring.visibilityDesc")}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 rtl:text-right">
            <div className="flex items-center gap-2 text-slate-700 rtl:flex-row-reverse">
              <AlertTriangle size={18} />
              <h3 className="text-sm font-bold">{t("monitoring.reportsTitle")}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {t("monitoring.reportsDesc")}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 rtl:text-right">
            <div className="flex items-center gap-2 text-slate-700 rtl:flex-row-reverse">
              <BarChart3 size={18} />
              <h3 className="text-sm font-bold">{t("monitoring.metricsTitle")}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {t("monitoring.metricsDesc")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm text-slate-500">
             {t("monitoring.status.loading")}
          </div>
        ) : filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <AssetPlatformCard
              key={asset.id}
              asset={asset}
              onDelete={handleDeleteAsset}
            />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <FolderSearch className="mx-auto text-slate-400" size={28} />
            <p className="mt-3 text-slate-500">{t("monitoring.status.noAssets")}</p>
          </div>
        )}
      </div>
    </div>
  );
}