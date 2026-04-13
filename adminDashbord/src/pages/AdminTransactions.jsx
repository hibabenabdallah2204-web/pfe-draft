import { useState, useEffect } from "react";
import { ArrowUpDown, Search, FileText, DownloadCloud, LineChart, ShieldCheck } from "lucide-react";
import API from "../api/axios";

export default function AdminTransactions() {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllInvestments = async () => {
      try {
        const res = await API.get("/investments");
        // In a real app we'd fetch all investments across all users. Using the mock endpoint for now.
        setInvestments(res.data);
      } catch (error) {
        console.error("Failed to fetch investments history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllInvestments();
  }, []);

  const filteredInvestments = investments.filter(inv => 
    inv.id?.toLowerCase().includes(search.toLowerCase()) || 
    inv.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Transaction History</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Complete traceability of all platform investments. Review and audit escrow transactions.
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2 font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
             <DownloadCloud size={18} /> Export CSV
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-8">
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
             <div>
                <p className="text-sm font-semibold text-slate-500">Total Escrow Volume</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {investments.reduce((acc, inv) => acc + inv.amountInvested, 0).toLocaleString()} TND
                </p>
             </div>
             <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><ShieldCheck size={24} /></div>
          </div>
        </div>
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
             <div>
                <p className="text-sm font-semibold text-slate-500">Total Transactions</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{investments.length}</p>
             </div>
             <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><ArrowUpDown size={24} /></div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white shadow-sm border border-slate-100 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900">Recent Investments</h2>
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search TxID or Project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Equity Share</th>
                <th className="px-4 py-3 text-right">Amount (TND)</th>
                <th className="px-4 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                   <td colSpan="6" className="text-center py-8 text-slate-400">Loading records...</td>
                </tr>
              ) : filteredInvestments.length > 0 ? (
                filteredInvestments.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-4 py-4 font-mono text-indigo-600">{inv.id}</td>
                    <td className="px-4 py-4">{inv.investedAt}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{inv.title}</td>
                    <td className="px-4 py-4">{inv.equityShare}%</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900">{inv.amountInvested.toLocaleString()}</td>
                    <td className="px-4 py-4">
                       <span className="inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">Locked in Escrow</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="6" className="text-center py-8 text-slate-400">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Milestone Disbursement (Module Gestion Financière) */}
      <div className="mt-8 rounded-[32px] bg-white shadow-sm border border-slate-100 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             Escrow Milestone Disbursements
           </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">Review promoter milestone requests. Requires Auditor and Finance Manager approval.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Mock Milestone Request 1 */}
           <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Action Required</div>
             <h3 className="font-bold text-slate-900">Palm Residence - Phase 1 (Foundation)</h3>
             <p className="text-sm text-slate-500 mt-1">Requested Amount: <span className="font-bold text-slate-900">500,000 TND</span></p>
             
             <div className="mt-4 space-y-2">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600">Expert / Auditor Validation</span>
                 <span className="text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck size={14}/> Approved</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600">Financial Manager</span>
                 <span className="text-amber-500 font-semibold">Pending Review</span>
               </div>
             </div>

             <div className="mt-6 flex gap-2">
               <button className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition">Authorize Release</button>
               <button className="flex-1 bg-white border border-slate-200 text-rose-600 py-2 rounded-xl text-sm font-semibold hover:bg-rose-50 transition">Flag Litige (Agent Judiciaire)</button>
             </div>
           </div>

           {/* Mock Milestone Request 2 */}
           <div className="rounded-2xl border border-slate-200 p-5 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Released</div>
             <h3 className="font-bold text-slate-900">Skyline Business Center - Phase 2 (Structure)</h3>
             <p className="text-sm text-slate-500 mt-1">Requested Amount: <span className="font-bold text-slate-900">1,200,000 TND</span></p>
             
             <div className="mt-4 space-y-2">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600">Expert / Auditor Validation</span>
                 <span className="text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck size={14}/> Approved</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600">Financial Manager</span>
                 <span className="text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck size={14}/> Released</span>
               </div>
             </div>

             <div className="mt-6">
                <p className="text-center text-xs text-slate-400">Funds were successfully disbursed to the promoter.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
