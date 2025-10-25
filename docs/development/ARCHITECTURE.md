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

We have no plans to switch our frameworks or to TypeScript so please do not suggest or add that.

## Back-end

We use Firebase as our Backend-as-a-service solution. As with our front end, we have no plans to change it.

@nouxinf is the Database Admin, any direct modifications to the database should be requested to him.

There are two used collections:

- `articles`
- `users`

Articles stores each article as the name suggests. Here are the fields as an example:

```
category "Scratch News"
content "It's official. You can now set custom thumbnails without using chrome extensions. This let's you set the projects screen as the thumbnail."
createdAt 25 August 2025 at 20:57:54 UTC+1
date "2025-08-25"
confetti 1
heart 2
thumbsDown 1
thumbsUp 4
title "Custom thumbnail update out now
```

The other one, users, stores some information about every user who has signed up. It looks like so:

```
banned true
createdAt 17 October 2025 at 18:23:57 UTC+1
email "chirapa@celestre.com"
username "test"
writer true 
```

The reason the username is stored here is because Firebase authentication does not actually have a field for usernames, so they have to be stored separately.

There is another one, chats. It is unused as the commenting feature has been removed.
