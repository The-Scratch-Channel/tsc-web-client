# Architecture

The site is written in React+Vite, and we use Firebase for authentication and the database.

## Front-end

Here is a directory structure:

```
├── .github // This is mostly for stuff like github actions. If you're just developing the site you can ignore it
│   ├── ISSUE_TEMPLATE
│   │   ├── bug_report.md
│   │   ├── custom.md
│   │   └── feature_request.md
│   ├── workflows
│   │   ├── auto_label_priority.yml
│   │   ├── commit_logger.yml
│   │   ├── inactivity.yml
│   │   ├── preview.yml
│   │   ├── sitemap.yml
│   │   ├── summary.yml
│   │   ├── test.yml
│   │   └── vercel_check.yml
│   ├── dependabotupdates.yml
│   └── labels.yml
├── public // assets that aren't directly referenced in the jsx files. so at the moment only favicon and sitemap should be here.
│   ├── LICENSE
│   ├── favicon-new.ico
│   ├── favicon-old.ico
│   ├── favicon.ico
│   └── sitemap.xml
├── src // most of the code is here
│   ├── assets // assets that are directly referenced in the jsx should be put here.
│   │   ├── flags (SVG files for different languages, shown in the language select page)
│   │   └── tsc.png
│   ├── components // react components that arent full pages.
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   ├── i18n // Translation files
│   │   ├── bg.json
│   │   ├── en.json
│   │   ├── eo.json
│   │   ├── hb.json
│   │   ├── index.js
│   │   ├── lol.json
│   │   └── rbe.json
│   ├── pages // routes
│   │   ├── About.jsx
│   │   ├── Account.jsx
│   │   ├── ArticlePage.jsx
│   │   ├── Lang.jsx
│   │   ├── Login.jsx
│   │   ├── MainContent.jsx
│   │   ├── MakeAdmin.jsx
│   │   ├── SignUp.jsx
│   │   ├── UserList.jsx
│   │   └── createArticles.jsx
│   ├── styles (CSS files)
│   ├── App.jsx // mostly only defines the routes for the sites.
│   ├── firebaseConfig.js // contains basic configuration for firebase
│   └── main.js // no reason to edit, its just standard procedure for that to import app.jsx
├── Configuration files (in root, no need to edit unless you know what you're doing.)
│   ├── .codeqlconfig.yml
│   ├── .env.development
│   ├── .env.production
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── gpt.prompt.yml
│   ├── package.json
│   ├── package-lock.json
│   ├── tsc.code-workspace
│   ├── vercel.json
│   └── vite.config.js
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── generate-sitemap.js // a node script thats run by a github action to update the sitemap every 4 hours automatically
└── index.html // only put stuff that should be edited in the head in here. in react you do not generally edit the body of index.html.
```
