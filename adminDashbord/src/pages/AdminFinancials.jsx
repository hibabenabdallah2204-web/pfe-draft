import { useState, useEffect } from "react";
import { DownloadCloud, DollarSign, Wallet, TrendingUp, Search, Receipt } from "lucide-react";
import API from "../api/axios";

export default function AdminFinancials() {
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
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Financial Reports</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Monitor platform revenue, automatic commissions, and generate global financial reports.
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 text-white px-5 py-3 font-semibold shadow-md transition hover:bg-indigo-700 hover:shadow-lg">
             <DownloadCloud size={18} /> Export Financial Ledger
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-8">
        <div className="rounded-[32px] bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-8 shadow-lg text-white">
          <div className="flex items-center justify-between">
             <p className="text-sm font-semibold text-white/80">Platform Revenue (2% Comm.)</p>
             <div className="rounded-xl bg-white/20 p-2"><DollarSign size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black">{totalRevenue.toLocaleString()} <span className="text-xl font-bold text-white/60">TND</span></p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
             <p className="text-sm font-semibold text-slate-500">Total Investment Volume</p>
             <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500"><Wallet size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black text-slate-900">{totalInvestmentVolume.toLocaleString()} <span className="text-xl font-bold text-slate-300">TND</span></p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
             <p className="text-sm font-semibold text-slate-500">Growth Month-Over-Month</p>
             <div className="rounded-xl bg-teal-50 p-2 text-teal-500"><TrendingUp size={20} /></div>
          </div>
          <p className="mt-4 text-4xl font-black text-teal-600">+14.5%</p>
        </div>
      </div>

      <div className="rounded-[32px] bg-white shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
           <Receipt size={20} className="text-indigo-500"/> Revenue Breakdown by Transaction
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Date</th>
                <th className="px-4 py-3">Project Link</th>
                <th className="px-4 py-3 text-right">Investment Vol.</th>
                <th className="px-4 py-3 text-right">Commission Rate</th>
                <th className="px-4 py-3 text-right text-indigo-600 rounded-r-xl">Platform Fee (Rev)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                   <td colSpan="5" className="text-center py-8 text-slate-400">Computing financial data...</td>
                </tr>
              ) : investments.length > 0 ? (
                investments.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-4 py-4">{inv.investedAt}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{inv.title}</td>
                    <td className="px-4 py-4 text-right">{inv.amountInvested.toLocaleString()} TND</td>
                    <td className="px-4 py-4 text-right">2%</td>
                    <td className="px-4 py-4 text-right font-bold text-indigo-600">
                       +{(inv.amountInvested * platformCommissionRate).toLocaleString()} TND
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="5" className="text-center py-8 text-slate-400">No revenue data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
