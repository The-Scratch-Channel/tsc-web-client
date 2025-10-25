# Translating The Scratch Channel

Follow the same steps as above, then go into `src/i18n` and create a json file with the correct two letter language code for the language you want to add. Copy the content of `en.json` as a template then translate the definitions, not the keys. Go into `index.js` and find this part. Import the json file you created then add it in just like with the ones already there.

```jsx
i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: { translation: en }, // English
        eo: { translation: eo }, // Esperanto
        bg: { translation: bg } // Булгарски
        // insert your language here!
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
```