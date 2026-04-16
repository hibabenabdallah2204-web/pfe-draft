import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DownloadCloud, DollarSign, Wallet, TrendingUp, Search, Receipt } from "lucide-react";
import API from "../api/axios";

export default function AdminFinancials() {
  const { t } = useTranslation();
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const res = await API.get("/investments");
        setInvestments(res.data);
      } catch (error) {
        console.error("Failed to fetch financial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancialData();
  }, []);

  const totalInvestmentVolume = investments.reduce((acc, inv) => acc + inv.amountInvested, 0);
  const platformCommissionRate = 0.02; // 2%
  const totalRevenue = totalInvestmentVolume * platformCommissionRate;
  
  return (
    <div className="rtl:text-right">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8 rtl:lg:flex-row-reverse">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">{t("fin.title")}</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("fin.sub")}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 text-white px-5 py-3 font-semibold shadow-md transition hover:bg-indigo-700 hover:shadow-lg">
             <DownloadCloud size={18} /> {t("fin.exportBtn")}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-8">
        <div className="rounded-[32px] bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-8 shadow-lg text-white">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
             <p className="text-sm font-semibold text-white/80">{t("fin.statsRevenue")}</p>
             <div className="rounded-xl bg-white/20 p-2"><DollarSign size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black">{totalRevenue.toLocaleString()} <span className="text-xl font-bold text-white/60">{t("common.currency")}</span></p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
             <p className="text-sm font-semibold text-slate-500">{t("fin.statsVolume")}</p>
             <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500"><Wallet size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black text-slate-900">{totalInvestmentVolume.toLocaleString()} <span className="text-xl font-bold text-slate-300">{t("common.currency")}</span></p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
             <p className="text-sm font-semibold text-slate-500">{t("fin.growth")}</p>
             <div className="rounded-xl bg-teal-50 p-2 text-teal-500"><TrendingUp size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black text-teal-600">+14.5%</p>
        </div>
      </div>

      <div className="rounded-[32px] bg-white shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
           <Receipt size={20} className="text-indigo-500"/> {t("fin.breakdownTitle")}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">{t("fin.table.date")}</th>
                <th className="px-4 py-3">{t("fin.table.project")}</th>
                <th className="px-4 py-3 text-right">{t("fin.table.vol")}</th>
                <th className="px-4 py-3 text-right">{t("fin.table.rate")}</th>
                <th className="px-4 py-3 text-right text-indigo-600 rounded-r-xl">{t("fin.table.fee")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                   <td colSpan="5" className="text-center py-8 text-slate-400">{t("fin.status.computing")}</td>
                </tr>
              ) : investments.length > 0 ? (
                investments.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-4 py-4">{inv.investedAt}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{inv.title}</td>
                    <td className="px-4 py-4 text-right rtl:text-left">{inv.amountInvested.toLocaleString()} {t("common.currency")}</td>
                    <td className="px-4 py-4 text-right rtl:text-left">2%</td>
                    <td className="px-4 py-4 text-right rtl:text-left font-bold text-indigo-600">
                       +{(inv.amountInvested * platformCommissionRate).toLocaleString()} {t("common.currency")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="5" className="text-center py-8 text-slate-400">{t("fin.status.noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

