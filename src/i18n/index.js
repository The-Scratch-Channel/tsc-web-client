import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import es from "./es.json";
import eo from "./eo.json";
import bg from "./bg.json";
import lol from "./lol.json";
import rbe from "./rbe.json";
import hb from "./hb.json";

i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: { translation: en }, // English
        es: { translation: es }, // spanish
        eo: { translation: eo }, // Esperanto
        bg: { translation: bg }, // Булгарски
        lol: { translation: lol }, // LOLCAT
        rbe: { translation: rbe }, // Rock-Bottomese
        hb: { translation: hb } //[[Hyberlink Blocked]]
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
