import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function MainContent() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [articlesByCategory, setArticlesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [animate, setAnimate] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      const snapshot = await getDocs(collection(db, "articles"));
      const grouped = {};

      for (let docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;
        const article = {
          id,
          title: data.title,
          author: data.author,
          date: data.date,
          category: data.category,
          preview: data.preview || "",
          thumbnail: data.thumbnail || "",
          content: data.content || "",
          reactions: {
            thumbsUp: data.thumbsUp || 0,
            thumbsDown: data.thumbsDown || 0,
            heart: data.heart || 0,
          },
        };

        if (!grouped[article.category]) grouped[article.category] = [];
        grouped[article.category].push(article);

        // fetch user reactions if logged in
        if (user) {
          const userDocRef = doc(db, "articles", id, "reactions", user.uid);
          const userDoc = await getDoc(userDocRef);
          setUserReactions((prev) => ({
            ...prev,
            [id]: userDoc.exists() ? userDoc.data() : { thumbsUp: false, thumbsDown: false, heart: false },
          }));
        }
      }

      setCategories(Object.keys(grouped));
      setArticlesByCategory(grouped);
    }

    fetchArticles();
  }, [user]);

  const handleReaction = async (articleId, type) => {
    if (!user) return;
    if (userReactions[articleId]?.[type]) return;

    setAnimate((prev) => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: true } }));
    setTimeout(() => setAnimate((prev) => ({ ...prev, [articleId]: { ...(prev[articleId] || {}), [type]: false } })), 200);

    const articleRef = doc(db, "articles", articleId);
    await updateDoc(articleRef, { [type]: increment(1) });

    const userDocRef = doc(db, "articles", articleId, "reactions", user.uid);
    await setDoc(userDocRef, { ...(userReactions[articleId] || {}), [type]: true }, { merge: true });

    setUserReactions((prev) => ({
      ...prev,
      [articleId]: { ...(prev[articleId] || {}), [type]: true },
    }));

    setArticlesByCategory((prev) => {
      const updated = { ...prev };
      for (let cat in updated) {
        updated[cat] = updated[cat].map(a => a.id === articleId ? { ...a, reactions: { ...a.reactions, [type]: a.reactions[type] + 1 } } : a);
      }
      return updated;
    });
  };

  if (!selectedCategory) {
    return (
      <div className="page">
        <h1 style={{ textAlign: "center" }}>{t("main.welcome")}</h1>
        <div className="categories-container">
          {categories.map((cat) => (
            <div key={cat} className="category-card" onClick={() => setSelectedCategory(cat)}>
              {cat} ({articlesByCategory[cat]?.length || 0})
            </div>
          ))}
        </div>
      </div>
    );
  }

  const articles = articlesByCategory[selectedCategory] || [];

  return (
    <div className="page">
      <h1 style={{ textAlign: "center" }}>{selectedCategory}</h1>
      <button className="back-btn" onClick={() => setSelectedCategory(null)}>← {t("main.back-cat")}</button>

      <div className="articles-container">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            {article.thumbnail && <div className="card-thumbnail"><img src={article.thumbnail} alt="" loading="lazy" /></div>}
            <div className="card-header">
              <h3>{article.title}</h3>
              <div className="meta">
                <span className="author">{t("main.by")}: {article.author}</span>
                <span className="date">{t("main.date")}: {article.date}</span>
              </div>
            </div>
            <div className="card-content"><center>{article.content.replace("<p>", "").replace("</p>", "")}</center></div>
            <div className="reactions">
              <button
                className={`reaction-btn ${animate[article.id]?.thumbsUp ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "thumbsUp")}
                style={{ color: userReactions[article.id]?.thumbsUp ? "#0d6efd" : "grey" }}
              >
                👍 {article.reactions.thumbsUp}
              </button>
              <button
                className={`reaction-btn ${animate[article.id]?.thumbsDown ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "thumbsDown")}
                style={{ color: userReactions[article.id]?.thumbsDown ? "#dc3545" : "grey" }}
              >
                👎 {article.reactions.thumbsDown}
              </button>
              <button
                className={`reaction-btn ${animate[article.id]?.heart ? "animate" : ""}`}
                onClick={() => handleReaction(article.id, "heart")}
                style={{ color: userReactions[article.id]?.heart ? "#ff4081" : "grey" }}
              >
                ❤️ {article.reactions.heart}
              </button>
            </div>
            <div className="read-more" onClick={() => navigate(`${selectedCategory}/article/${article.id}`)}>{t("main.readmore")} →</div>
          </div>
        ))}
      </div>

      <style>{`
        .reactions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }
        .reaction-btn {
          font-size: 15px;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .reaction-btn.animate {
          transform: scale(1.4);
        }
      `}</style>
    </div>
  );
}