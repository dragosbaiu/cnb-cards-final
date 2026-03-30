import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

export function useTranslation() {
  const { language } = useContext(LanguageContext);

  const t = (key) => {
    return translations[language]?.[key] ?? key;
  };

  return { t, language };
}
