# The Scratch Channel

This is the repository for the brand new Scratch News Channel! Soon, news articles about Scratch and scratchlikes will be posted by writers.


> [!IMPORTANT]
> We are not affiliated with Scratch, the LLK, or MIT. News articles here are made by volunteers, not Scratch Team members.

## Deployment

There is no need to deploy this yourself if you do not want to contribute. If you just want to check out our site, you can visit <https://thescratchchannel.vercel.app/> and browse the live demo.

## Contributing

There are a variety of ways to contribute to the project:

- reporting vulnerabilities
- developing code
- translating UI
- writing articles

### Reporting vulnerabilities

However, if you find a vulnerability that requires immediate attention, go to the repositories [security tab](https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/security) to report it. A vulnerability report should contain what file has the vulnerability, what priority it is, and extensive details.

### Development Contribution

- Create a fork of the repository

![Click on the fork button towards the top of the repository home page](https://u.cubeupload.com/SmartCat3/Screenshot2025041818.png)

- Clone your fork

```bash
git clone https://github.com/yourusername/yourforkname.git
cd yourforkname
```

- code your changes

See the [DeveloperGuide](#developer-guide) for info about how our code is laid out and how it works

### Translating UI

Follow the same steps as above, then go into `src/i18n` and create a json file with the correct two letter language code for the language you want to add. Copy the content of `en.json` as a template then translate the definitions, not the keys. Go into `index.js` and find this part. Import the json file you created then add it in just like with the ones already there.
```jsx
i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: { translation: en }, // English
        eo: { translation: eo }, // Esperanto
        bg: { translation: bg } // Булгарски
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

You must be fluent in the language in order to translate it. Do not use translation tools.

### Writing articles

Create an account then request to become a writer by [making an issue](https://github.com/The-Scratch-Channel/tsc-web-client/issues/new/choose). A database admin will then mark you as a writer and you will be able to write articles at the [write page](http://thescratchchannel.vercel.app/articles/create).

Articles must be written in English and with proper grammar and spelling.

## Developer Guide

The project is static and uses React+Vite, with Firebase as our database and authentication manager.

**Directory Structure**:
<details>
<summary>Directory Structure (very large)</summary>
<code>
.   .codeqlconfig.yml
.   .env.development <- DO NOT GITIGNORE THESE
.   .env.production     They are for Firebase, and we have security rules so that production DB can only be edited on our website.
.   .gitignore
.   CONTRIBUTING.md
.   eslint.config.js
.   gpt.prompt.yml
.   index.html <- no actual code is to be written here
.   LICENSE
.   package-lock.json
.   package.json
.   README.md
.   SECURITY.md
.   tsc.code-workspace
.   vercel.json
.   vite.config.js
.   
+---.github
.   .   labels.yml
.   .   
.   +---ISSUE_TEMPLATE
.   .       bug_report.md
.   .       custom.md
.   .       feature_request.md
.   .       
.   +---workflows
.           auto_label_priority.yml
.           commit_logger.yml
.           inactivity.yml
.           osv-scanner.yml
.           preview.yml
.           summary.yml
.           vercel_check.yml
.                      
+---public
.   .   favicon-new.ico
.   .   favicon-old.ico
.   .   favicon.ico
.   .   
.   +---articles
.           Ignore the stuff in here, its unused 
+---src
.   .   App.jsx
.   .   firebaseConfig.js
.   .   main.jsx
.   .   
.   +---assets
.   .   .   tsc.png
.   .   .   
.   .   +---flags
                Flag icons used on the language select page
.   .           bg.svg
.   .           en.svg
.   .           eo.svg
.   .           
.   +---components
.   .       Footer.jsx
.   .       Header.jsx
.   .       
.   +---context
.   +---i18n
            Translations
.   .       bg.json
.   .       en.json
.   .       eo.json
.   .       index.js
.   .       
.   +---pages
            All the pages on the site
.   .       About.jsx
.   .       Account.jsx
.   .       ArticlePage.jsx
.   .       createArticles.jsx
.   .       Lang.jsx
.   .       Login.jsx
.   .       MainContent.jsx
.   .       MakeAdmin.jsx
.   .       SignUp.jsx
.   .       UserList.jsx
.   .       
.   +---styles
.           CSS files
</code>
</details>

## Support

If you need support and have a GitHub account, you can report issues here. Security Vulnerabilities MUST be reported in the security tab.
