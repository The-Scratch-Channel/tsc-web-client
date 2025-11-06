import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAeYmYKhCj08KubXcs-wACuAk9LrL1Weyk",

	authDomain: "the-scratch-channel.firebaseapp.com",

	projectId: "the-scratch-channel",

	storageBucket: "the-scratch-channel.firebasestorage.app",

	messagingSenderId: "626573218185",

	appId: "1:626573218185:web:185fe5f77ea45c5e831158",

	measurementId: "G-K7LWFVLSPJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function generateSitemap() {
	const baseUrl = "https://thescratchchannel.vercel.app";

	// 🧱 1. Add your static pages here
	const staticPages = [
		"/", // homepage
		"/about",
		"/lang",
		"/articles/create",
	];

	// Convert to XML entries
	const urls = staticPages.map(
		(path) => `
        <url>
            <loc>${baseUrl}${path}</loc>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>`
	);

	// 📰 2. Fetch and add your dynamic article URLs
	const snapshot = await getDocs(collection(db, "articles"));
	snapshot.forEach((doc) => {
		const data = doc.data();
		if (!data.category) return;

		const category = encodeURIComponent(data.category);
		const articleUrl = `${baseUrl}/${category}/article/${doc.id}`;

		const lastmod = data.createdAt?.toDate
			? data.createdAt.toDate().toISOString().split("T")[0]
			: data.date || "";

		urls.push(`
        <url>
            <loc>${articleUrl}</loc>
            ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>`);
	});

	// 🗺️ 3. Wrap into sitemap structure
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
    </urlset>`;

	fs.writeFileSync("public/sitemap.xml", xml);
	console.log(`✅ Sitemap generated with ${urls.length} URLs`);
}

generateSitemap().catch(console.error);
