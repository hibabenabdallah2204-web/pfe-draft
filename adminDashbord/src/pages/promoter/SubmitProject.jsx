import { useState } from "react";
import {
  MapPin,
  Building2,
  HardHat,
  BadgeDollarSign,
  UploadCloud,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import API from "../../api/axios";

export default function SubmitProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "Residential",
    constructionStage: "Pre-construction",
    globalBudget: "",
    targetAmount: "",
  });

  const [files, setFiles] = useState({
    architecturalPlans: null,
    administrativeAuth: null,
    photos: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app we'd use FormData since we're uploading files
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      Object.keys(files).forEach((key) => {
        if (files[key]) data.append(key, files[key]);
      });

      await API.post("/projects/deposit", data);
      
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        location: "",
        propertyType: "Residential",
        constructionStage: "Pre-construction",
        globalBudget: "",
        targetAmount: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyTypes = ["House (Maison)", "Building (Immeuble)", "Agricultural Land (Terrain agricole)", "Bare Land (Terrain nu)"];
  const stages = ["Pre-construction", "Foundation laying", "Structural frame", "Finishing", "Ready to move"];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Submit New Project</h1>
        <p className="mt-2 text-slate-500">
          Provide detailed project information and required documents for administrative validation.
        </p>
      </div>

      {success && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
          <CheckCircle2 size={24} />
          <div>
            <h3 className="font-bold">Project Submitted Successfully!</h3>
            <p className="text-sm text-emerald-600">Your project has been sent to the administrator for validation.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        
        {/* Basic Info */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">1. Project Overview</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Project Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder="E.g., Skyline Business Center"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Detailed Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder="Describe the opportunity, goals, and architectural vision..."
              />
            </div>
          </div>
        </div>

        {/* Location & Type */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">2. Characteristics</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="col-span-1 md:col-span-3">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin size={16}/> Location
              </label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder="City, Region, Address"
              />
            </div>

            <div className="col-span-1">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 size={16}/> Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                {propertyTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <HardHat size={16}/> Construction Stage
              </label>
              <select
                name="constructionStage"
                value={formData.constructionStage}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                {stages.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">3. Financial Requirements</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BadgeDollarSign size={16}/> Global Budget (TND)
              </label>
              <input
                required
                type="number"
                name="globalBudget"
                value={formData.globalBudget}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder="e.g. 1500000"
              />
            </div>
            
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BadgeDollarSign size={16}/> Target Amount to Raise (TND)
              </label>
              <input
                required
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder="e.g. 500000"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">4. Official Documents</h2>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><UploadCloud size={20}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Architectural Plans</p>
                  <p className="text-xs text-slate-500">PDF, JPG or PNG (Max 10MB)</p>
                </div>
              </div>
              <input type="file" name="architecturalPlans" onChange={handleFileChange} required className="text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><UploadCloud size={20}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Administrative Authorizations</p>
                  <p className="text-xs text-slate-500">Official permits, zoning docs</p>
                </div>
              </div>
              <input type="file" name="administrativeAuth" onChange={handleFileChange} required className="text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><UploadCloud size={20}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Photos & Progress Reports</p>
                  <p className="text-xs text-slate-500">Images of current site state</p>
                </div>
              </div>
              <input type="file" name="photos" onChange={handleFileChange} multiple className="text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>

          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-4 font-bold text-white shadow-lg transition hover:shadow-xl ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Submitting Project..." : "Submit Project"} <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
