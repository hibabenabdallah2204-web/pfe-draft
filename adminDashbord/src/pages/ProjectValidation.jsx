import { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  MapPin,
  BadgeDollarSign,
  CalendarDays,
  FolderCheck,
  Building2,
  Briefcase,
  ShieldCheck,
  FileText
} from "lucide-react";
import API from "../api/axios";

const allowedAssetTypes = [
  "Building",
  "House",
  "Bare Land",
  "Agricultural Land",
];

const allowedRoles = [
  "Real Estate Developer",
  "Real Estate Agent / Agency",
];

const allowedStatuses = ["Pending", "Approved", "Rejected"];



function getRoleIcon(role) {
  switch (role) {
    case "Real Estate Developer":
      return <Briefcase size={16} />;
    case "Real Estate Agent / Agency":
      return <Building2 size={16} />;
    default:
      return <ShieldCheck size={16} />;
  }
}

function validateAsset(asset) {
  const errors = [];

  if (!asset.id || asset.id.trim() === "") {
    errors.push("Asset ID is required.");
  }

  if (!asset.title || asset.title.trim().length < 3) {
    errors.push("Title must contain at least 3 characters.");
  }

  if (!asset.location || asset.location.trim().length < 2) {
    errors.push("Location is required.");
  }

  if (!asset.assetType || !allowedAssetTypes.includes(asset.assetType)) {
    errors.push("Asset type is invalid.");
  }

  if (!asset.description || asset.description.trim().length < 10) {
    errors.push("Description must contain at least 10 characters.");
  }

  if (
    asset.targetAmount === null ||
    asset.targetAmount === undefined ||
    Number(asset.targetAmount) <= 0
  ) {
    errors.push("Target Amount must be greater than 0.");
  }

  if (
    asset.raisedAmount === null ||
    asset.raisedAmount === undefined ||
    Number(asset.raisedAmount) < 0
  ) {
    errors.push("Raised Amount cannot be negative.");
  }

  if (
    Number(asset.raisedAmount) > Number(asset.targetAmount) &&
    Number(asset.targetAmount) > 0
  ) {
    errors.push("Raised Amount cannot exceed Target Amount.");
  }

  if (!asset.status || !allowedStatuses.includes(asset.status)) {
    errors.push("Status is required and must be valid.");
  }

  if (!asset.createdAt || asset.createdAt.trim() === "") {
    errors.push("Created At is required.");
  }

  if (!asset.submittedByRole || !allowedRoles.includes(asset.submittedByRole)) {
    errors.push("Submitted By Role is invalid.");
  }

  if (!asset.ownerName || asset.ownerName.trim().length < 2) {
    errors.push("Owner name is required.");
  }

  if (!asset.ownerApprovalStatus || asset.ownerApprovalStatus !== "Approved") {
    errors.push("The owner account must be approved before validating this listing.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function getValidationBadge(isValid) {
  return isValid
    ? "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
    : "inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600";
}

function InfoBox({ label, value, icon }) {
  const isEmpty = !value || String(value).trim() === "";

  return (
    <div
      className={`rounded-2xl border p-4 ${isEmpty
        ? "border-red-200 bg-red-50"
        : "border-slate-200 bg-slate-50"
        }`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p
        className={`mt-2 text-[15px] font-medium ${isEmpty ? "text-red-600" : "text-slate-900"
          }`}
      >
        {isEmpty ? "Missing value" : value}
      </p>
    </div>
  );
}

function AssetCard({ asset }) {
  const validation = validateAsset(asset);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {asset.title || "Untitled Listing"}
            </h2>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {getRoleIcon(asset.submittedByRole)}
              {asset.submittedByRole || "Unknown Role"}
            </span>

            {validation.isValid ? (
              <span className={getValidationBadge(true)}>
                <CheckCircle2 size={14} />
                Valid
              </span>
            ) : (
              <span className={getValidationBadge(false)}>
                <AlertTriangle size={14} />
                Incomplete
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Review all required fields and owner approval status before validating the property listing.
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-md">
          Review Listing
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoBox label="Asset ID" value={asset.id} />
        <InfoBox label="Title" value={asset.title} />
        <InfoBox label="Location" value={asset.location} icon={<MapPin size={16} />} />
        <InfoBox label="Asset Type" value={asset.assetType} />
        <InfoBox label="Description" value={asset.description} />
        <InfoBox
          label="Target Amount"
          value={
            asset.targetAmount !== undefined && asset.targetAmount !== null
              ? `${asset.targetAmount} TND`
              : ""
          }
          icon={<BadgeDollarSign size={16} />}
        />
        <InfoBox
          label="Raised Amount"
          value={
            asset.raisedAmount !== undefined && asset.raisedAmount !== null
              ? `${asset.raisedAmount} TND`
              : ""
          }
          icon={<BadgeDollarSign size={16} />}
        />
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workflow Status
          </span>
          <div className="mt-2 text-[15px] font-medium text-slate-900">
             {["APPROVED", "PUBLISHED", "FUNDING_OPEN"].includes(asset.status) ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {asset.status}
                </span>
             ) : ["SUBMITTED", "KYC_PENDING", "UNDER_REVIEW"].includes(asset.status) ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                  {asset.status.replace("_", " ")}
                </span>
             ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                  {asset.status || "DRAFT"}
                </span>
             )}
          </div>
        </div>
        <InfoBox
          label="Created At"
          value={asset.createdAt}
          icon={<CalendarDays size={16} />}
        />
        <InfoBox label="Owner Name" value={asset.ownerName} />
        <InfoBox
          label="Submitted By"
          value={asset.submittedByRole}
          icon={getRoleIcon(asset.submittedByRole)}
        />
        <InfoBox
          label="Owner Approval Status"
          value={asset.ownerApprovalStatus}
          icon={<ShieldCheck size={16} />}
        />
        <div className="col-span-1 md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
           <p className="text-xs font-semibold text-slate-500 uppercase">Uploaded Documents (Module C)</p>
           <div className="mt-2 flex flex-wrap gap-4 text-sm text-indigo-600 font-semibold">
              <span className="flex items-center gap-1 underline cursor-pointer"><FileText size={14}/>Architectural_Plans.pdf</span>
              <span className="flex items-center gap-1 underline cursor-pointer"><FileText size={14}/>Admin_Authorizations.pdf</span>
              <span className="flex items-center gap-1 underline cursor-pointer"><FileText size={14}/>Site_Photos.zip</span>
           </div>
        </div>
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

export default function ProjectValidation() {
  const [search, setSearch] = useState("");
  const [submittedAssets, setSubmittedAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setSubmittedAssets(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredAssets = useMemo(() => {
    return submittedAssets.filter((asset) => {
      const keyword = search.toLowerCase();

      return (
        asset.title?.toLowerCase().includes(keyword) ||
        asset.id?.toLowerCase().includes(keyword) ||
        asset.location?.toLowerCase().includes(keyword) ||
        asset.assetType?.toLowerCase().includes(keyword) ||
        asset.ownerName?.toLowerCase().includes(keyword) ||
        asset.submittedByRole?.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const totalAssets = submittedAssets.length;
  const validAssets = submittedAssets.filter(
    (asset) => validateAsset(asset).isValid
  ).length;
  const invalidAssets = totalAssets - validAssets;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Project Validation Dashboard
          </h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Validate submitted property listings by checking required fields and owner approval before final acceptance.
          </p>
        </div>

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
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Submitted Listings</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalAssets}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 text-white">
              <FolderCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Valid Listings</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{validAssets}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Listings With Errors</p>
          <p className="mt-3 text-3xl font-bold text-red-600">{invalidAssets}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Loading listings...</p>
          </div>
        ) : filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <AssetCard key={asset.id || asset.title} asset={asset} />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No listings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}