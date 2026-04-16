import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Building2, 
  MapPin, 
  Target, 
  FileText, 
  Camera, 
  ArrowLeft,
  Loader2,
  CheckCircle2
} from "lucide-react";
import API from "../../api/axios";

export default function SubmitProject() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "House",
    constructionStage: "Pre-construction",
    globalBudget: "",
    targetAmount: "",
  });

  const [files, setFiles] = useState({
    archPlans: null,
    adminAuth: null,
    photos: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      Object.keys(files).forEach(key => {
        if (files[key]) data.append(key, files[key]);
      });

      await API.post("/promoter/submit-project", data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyTypes = [
    t("promoter.submit.propHouse"), 
    t("promoter.submit.propBuilding"), 
    t("promoter.submit.propAgri"), 
    t("promoter.submit.propBare")
  ];
  
  const stages = [
    t("promoter.submit.stagePre"), 
    t("promoter.submit.stageFound"), 
    t("promoter.submit.stageFrame"), 
    t("promoter.submit.stageFinish"), 
    t("promoter.submit.stageReady")
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t("promoter.submit.title")}</h1>
        <p className="mt-2 text-slate-500">
          {t("promoter.submit.sub")}
        </p>
      </div>

      {success && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
          <CheckCircle2 size={24} />
          <div>
            <h3 className="font-bold">{t("promoter.submit.successTitle")}</h3>
            <p className="text-sm text-emerald-600">{t("promoter.submit.successSub")}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        
        {/* Basic Info */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">{t("promoter.submit.step1")}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t("promoter.submit.projTitle")}</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder={t("promoter.submit.projTitlePlaceholder")}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t("promoter.submit.projDesc")}</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder={t("promoter.submit.projDescPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Location & Type */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">{t("promoter.submit.step2")}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="col-span-1 md:col-span-3">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin size={16}/> {t("promoter.submit.location")}
              </label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder={t("promoter.submit.locationPlaceholder")}
              />
            </div>

            <div className="col-span-1">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 size={16}/> {t("promoter.submit.propType")}
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
                <HardHat size={16}/> {t("promoter.submit.constStage")}
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
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">{t("promoter.submit.step3")}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BadgeDollarSign size={16}/> {t("promoter.submit.globalBudget")}
              </label>
              <input
                required
                type="number"
                name="globalBudget"
                value={formData.globalBudget}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder={t("promoter.submit.budgetPlaceholder")}
              />
            </div>
            
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BadgeDollarSign size={16}/> {t("promoter.submit.targetAmount")}
              </label>
              <input
                required
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                placeholder={t("promoter.submit.targetPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h2 className="mb-5 text-lg font-bold text-slate-900 border-b pb-2">{t("promoter.submit.step4")}</h2>
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><UploadCloud size={20}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t("promoter.submit.docPlans")}</p>
                  <p className="text-xs text-slate-500">{t("promoter.submit.docSub")}</p>
                </div>
              </div>
              <input type="file" name="architecturalPlans" onChange={handleFileChange} required className="text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><UploadCloud size={20}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t("promoter.submit.docAuth")}</p>
                  <p className="text-xs text-slate-500">{t("promoter.submit.docAuthSub")}</p>
                </div>
              </div>
              <input type="file" name="administrativeAuth" onChange={handleFileChange} required className="text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><UploadCloud size={20}/></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t("promoter.submit.docPhotos")}</p>
                  <p className="text-xs text-slate-500">{t("promoter.submit.docPhotosSub")}</p>
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
            {isSubmitting ? t("promoter.submit.submittingBtn") : t("promoter.submit.submitBtn")} <ArrowRight size={20} className="rtl:rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
}

