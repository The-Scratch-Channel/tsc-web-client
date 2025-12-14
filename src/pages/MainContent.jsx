import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import sanitizeHtml from "sanitize-html";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	increment,
	setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function MainContent() {
	const [categories, setCategories] = useState([]); // all categories
	const [articlesByCategory, setArticlesByCategory] = useState({}); // articles grouped by category
	const [selectedCategory, setSelectedCategory] = useState(null); // currently selected category
	const [user, setUser] = useState(null); // logged-in user
	const [profile, setProfile] = useState(null); // user profile with admin status
	const [userReactions, setUserReactions] = useState({}); // current user's reactions
	const [animate, setAnimate] = useState({}); // animation for reactions
	const [stats, setStats] = useState({ totalArticles: 0, totalUsers: 0 }); // admin stats
	const navigate = useNavigate();
	const [t] = useTranslation();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				const userDoc = await getDoc(
					doc(db, "users", firebaseUser.uid)
				);
				if (userDoc.exists()) {
					setProfile(userDoc.data());
				}
			} else {
				setUser(null);
				setProfile(null);
			}
		});
		return () => unsubscribe();
	}, []);

	// Fetch articles from Firestore
	useEffect(() => {
		async function fetchArticles() {
			const snapshot = await getDocs(collection(db, "articles"));
			const grouped = {};
			let articleCount = 0;

			for (let docSnap of snapshot.docs) {
				articleCount++;
				const data = docSnap.data();
				const id = docSnap.id;
				let thumbnail = data.thumbnail || "";
				let contentHtml = data.content || "";

				// Remove all images except the first one
				if (typeof document !== "undefined") {
					const wrapper = document.createElement("div");
					wrapper.innerHTML = contentHtml;
					const imgs = wrapper.getElementsByTagName("img");
					if (imgs.length > 0 && !thumbnail) thumbnail = imgs[0].src;
					Array.from(wrapper.getElementsByTagName("img")).forEach(
						(img) => img.remove()
					);
					contentHtml = wrapper.innerHTML;
				}

				const article = {
					id,
					title: data.title,
					author: data.author,
					date: data.date,
					category: data.category,
					thumbnail,
					content: contentHtml,
					reactions: {
						thumbsUp: data.thumbsUp || 0,
						thumbsDown: data.thumbsDown || 0,
						heart: data.heart || 0,
						confetti: data.confetti || 0,
						sad: data.sad || 0,
					},
				};

				if (!grouped[article.category]) grouped[article.category] = [];
				grouped[article.category].push(article);

				if (user) {
					const userDoc = await getDoc(
						doc(db, "articles", id, "reactions", user.uid)
					);
					setUserReactions((prev) => ({
						...prev,
						[id]: userDoc.exists() ? userDoc.data() : {},
					}));
				}
			}

			setCategories(Object.keys(grouped));
			setArticlesByCategory(grouped);
			setStats((prev) => ({ ...prev, totalArticles: articleCount }));

			// Fetch user count for admin stats
			if (profile?.writer) {
				const usersSnapshot = await getDocs(collection(db, "users"));
				setStats((prev) => ({
					...prev,
					totalUsers: usersSnapshot.size,
				}));
			}
		}
		fetchArticles();
	}, [user, profile?.writer]);

	const stripHtml = (html) =>
		html ? sanitizeHtml(html, { allowedTags: [] }) : "";
	const makeSnippet = (html, max = 300) =>
		stripHtml(html).slice(0, max) +
		(stripHtml(html).length > max ? "..." : "");

	const handleReaction = async (articleId, type) => {
		if (!user || userReactions[articleId]?.[type]) return;
		setAnimate((prev) => ({
			...prev,
			[articleId]: { ...(prev[articleId] || {}), [type]: true },
		}));
		setTimeout(
			() =>
				setAnimate((prev) => ({
					...prev,
					[articleId]: { ...(prev[articleId] || {}), [type]: false },
				})),
			200
		);

		await updateDoc(doc(db, "articles", articleId), {
			[type]: increment(1),
		});
		await setDoc(
			doc(db, "articles", articleId, "reactions", user.uid),
			{ [type]: true },
			{ merge: true }
		);

		setUserReactions((prev) => ({
			...prev,
			[articleId]: { ...(prev[articleId] || {}), [type]: true },
		}));
		setArticlesByCategory((prev) => {
			const updated = { ...prev };
			for (let cat in updated) {
				updated[cat] = updated[cat].map((a) =>
					a.id === articleId
						? {
								...a,
								reactions: {
									...a.reactions,
									[type]: a.reactions[type] + 1,
								},
							}
						: a
				);
			}
			return updated;
		});
	};

	if (!selectedCategory) {
		const allArticles = Object.values(articlesByCategory).flat();
		allArticles.sort(
			(a, b) =>
				(b.reactions.thumbsUp + b.reactions.heart || 0) -
				(a.reactions.thumbsUp + a.reactions.heart || 0)
		);
		const topArticles = allArticles.slice(0, 6); // top 6 by likes + hearts

		return (
			<>
				<div id="categories-header">
					<div className="categories-container">
						{categories.map((cat) => (
							<div
								key={cat}
								className="category-card"
								onClick={() => setSelectedCategory(cat)}
							>
								{cat} ({articlesByCategory[cat]?.length || 0})
							</div>
						))}
					</div>
				</div>
				<div className="page">
					<h1 style={{ textAlign: "center" }}>{t("main.welcome")}</h1>
					<a style={{ textAlign: "center"}} href="/tracksanta" class="tracksanta"> {t("main.tracksanta")}</a>

					{/* Admin Panel - Only visible to admins */}
					{profile?.writer && (
						<div className="admin-panel">
							<div className="admin-panel-header">
								<center>
									<h2>Admin Panel</h2>
								</center>
								<span className="admin-badge">
									Administrator
								</span>
							</div>
							<div className="admin-stats">
								<div className="stat-card">
									<div className="stat-value">
										{stats.totalArticles}
									</div>
									<div className="stat-label">
										Total Articles
									</div>
								</div>
								<div className="stat-card">
									<div className="stat-value">
										{stats.totalUsers}
									</div>
									<div className="stat-label">
										Total Users
									</div>
								</div>
								<div className="stat-card">
									<div className="stat-value">
										{categories.length}
									</div>
									<div className="stat-label">Categories</div>
								</div>
							</div>
							<div className="admin-actions">
								<button
									className="admin-action-btn primary"
									onClick={() => navigate("/articles/create")}
								>
									Write Article
								</button>
								<button
									className="admin-action-btn secondary"
									onClick={() => navigate("/admin/users")}
								>
									Manage Users
								</button>
							</div>
						</div>
					)}

					<div className="articles-container">
						{topArticles.map((article) => (
							<div key={article.id} className="article-card">
								{article.thumbnail && (
									<div className="card-thumbnail">
										<img
											src={article.thumbnail}
											alt=""
											loading="lazy"
										/>
									</div>
								)}
								<div className="card-header">
									<h3>{article.title}</h3>
									<div className="meta">
										<span>
											{t("main.by")}: {article.author}
										</span>
										<span>
											{t("main.date")}: {article.date}
										</span>
									</div>
								</div>
								<div className="card-content">
									<p>{makeSnippet(article.content)}</p>
								</div>
								<div className="reactions">
									<button
										className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
										onClick={() =>
											handleReaction(
												article.id,
												"thumbsUp"
											)
										}
										style={{
											color: userReactions[article.id]
												?.thumbsUp
												? "#0d6efd"
												: "grey",
										}}
									>
										👍 {article.reactions.thumbsUp}
									</button>
									<button
										className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
										onClick={() =>
											handleReaction(
												article.id,
												"thumbsDown"
											)
										}
										style={{
											color: userReactions[article.id]
												?.thumbsDown
												? "#dc3545"
												: "grey",
										}}
									>
										👎 {article.reactions.thumbsDown}
									</button>
									<button
										className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
										onClick={() =>
											handleReaction(article.id, "heart")
										}
										style={{
											color: userReactions[article.id]
												?.heart
												? "#ff4081"
												: "grey",
										}}
									>
										❤️ {article.reactions.heart}
									</button>
									<button
										className={`reaction-btn ${animate[article.id]?.confetti ? "animate" : ""}`}
										onClick={() =>
											handleReaction(
												article.id,
												"confetti"
											)
										}
										style={{
											color: userReactions[article.id]
												?.confetti
												? "#0d6efd"
												: "grey",
										}}
									>
										🎉 {article.reactions.confetti}
									</button>
									<button
										className={`reaction-btn ${animate[article.id]?.sad ? "animate" : ""}`}
										onClick={() =>
											handleReaction(article.id, "sad")
										}
										style={{
											color: userReactions[article.id]
												?.sad
												? "#0d6efd"
												: "grey",
										}}
									>
										😭 {article.reactions.sad}
									</button>
								</div>
								<div
									className="read-more"
									onClick={() =>
										navigate(
											`${article.category}/article/${article.id}`
										)
									}
								>
									{t("main.readmore")} →
								</div>
							</div>
						))}
					</div>
				</div>
				<style>{`
          .admin-panel {
            background: linear-gradient(135deg, var(--highlight-color) 0%, var(--secondary-highlight-color) 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 24px auto;
            max-width: var(--content-width);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            color: white;
          }

          .admin-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .admin-panel-header h2 {
            color: white;
            margin: 0;
            font-size: 1.8rem;
          }

          .admin-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
          }

          .admin-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
          }

          .stat-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            transition: transform 0.2s;
          }

          .stat-card:hover {
            transform: translateY(-4px);
            background: rgba(255, 255, 255, 0.2);
          }

          .stat-value {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
          }

          .admin-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .admin-action-btn {
            flex: 1;
            min-width: 150px;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
          }

          .admin-action-btn.primary {
            background: white;
            color: var(--highlight-color);
          }

          .admin-action-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .admin-action-btn.secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
          }

          .admin-action-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }

          @media (max-width: 768px) {
            .admin-panel {
              padding: 16px;
            }

            .admin-panel-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }

            .admin-stats {
              grid-template-columns: 1fr;
            }

            .admin-actions {
              flex-direction: column;
            }

            .admin-action-btn {
              width: 100%;
            }
          }
        `}</style>
			</>
		);
	}

	const articles = articlesByCategory[selectedCategory] || [];

	return (
		<div className="page">
			<h1 style={{ textAlign: "center" }}>{selectedCategory}</h1>
			<button
				className="back-btn"
				onClick={() => setSelectedCategory(null)}
			>
				← {t("main.back-cat")}
			</button>
			<div className="articles-container">
				{articles.map((article) => (
					<div key={article.id} className="article-card">
						{article.thumbnail && (
							<div className="card-thumbnail">
								<img
									src={article.thumbnail}
									alt=""
									loading="lazy"
								/>
							</div>
						)}
						<div className="card-header">
							<h3>{article.title}</h3>
							<div className="meta">
								<span>
									{t("main.by")}: {article.author}
								</span>
								<span>
									{t("main.date")}: {article.date}
								</span>
							</div>
						</div>
						<div className="card-content">
							<p>{makeSnippet(article.content)}</p>
						</div>
						<div className="reactions">
							<button
								className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
								onClick={() =>
									handleReaction(article.id, "thumbsUp")
								}
								style={{
									color: userReactions[article.id]?.thumbsUp
										? "#0d6efd"
										: "grey",
								}}
							>
								👍 {article.reactions.thumbsUp}
							</button>
							<button
								className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
								onClick={() =>
									handleReaction(article.id, "thumbsDown")
								}
								style={{
									color: userReactions[article.id]?.thumbsDown
										? "#dc3545"
										: "grey",
								}}
							>
								👎 {article.reactions.thumbsDown}
							</button>
							<button
								className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
								onClick={() =>
									handleReaction(article.id, "heart")
								}
								style={{
									color: userReactions[article.id]?.heart
										? "#ff4081"
										: "grey",
								}}
							>
								❤️ {article.reactions.heart}
							</button>
							<button
								className={`reaction-btn ${animate[article.id]?.confetti ? "animate" : ""}`}
								onClick={() =>
									handleReaction(article.id, "confetti")
								}
								style={{
									color: userReactions[article.id]?.confetti
										? "#0d6efd"
										: "grey",
								}}
							>
								🎉 {article.reactions.confetti}
							</button>
							<button
								className={`reaction-btn ${animate[article.id]?.sad ? "animate" : ""}`}
								onClick={() =>
									handleReaction(article.id, "sad")
								}
								style={{
									color: userReactions[article.id]?.sad
										? "#0d6efd"
										: "grey",
								}}
							>
								😭 {article.reactions.sad}
							</button>
						</div>
						<div
							className="read-more"
							onClick={() =>
								navigate(
									`${selectedCategory}/article/${article.id}`
								)
							}
						>
							{t("main.readmore")} →
						</div>
					</div>
				))}
			</div>
			<style>{`
        .reactions { display: flex; gap: 12px; margin-top: 10px; }
        .reaction-btn { font-size: 15px; background: none; border: none; cursor: pointer; transition: transform 0.2s; }
        .reaction-btn.animate { transform: scale(1.4); }
      `}</style>
		</div>
	);
}
