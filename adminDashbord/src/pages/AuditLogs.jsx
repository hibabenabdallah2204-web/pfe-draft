import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Server, Search, Filter, ShieldAlert, BadgeDollarSign, CheckCircle2, Navigation, AlertTriangle } from "lucide-react";

const generateAuditMockData = () => [
  { id: "LOG-0912", timestamp: "2026-04-10 13:45:12", user: "Admin System", target: "AST-005", actionKey: "validation", detail: "Expert validated structural plans. Status verified: PUBLISHED.", type: "validation" },
  { id: "LOG-0913", timestamp: "2026-04-10 13:40:05", user: "InvestorINV4", target: "ESC-001", actionKey: "payment", detail: "Secured payment of 500,000 TND in Escrow account #ESC-001.", type: "payment" },
  { id: "LOG-0914", timestamp: "2026-04-10 12:15:30", user: "Financial Manager", target: "AST-001", actionKey: "disbursement", detail: "Authorized release of 1,200,000 TND for Phase 2 milestones.", type: "disbursement" },
  { id: "LOG-0915", timestamp: "2026-04-09 09:22:15", user: "Moderator", target: "USR-088", actionKey: "critical", detail: "Changed user status from Active to Locked due to missing KYC.", type: "critical" },
  { id: "LOG-0916", timestamp: "2026-04-08 16:04:10", user: "Agent Judiciaire", target: "DSP-002", actionKey: "judicial", detail: "Placed legal freeze on asset AST-003 pending investigation.", type: "judicial" },
];

export default function AuditLogs() {
  const { t } = useTranslation();
  const [logs] = useState(generateAuditMockData());
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => 
    log.detail.toLowerCase().includes(search.toLowerCase()) || 
    log.id.toLowerCase().includes(search.toLowerCase()) ||
    t(`audit.eventTypes.${log.actionKey}`).toLowerCase().includes(search.toLowerCase())
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
    <div className="rtl:text-right">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8 rtl:lg:flex-row-reverse">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">{t("audit.title")}</h1>
          <p className="mt-3 text-[16px] text-slate-500">
            {t("audit.sub")}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-3 font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
             <Filter size={18} /> {t("audit.applyFilters")}
           </button>
        </div>
      </div>

      <div className="rounded-[32px] bg-white shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6 rtl:flex-row-reverse">
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 rtl:flex-row-reverse">
             <Server className="text-indigo-500" size={20} /> {t("audit.eventHistorization")}
           </h2>
           <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto" size={16} />
              <input
                type="text"
                placeholder={t("audit.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 rtl:pr-10 rtl:pl-4"
              />
           </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600 rtl:text-right">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-xl rtl:rounded-r-xl rtl:rounded-l-none w-32">{t("audit.table.timestamp")}</th>
                <th className="px-4 py-3">{t("audit.table.eventType")}</th>
                <th className="px-4 py-3">{t("audit.table.actor")}</th>
                <th className="px-4 py-3">{t("audit.table.target")}</th>
                <th className="px-4 py-3 rounded-r-xl rtl:rounded-l-xl rtl:rounded-r-none">{t("audit.table.detail")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-4 py-4 font-mono text-xs whitespace-nowrap text-slate-400">{log.timestamp}</td>
                  <td className="px-4 py-4">
                     <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        {getLogIcon(log.type)}
                        <span className="font-bold text-slate-800">{t(`audit.eventTypes.${log.actionKey}`)}</span>
                     </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-semibold">{log.user}</td>
                  <td className="px-4 py-4 font-mono text-indigo-600">{log.target}</td>
                  <td className="px-4 py-4 text-slate-600">{log.detail}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                   <td colSpan="5" className="text-center py-8 text-slate-400">{t("audit.noLogs")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


