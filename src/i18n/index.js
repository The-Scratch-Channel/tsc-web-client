import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import eo from "./eo.json"

i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: { translation: en }, // English
        eo: { translation: eo } // Esperanto
    },
    fallbackLng: "en",    // fallback if translation is missing
    interpolation: {
        escapeValue: false
    },
    detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
    }
});

export default i18n;
