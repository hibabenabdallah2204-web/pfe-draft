import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
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
        className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
      >
        <Globe size={18} className="text-slate-500" />
        {getLangName(i18n.language)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 flex w-40 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <button
            onClick={() => changeLanguage("en")}
            className="px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("fr")}
            className="px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Français
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className="px-4 py-3 text-left w-full rtl:text-right text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
