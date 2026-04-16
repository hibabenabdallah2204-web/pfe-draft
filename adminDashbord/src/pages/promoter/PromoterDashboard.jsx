import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FolderCheck, Activity, Target, Search, BarChart3, Clock8, CheckCircle2 } from "lucide-react";
import API from "../../api/axios";

function ProjectCard({ project }) {
  const { t } = useTranslation();
  const target = project.targetAmount || 1; 
  const raised = project.raisedAmount || 0;
  const progressPercent = Math.min((raised / target) * 100, 100).toFixed(1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{project.title}</h2>
            {["APPROVED", "PUBLISHED", "FUNDING_OPEN"].includes(project.status) ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} /> {project.status}
              </span>
            ) : ["SUBMITTED", "KYC_PENDING", "UNDER_REVIEW"].includes(project.status) ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                <Clock8 size={14} /> {project.status.replace("_", " ")}
              </span>
            ) : project.status === "COMPLETED" || project.status === "FUNDED" ? (
               <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
                  <CheckCircle2 size={14} /> {project.status}
               </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {project.status || "DRAFT"}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2">{project.description || t("promoter.noProjects")}</p>
        </div>
        <button className="whitespace-nowrap rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-slate-50">
          {t("promoter.manageProject")}
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div className="rtl:text-right">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("promoter.raisedFunds")}</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{raised.toLocaleString()} TND</p>
          </div>
          <div className="text-right rtl:text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("promoter.target")}</p>
            <p className="mt-1 text-sm font-bold text-slate-400">{target.toLocaleString()} TND</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-right rtl:text-left text-xs font-semibold text-emerald-600">{progressPercent}% {t("promoter.funded")}</p>
      </div>
    </div>
  );
}

export default function PromoterDashboard() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await API.get("/projects");
        // Mock filtering to simulate "My Projects" only
        const myProjects = res.data.filter(p => p.submittedByRole === "Real Estate Developer" || p.submittedByRole === "Real Estate Agent / Agency");
        setProjects(myProjects);
      } catch (error) {
        console.error("Failed to fetch promoter projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.id?.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  const totalRaised = projects.reduce((acc, p) => acc + (Number(p.raisedAmount) || 0), 0);
  const totalTarget = projects.reduce((acc, p) => acc + (Number(p.targetAmount) || 0), 0);
  const activeProjectsCount = projects.length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">{t("promoter.title")}</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("promoter.sub")}
          </p>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t("promoter.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
              <p className="text-sm font-semibold text-slate-500">{t("promoter.statsTarget")}</p>
              <p className="mt-2 text-3xl font-black text-slate-400">{totalTarget.toLocaleString()} TND</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-slate-400"><Target size={24} /></div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">{t("promoter.statsActiveSub")}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{activeProjectsCount}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><FolderCheck size={24} /></div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm text-slate-500">{t("common.loading")}</div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Activity className="mx-auto text-slate-400" size={32} />
            <p className="mt-4 text-slate-500">{t("promoter.noProjects")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

