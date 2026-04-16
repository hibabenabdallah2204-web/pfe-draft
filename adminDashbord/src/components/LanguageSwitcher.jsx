import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ isDark = false }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const getLangName = (lng) => {
    switch (lng) {
      case "en":
        return "English";
      case "fr":
        return "Français";
      case "ar":
        return "العربية";
      default:
        return "English";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold shadow-sm transition focus:outline-none focus:ring-4 ${
          isDark
            ? "border-white/10 bg-white/5 text-white hover:bg-white/10 focus:ring-white/5"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-100"
        }`}
      >
        <Globe size={18} className={isDark ? "text-white/60" : "text-slate-500"} />
        {getLangName(i18n.language)}
      </button>

      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-2 flex w-40 flex-col overflow-hidden rounded-2xl border shadow-xl ${
          isDark 
            ? "border-white/10 bg-slate-800 text-white" 
            : "border-slate-200 bg-white text-slate-700"
        }`}>
          <button
            onClick={() => changeLanguage("en")}
            className={`px-4 py-3 text-left text-sm font-semibold hover:bg-white/5 rtl:text-right`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("fr")}
            className={`px-4 py-3 text-left text-sm font-semibold hover:bg-white/5 rtl:text-right`}
          >
            Français
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className={`px-4 py-3 text-left text-sm font-semibold hover:bg-white/5 rtl:text-right w-full`}
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
