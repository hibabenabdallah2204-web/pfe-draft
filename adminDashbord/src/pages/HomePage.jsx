import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  Search,
  MapPin,
  Building2,
  Home,
  LogIn,
  FolderSearch,
  CheckCircle2,
  LandPlot,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import API from "../api/axios";

function getAssetIcon(assetType) {
  const type = assetType?.toLowerCase() || "";
  if (type.includes("building") || type.includes("immeuble") || type.includes("عمارة")) return <Building2 size={16} />;
  if (type.includes("house") || type.includes("maison") || type.includes("منزل")) return <Home size={16} />;
  if (type.includes("bare land") || type.includes("nu") || type.includes("بيضاء")) return <LandPlot size={16} />;
  if (type.includes("agricultural") || type.includes("agricole") || type.includes("فلاحية")) return <TrendingUp size={16} />;
  return <MapPin size={16} />;
}

function PublicAssetCard({ asset }) {
  const { t } = useTranslation();
  return (
    <div className="group overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="relative h-56 w-full bg-slate-100 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-fuchsia-100 opacity-60 mix-blend-multiply transition group-hover:scale-105 group-hover:opacity-100 duration-500"></div>
        <div className="z-10 text-indigo-300">
           {getAssetIcon(asset.assetType)}
        </div>
      </div>
      
      <div className="p-6 relative rtl:text-right">
        <div className="absolute -top-6 rtl:left-6 left-auto right-6 rounded-2xl bg-white p-1.5 shadow-md">
           <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm ring-2 ring-white">
              <CheckCircle2 size={18} />
           </span>
        </div>

        <div className="flex items-start justify-between rtl:pl-12 pr-0 pl-0 pr-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            {asset.assetType}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900 line-clamp-1">
          {asset.title}
        </h3>
        
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 rtl:flex-row-reverse">
          <MapPin size={16} className="text-slate-400" />
          {asset.location || t("home.confidential")}
        </p>

        <div className="mt-6 flex items-center gap-4">
           {asset.targetAmount && (
              <div className="flex-1 rounded-2xl bg-slate-50 p-3 rtl:text-right">
                 <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("home.targetRaise")}</p>
                 <p className="mt-1 text-lg font-black text-fuchsia-600">{asset.targetAmount.toLocaleString()} {t("common.currencySuffix")}</p>
              </div>
           )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 rtl:flex-row-reverse">
          <p className="text-xs font-medium text-slate-400">
            {asset.status === "FUNDING_OPEN" ? t("home.fundingActive") : t("home.published")}
          </p>
          <button 
            onClick={() => window.location.href = `/project/${asset.id}`}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg focus:ring-4 focus:ring-fuchsia-500/20 rtl:flex-row-reverse"
          >
            {t("home.invest")} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get("/assets");
        const approvedAssets = res.data.filter(a => ["PUBLISHED", "FUNDING_OPEN"].includes(a.status));
        setAssets(approvedAssets);
      } catch (error) {
        console.error("Failed to fetch public assets", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        asset.title?.toLowerCase().includes(keyword) ||
        asset.location?.toLowerCase().includes(keyword) ||
        asset.assetType?.toLowerCase().includes(keyword);

      let matchesCategory = true;
      if (categoryFilter === "Real Estate") {
        matchesCategory = asset.assetType?.includes("House") || asset.assetType?.includes("Building") || asset.assetType?.includes("Maison") || asset.assetType?.includes("Immeuble");
      } else if (categoryFilter === "Land") {
        matchesCategory = asset.assetType?.includes("Land") || asset.assetType?.includes("Terrain");
      }

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, assets]);

  return (
    <div className="min-h-screen bg-slate-50 rtl:text-right">
      <nav className="sticky top-0 z-50 border-b border-indigo-100/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 rtl:flex-row-reverse">
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30">
              <Building2 size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              MicroInvest
            </span>
          </div>
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <LanguageSwitcher />
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:ring-4 focus:ring-slate-100 rtl:flex-row-reverse"
            >
              <LogIn size={16} />
              {t("nav.signIn")}
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8 md:py-16">
        <div className="relative overflow-hidden rounded-[40px] bg-indigo-950 px-8 py-16 shadow-2xl md:px-16 md:py-20 rtl:text-right">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-fuchsia-950 mix-blend-multiply"></div>
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl rtl:text-right">
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
              {t("home.title")} <br/>
              <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">{t("home.titleRealEstate")}</span>
            </h1>
            <p className="mt-6 text-lg text-indigo-100/80 md:text-xl">
              {t("home.subtitle")}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rtl:flex-row-reverse">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute rtl:right-5 left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("home.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full rounded-3xl border border-slate-200 bg-white rtl:pr-12 pr-4 pl-12 rtl:pl-4 text-[15px] font-medium text-slate-700 outline-none shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 pb-2 rtl:flex-row-reverse">
            {[
              { id: "All", label: t("home.all") },
              { id: "Real Estate", label: t("home.realEstate") },
              { id: "Land", label: t("home.land") }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`whitespace-nowrap px-6 py-3 cursor-pointer text-sm rounded-3xl font-bold transition-all ${
                  categoryFilter === category.id
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105"
                    : "bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-[40px] bg-white p-24 shadow-sm border border-slate-100">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-fuchsia-600"></div>
              <p className="mt-4 font-semibold text-slate-500">{t("home.loading")}</p>
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map((asset) => (
                <PublicAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[40px] bg-white border border-slate-100 p-20 text-center shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-indigo-300">
                <FolderSearch size={40} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">{t("home.noProperties")}</h3>
              <p className="mt-2 text-slate-500 max-w-sm">
                {t("home.noPropertiesDesc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
