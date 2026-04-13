import { useState } from "react";
import { Server, Search, Filter, ShieldAlert, BadgeDollarSign, CheckCircle2, Navigation, AlertTriangle } from "lucide-react";

const generateAuditMockData = () => [
  { id: "LOG-0912", timestamp: "2026-04-10 13:45:12", user: "Admin System", target: "AST-005", action: "Validation", detail: "Expert validated structural plans. Status verified: PUBLISHED.", type: "validation" },
  { id: "LOG-0913", timestamp: "2026-04-10 13:40:05", user: "InvestorINV4", target: "ESC-001", action: "Paiement (Escrow)", detail: "Secured payment of 500,000 TND in Escrow account #ESC-001.", type: "payment" },
  { id: "LOG-0914", timestamp: "2026-04-10 12:15:30", user: "Financial Manager", target: "AST-001", action: "Décaissement", detail: "Authorized release of 1,200,000 TND for Phase 2 milestones.", type: "disbursement" },
  { id: "LOG-0915", timestamp: "2026-04-09 09:22:15", user: "Moderator", target: "USR-088", action: "Modification Critique", detail: "Changed user status from Active to Locked due to missing KYC.", type: "critical" },
  { id: "LOG-0916", timestamp: "2026-04-08 16:04:10", user: "Agent Judiciaire", target: "DSP-002", action: "Intervention Judiciaire", detail: "Placed legal freeze on asset AST-003 pending investigation.", type: "judicial" },
];

export default function AuditLogs() {
  const [logs] = useState(generateAuditMockData());
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => 
    log.detail.toLowerCase().includes(search.toLowerCase()) || 
    log.id.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  const getLogIcon = (type) => {
    switch(type) {
      case 'validation': return <div className="p-2 rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={16}/></div>;
      case 'payment': return <div className="p-2 rounded-full bg-indigo-100 text-indigo-600"><BadgeDollarSign size={16}/></div>;
      case 'disbursement': return <div className="p-2 rounded-full bg-amber-100 text-amber-600"><Navigation size={16}/></div>;
      case 'critical': return <div className="p-2 rounded-full bg-orange-100 text-orange-600"><AlertTriangle size={16}/></div>;
      case 'judicial': return <div className="p-2 rounded-full bg-rose-100 text-rose-600"><ShieldAlert size={16}/></div>;
      default: return <div className="p-2 rounded-full bg-slate-100 text-slate-600"><Server size={16}/></div>;
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">System Audit Logs</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            Immutable traceability of all critical system events, validations, and financial disbursements.
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-3 font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
             <Filter size={18} /> Apply Filters
           </button>
        </div>
      </div>

      <div className="rounded-[32px] bg-white shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Server className="text-indigo-500" size={20} /> Event Historization
           </h2>
           <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search log ID, action, or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400"
              />
           </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-xl w-32">Timestamp</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Target ID</th>
                <th className="px-4 py-3 rounded-r-xl">Immutable Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-4 py-4 font-mono text-xs whitespace-nowrap text-slate-400">{log.timestamp}</td>
                  <td className="px-4 py-4">
                     <div className="flex items-center gap-2">
                        {getLogIcon(log.type)}
                        <span className="font-bold text-slate-800">{log.action}</span>
                     </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-semibold">{log.user}</td>
                  <td className="px-4 py-4 font-mono text-indigo-600">{log.target}</td>
                  <td className="px-4 py-4 text-slate-600">{log.detail}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                 <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">No logs match your search.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
