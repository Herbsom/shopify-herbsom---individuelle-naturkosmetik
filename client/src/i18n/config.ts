import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { bindDocumentDirection } from "./direction";

// Import translation files
import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import sv from "./locales/sv.json";
import nl from "./locales/nl.json";

const resources = {
  de: { translation: de },
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
  sv: { translation: sv },
  nl: { translation: nl },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    supportedLngs: ["de", "en", "fr", "ar", "sv", "nl"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })
  .then(() => {
    bindDocumentDirection(i18n);
  });

export default i18n;
