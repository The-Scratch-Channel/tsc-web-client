# Reporting security vulnerabilities

If you find a security vulnerability in our code, do not make an issue for it. Instead, go to the [Security tab](https://github.com/The-Scratch-Channel/tsc-web-client/security) and report it there so it's not visible to the public.

## Creating a vunerability
Creating a report is easy, here is a guide with images to help.


1. Go to the security tab.</br><img width="1365" height="614" alt="Screenshot 2026-03-06 10 18 14 AM" src="https://github.com/user-attachments/assets/3e0e92ba-8c4d-4565-99e6-93af5658a7ae" />

2. Click the advisories button.</br><img width="290" height="451" alt="Screenshot 2026-03-06 10 18 27 AM" src="https://github.com/user-attachments/assets/c42cda00-94c2-42c1-83a6-f9bd9afb02a3" />

3. Click the button that says to create a new draft.

>[!IMPORTANT]
>PLEASE have GitHub assign a CVE ID to your report. Make sure the CVE Identifier dropdown says to assign one later. </br><img width="282" height="66" alt="image" src="https://github.com/user-attachments/assets/9d2c0554-dd84-49cc-8789-387e4ea81539" /></br>
>Then once the report is made, click Request CVE </br><img width="792" height="225" alt="Screenshot 2026-03-06 10 32 31 AM" src="https://github.com/user-attachments/assets/1da1aa38-ddbd-48c1-9447-55347982f6cc" /></br>
>Then a popup will ask if you really want to. Click the Request button. </br><img width="791" height="225" alt="Screenshot 2026-03-06 10 32 38 AM" src="https://github.com/user-attachments/assets/169afdf3-b139-44e3-a409-bc29a8bc947a" /></br>
>A few minutes (or possibly hours) later, you should get a comment saying "GitHub has issued CVE-{current year}-XXXXX for this Security Advisory after reviewing it for compliance with CVE rules. Once you've published your Security Advisory, we'll publish the CVE to the CVE List.
>Thank you for making the open source ecosystem more secure by fixing and responsibly disclosing this vulnerability."




## TTLLVBTA (Things that look like vulnerabilities but aren't)

- .env files - These are for firebase, and we have controls so that the production database can't be accessed when not on our vercel hosting
- .yml or .yaml files - These are actions for GitHub.
