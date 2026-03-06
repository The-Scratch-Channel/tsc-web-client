# Reporting security vulnerabilities

If you find a security vulnerability in our code, do not make an issue for it. Instead, go to the [Security tab](https://github.com/The-Scratch-Channel/tsc-web-client/security) and report it there so it's not visible to the public.

## Creating a vunerability
Creating a report is easy, just click the new button and follow the instructions and fill out the required fields.
>[!IMPORTANT]
>PLEASE have GitHub assign a CVE ID to your report. This make it easy to tell other the issue is fixed, once it is.

## TTLLVBTA (Things that look like vulnerabilities but aren't)

- .env files - These are for firebase, and we have controls so that the production database can't be accessed when not on our vercel hosting
- .yml or .yaml files - These are actions for GitHub.
