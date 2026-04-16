import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Wallet, Activity, TrendingUp, CheckCircle2 } from "lucide-react";
import API from "../../api/axios";

export default function InvestorDashboard() {
  const { t } = useTranslation();
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await API.get("/investments");
        setInvestments(res.data);
      } catch (error) {
        console.error("Failed to load investor portfolio", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  const totalInvested = investments.reduce((acc, inv) => acc + inv.amountInvested, 0);
  const totalEquities = investments.length;
  // Mock performance calculation
  const totalEstimatedReturn = (totalInvested * 0.085).toFixed(0); 

  return (
    <div className="rtl:text-right">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rtl:flex-row-reverse">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">{t("investor.title")}</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("investor.sub")}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-md transition hover:shadow-lg">
          <Wallet size={18} /> {t("investor.addFunds")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-[32px] bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-8 shadow-lg shadow-fuchsia-500/20 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/80">{t("investor.statsInvested")}</p>
            <div className="rounded-xl bg-white/20 p-2"><Wallet size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black">{totalInvested.toLocaleString()} <span className="text-xl font-bold text-white/60">{t("common.currencySuffix")}</span></p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">{t("investor.statsEquities")}</p>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-500"><Activity size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black text-slate-900">{totalEquities}</p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">{t("investor.statsReturn")} (+8.5%)</p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500"><TrendingUp size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black text-emerald-600">+{Number(totalEstimatedReturn).toLocaleString()} <span className="text-xl font-bold text-emerald-600/50">{t("common.currencySuffix")}</span></p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{t("investor.activeInvestments")}</h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500">{t("common.loading")}</div>
          ) : investments.length > 0 ? (
            investments.map(inv => (
              <div key={inv.id} className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rtl:sm:flex-row-reverse">
                  <div>
                    <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">{t("investor.investedOn")} {inv.investedAt}</span>
                    <h3 className="text-lg font-bold text-slate-900">{inv.title}</h3>
                    <div className="mt-2 flex items-center gap-3">
                       <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                          {inv.equityShare}% {t("investor.equity")}
                       </span>
                       <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {t("investor.stage")}: {inv.projectStage}
                       </span>
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <p className="text-sm font-semibold text-slate-500">{t("investor.yourInvestment")}</p>
                    <p className="text-2xl font-black text-fuchsia-500">{inv.amountInvested.toLocaleString()} {t("common.currencySuffix")}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                       <CheckCircle2 size={12} />
                     </span>
                     {t("investor.legalContract")}
                   </div>
                   <button className="text-sm font-semibold text-indigo-600 hover:underline">
                     {t("investor.downloadContract")}
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[32px] bg-white p-12 text-center shadow-sm">
              <LineChart className="mx-auto text-slate-300" size={48} />
              <h3 className="mt-4 text-lg font-bold text-slate-900">{t("investor.emptyPortfolio")}</h3>
              <p className="mt-2 text-slate-500">{t("investor.emptyPortfolioDesc")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

