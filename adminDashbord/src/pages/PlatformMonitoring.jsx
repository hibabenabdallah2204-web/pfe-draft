import { useMemo, useState, useEffect } from "react";
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

function validateAsset(asset) {
  const errors = [];

  if (!asset.id || asset.id.trim() === "") {
    errors.push("Asset ID is required.");
  }

  if (!asset.title || asset.title.trim().length < 3) {
    errors.push("Asset title must contain at least 3 characters.");
  }

  if (!asset.location || asset.location.trim().length < 2) {
    errors.push("Asset location is required.");
  }

  if (!asset.assetType || !allowedAssetTypes.includes(asset.assetType)) {
    errors.push("Asset type is invalid.");
  }

  if (!asset.status || !allowedStatuses.includes(asset.status)) {
    errors.push("Asset status is invalid.");
  }

  if (!asset.createdAt || asset.createdAt.trim() === "") {
    errors.push("Created At is required.");
  }

  if (
    !asset.submittedByRole ||
    !allowedOwnerRoles.includes(asset.submittedByRole)
  ) {
    errors.push("Submitted By Role is invalid.");
  }

  if (!asset.ownerName || asset.ownerName.trim().length < 2) {
    errors.push("Owner name is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function InfoBox({ label, value }) {
  const isEmpty = !value && value !== 0;

  return (
    <div
      className={`rounded-2xl border p-4 ${isEmpty ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
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

function AssetPlatformCard({ asset, onDelete }) {
  const validation = validateAsset(asset);
  const deletable = isDeletable(asset.status);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">{asset.title}</h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                asset.status
              )}`}
            >
              {asset.status}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {getOwnerRoleIcon(asset.submittedByRole)}
              {asset.submittedByRole}
            </span>

            {validation.isValid ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} />
                Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                <AlertTriangle size={14} />
                Invalid
              </span>
            )}

            {deletable ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                <Trash2 size={14} />
                Deletable
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <ShieldCheck size={14} />
                Protected
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor listing visibility, moderation status, ownership source, and platform compliance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600">
            View Details
          </button>

          <button
            onClick={() => deletable && onDelete(asset.id)}
            disabled={!deletable}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md ${deletable
              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
              : "cursor-not-allowed bg-slate-300"
              }`}
          >
            Delete Listing
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBox label="Asset ID" value={asset.id} />
        <InfoBox label="Location" value={asset.location} />
        <InfoBox label="Asset Type" value={asset.assetType} />
        <InfoBox label="Created At" value={asset.createdAt} />
        <InfoBox label="Views" value={asset.views} />
        <InfoBox label="Reports" value={asset.reports} />
        <InfoBox label="Owner Name" value={asset.ownerName} />
        <InfoBox label="Submitted By" value={asset.submittedByRole} />
        <InfoBox label="Current Status" value={asset.status} />
        <InfoBox
          label="Admin Rule"
          value={deletable ? "Can be deleted by admin" : "Deletion not allowed"}
        />
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

export default function PlatformMonitoring() {
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
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Platform Monitoring Dashboard
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Monitor all property listings on the platform and remove any non-approved submission when necessary.
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
              placeholder="Search listing..."
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
              <p className="text-sm text-slate-500">Total Listings</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalAssets}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 text-white">
              <Activity size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Approved Listings</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{approvedAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Non-Approved Listings</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">{nonApprovedAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Deletable Listings</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">{deletableAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Reported Listings</p>
          <p className="mt-3 text-3xl font-bold text-red-600">{reportedAssets}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
            <MonitorSmartphone size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Monitoring Rules</h2>
            <p className="mt-1 text-sm text-slate-500">
              The administrator monitors all platform listings and can remove only non-approved submissions.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="text-sm font-bold text-emerald-700">Protected Listings</h3>
            <p className="mt-2 text-sm text-emerald-600">
              Approved listings remain visible on the platform and cannot be deleted by this action.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="text-sm font-bold text-amber-700">Listings Requiring Review</h3>
            <p className="mt-2 text-sm text-amber-600">
              Pending and Not Submitted listings should be reviewed quickly to maintain platform quality.
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="text-sm font-bold text-red-700">Listings Eligible For Deletion</h3>
            <p className="mt-2 text-sm text-red-600">
              Rejected, Pending, and Not Submitted listings may be deleted by the administrator.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-700">
              <Eye size={18} />
              <h3 className="text-sm font-bold">Visibility Tracking</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Track listing views to identify popular or inactive assets.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-700">
              <AlertTriangle size={18} />
              <h3 className="text-sm font-bold">Reports Monitoring</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Highlight listings that received warnings or user reports.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-700">
              <BarChart3 size={18} />
              <h3 className="text-sm font-bold">Moderation Metrics</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Follow moderation trends and approval workload across the platform.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Loading listings...</p>
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
            <p className="mt-3 text-slate-500">No listings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}