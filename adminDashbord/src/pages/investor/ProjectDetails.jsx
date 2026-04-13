import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building2,
  HardHat,
  BadgeDollarSign,
  PieChart,
  CheckCircle2,
  FileText
} from "lucide-react";
import API from "../../api/axios";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulator & Payment state
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error("Failed to load project details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  const handleInvest = async () => {
    setIsInvesting(true);
    try {
      await API.post("/investments", { projectId: id, amount: investmentAmount });
      setSuccess(true);
      setTimeout(() => navigate("/investor/portfolio"), 3000);
    } catch (error) {
      console.error("Investment failed", error);
    } finally {
      setIsInvesting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#ececf2] text-slate-500">Loading project data...</div>;
  }

  if (!project) {
    return <div className="flex h-screen flex-col items-center justify-center bg-[#ececf2]">
      <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
      <button onClick={() => navigate("/home")} className="mt-4 text-indigo-600 underline">Return Home</button>
    </div>;
  }

  const targetAmount = project.targetAmount || 500000;
  const raisedAmount = project.raisedAmount || 0;
  const equityAvailable = 100 - ((raisedAmount / targetAmount) * 100);
  
  const simulatedEquity = ((investmentAmount / targetAmount) * 100).toFixed(2);
  const estimatedAnnualYield = 8.5; // Fixed mock percentage
  const simulatedYield = ((investmentAmount * estimatedAnnualYield) / 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[#ececf2] pb-16">
      
      {/* Top Banner */}
      <div className="h-64 w-full bg-slate-800 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent z-10" />
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-md border border-indigo-500/30">
            <Building2 size={14} /> {project.propertyType || project.assetType}
          </div>
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">{project.title}</h1>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Technical & Financial Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-slate-50 p-3 text-slate-400"><MapPin size={24}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Location</p>
                  <p className="mt-1 font-medium text-slate-900">{project.location || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-slate-50 p-3 text-slate-400"><HardHat size={24}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Construction Stage</p>
                  <p className="mt-1 font-medium text-slate-900">{project.constructionStage || "Planning"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><BadgeDollarSign size={24}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Target Amount</p>
                  <p className="mt-1 font-medium text-slate-900">{targetAmount.toLocaleString()} TND</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><PieChart size={24}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Estimated Annual Yield</p>
                  <p className="mt-1 font-medium text-slate-900">{estimatedAnnualYield}%</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Project Description</h3>
              <p className="text-[15px] leading-7 text-slate-600">
                {project.description || "Detailed description of the investment opportunity will be displayed here, covering the architectural vision, local market analysis, and targeted demographics."}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Official Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50 transition">
                <FileText className="text-indigo-400" size={24} />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Architectural Plans.pdf</p>
                  <p className="text-xs text-slate-500 mt-1">4.2 MB</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50 transition">
                <FileText className="text-indigo-400" size={24} />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Financial Forecast.pdf</p>
                  <p className="text-xs text-slate-500 mt-1">1.8 MB</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Simulator & Invest */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-indigo-900/5 ring-1 ring-slate-200 sticky top-8">
            <h2 className="text-2xl font-black text-slate-900">Investment Simulator</h2>
            <p className="mt-2 text-sm text-slate-500 mb-8">Calculate your potential equity and returns before investing.</p>
            
            <div className="mb-6">
               <label className="text-sm font-bold text-slate-700 block mb-2">I want to invest (TND)</label>
               <input 
                  type="range" 
                  min="500" 
                  max={targetAmount - raisedAmount} 
                  step="500" 
                  value={investmentAmount} 
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))} 
                  className="w-full accent-emerald-500"
               />
               <div className="mt-4 flex items-center rounded-2xl border-2 border-emerald-100 bg-emerald-50 px-4 py-3">
                 <span className="text-xl font-black text-emerald-700 w-full">{investmentAmount.toLocaleString()}</span>
                 <span className="font-bold text-emerald-600/50">TND</span>
               </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 mb-8 border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-slate-500">Simulated Equity</span>
                <span className="text-lg font-bold text-indigo-600">{simulatedEquity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Estimated Annual Return</span>
                <span className="text-lg font-bold text-emerald-600">+{simulatedYield} TND</span>
              </div>
            </div>

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-emerald-700">
                <CheckCircle2 className="mx-auto mb-2" size={32} />
                <p className="font-bold">Payment Successful!</p>
                <p className="text-sm mt-1">Funds locked in escrow. Redirecting...</p>
              </div>
            ) : (
               <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={isInvesting || investmentAmount <= 0}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-center font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
               >
                  Proceed to Checkout
               </button>
            )}
            <p className="mt-4 text-center text-xs text-slate-400">Your funds will be secured in a milestone escrow account.</p>
          </div>
        </div>

      </div>

      {/* Payment Checkout Modal (Module D) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
           <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900">Secure Checkout</h3>
              <p className="text-sm text-slate-500 mt-1 mb-6">Complete your investment via secure gateway.</p>
              
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-6 space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Investment Amount</span>
                    <span className="font-bold text-slate-900">{investmentAmount.toLocaleString()} TND</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Platform Commission (2%)</span>
                    <span className="font-bold text-slate-900">{(investmentAmount * 0.02).toLocaleString()} TND</span>
                 </div>
                 <div className="pt-2 border-t border-slate-200 flex justify-between text-lg">
                    <span className="font-bold text-slate-900">Total Deducted</span>
                    <span className="font-black text-indigo-600">{(investmentAmount * 1.02).toLocaleString()} TND</span>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                    <input type="text" placeholder="John Doe" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-400 outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-mono focus:border-emerald-400 outline-none" />
                 </div>
                 <div className="flex gap-4">
                    <div className="w-1/2">
                       <label className="block text-xs font-bold text-slate-700 mb-1">Expiry</label>
                       <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-400 outline-none" />
                    </div>
                    <div className="w-1/2">
                       <label className="block text-xs font-bold text-slate-700 mb-1">CVC</label>
                       <input type="password" placeholder="***" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-400 outline-none" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsCheckoutOpen(false)}
                   className="w-1/3 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={() => { setIsCheckoutOpen(false); handleInvest(); }}
                   className="w-2/3 rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800"
                 >
                   Pay {(investmentAmount * 1.02).toLocaleString()} TND
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
