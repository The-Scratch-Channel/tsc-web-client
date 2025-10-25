# Welcome To The Scratch Channel

This is the official repo for The Scratch Channel. The Scratch Channel is an unofficial Scratch-related news site, available online at <https://thescratchchannel.vercel.app>

> [!IMPORTANT]
> We are not affiliated with Scratch, the LifeLong Kindergarten Group, or Massachusessets Institute of Technology. News articles here are made by volunteers, not Scratch Team members.

## Deployment

There is no need to deploy this yourself if you do not want to contribute. If you just want to check out our site, you can visit <https://thescratchchannel.vercel.app/> and browse the live version.

## Contributing

There are a variety of ways to contribute to the project, such as:

- Reporting vulnerabilities,
- Developing code,
- Translating UI
- Reporting bugs
- Writing articles

### Reporting vulnerabilities

However, if you find a vulnerability that requires immediate attention, go to the repositories [security tab](https://github.com/The-Scratch-Channel/tsc-web-client/security) to report it. A vulnerability report should contain what file has the vulnerability, what priority it is, and extensive details.

### Development Contribution

- Create a fork of the repository

![Click on the fork button towards the top of the repository home page](https://u.cubeupload.com/GvYoutube/Screenshot2025102012.png)

- Clone your fork

```bash
git clone https://github.com/yourusername/yourforkname.git
cd yourforkname
```

- Modify files 

See the [Developer Guide](#developer-guide) for info about how our code is laid out and how it works

### Translating UI

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

You must be fluent in the language you want to add in order to translate it. Do not use translation tools.

### Writing articles

Create an account then request to become a writer by [making an issue](https://github.com/The-Scratch-Channel/tsc-web-client/issues/new/choose). A database admin will then mark you as a writer and you will be able to write articles at the [write page](http://thescratchchannel.vercel.app/articles/create).

Articles must be written in English and with proper grammar and spelling.

## Developer Guide

<!-- removed -->

## Support

For support on genreal bugs, go to the Issues tab. For Security issues, create a vuneribility report.
