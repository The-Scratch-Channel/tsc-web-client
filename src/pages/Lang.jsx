import React from "react";
import { useTranslation } from "react-i18next";

export default function LangPage() {
    const { t, i18n } = useTranslation();

    const switchLanguage = (lang) => {
        i18n.changeLanguage(lang);
    }
    return (
        <>
        <p>{t("misc.chooselang")}</p>
        <button onClick={() => switchLanguage("en")}>English</button>
        <button onClick={() => switchLanguage("eo")}>Esperanto</button>
        </>
    )
}