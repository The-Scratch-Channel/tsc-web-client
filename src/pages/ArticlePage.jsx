import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
  doc, getDoc, updateDoc, increment, setDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ArticlePage() {
  const { filename, category } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userReactions, setUserReactions] = useState({ thumbsUp: false, thumbsDown: false, heart: false });
  const [animate, setAnimate] = useState({ thumbsUp: false, thumbsDown: false, heart: false });
  const [reactions, setReactions] = useState({ thumbsUp: 0, thumbsDown: 0, heart: 0 });

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        getDoc(doc(db, "users", u.uid)).then((snap) => {
          if (snap.exists()) setUserData(snap.data());
          else setUserData(null);
        });
      } else {
        setUserData(null);
      }
    });
  }, []);

  useEffect(() => {
    async function fetchArticle() {
      const docRef = doc(db, "articles", filename);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setArticle(null);
      } else {
        const data = docSnap.data();
        setArticle(data);
        setReactions({
          thumbsUp: data.thumbsUp || 0,
          thumbsDown: data.thumbsDown || 0,
          heart: data.heart || 0,
        });

        if (user) {
          const userDocRef = doc(db, "articles", filename, "reactions", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserReactions(userDoc.data());
          }
        }
      }
      setLoading(false);
    }
    fetchArticle();
  }, [filename, user]);

  const handleReaction = async (type) => {
    if (!user) return;

    const articleRef = doc(db, "articles", filename);
    const userDocRef = doc(db, "articles", filename, "reactions", user.uid);

    if (userReactions[type]) {
      setAnimate((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setAnimate((prev) => ({ ...prev, [type]: false })), 200);

      await updateDoc(articleRef, { [type]: increment(-1) });
      await setDoc(userDocRef, { ...userReactions, [type]: false }, { merge: true });

      setReactions((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
      setUserReactions((prev) => ({ ...prev, [type]: false }));
      return;
    }

    setAnimate((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setAnimate((prev) => ({ ...prev, [type]: false })), 200);

    await updateDoc(articleRef, { [type]: increment(1) });
    await setDoc(userDocRef, { ...userReactions, [type]: true }, { merge: true });

    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReactions((prev) => ({ ...prev, [type]: true }));
  };

  if (loading) return <div>Loading article...</div>;
  if (!article) return <div>Article not found</div>;
  if (article.category !== category) return <div>Category mismatch</div>;

  return (
    <div className="page article-full">
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="meta">
          <span className="author">By: {article.author}</span>
          <span className="date">Date: {article.date}</span>
          <span className="category">Category: {article.category}</span>
        </div>
      </div>

      {article.thumbnail && (
        <div className="article-thumbnail">
          <img src={article.thumbnail} alt="Article thumbnail" />
        </div>
      )}

      <div className="article-full-content" dangerouslySetInnerHTML={{ __html: article.content }} />

      <div className="reactions">
        <button
          className={`reaction-btn ${animate.thumbsUp ? "animate" : ""}`}
          onClick={() => handleReaction("thumbsUp")}
          style={{ color: userReactions.thumbsUp ? "#0d6efd" : "grey" }}
        >
          👍 {reactions.thumbsUp}
        </button>
        <button
          className={`reaction-btn ${animate.thumbsDown ? "animate" : ""}`}
          onClick={() => handleReaction("thumbsDown")}
          style={{ color: userReactions.thumbsDown ? "#dc3545" : "grey" }}
        >
          👎 {reactions.thumbsDown}
        </button>
        <button
          className={`reaction-btn ${animate.heart ? "animate" : ""}`}
          onClick={() => handleReaction("heart")}
          style={{ color: userReactions.heart ? "#ff4081" : "grey" }}
        >
          ❤️ {reactions.heart}
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link to={`/`}>← Back to Categories</Link>
      </div>

      <style>{`
        .reactions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .reaction-btn {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .reaction-btn.animate {
          transform: scale(1.4);
        }
        .article-chat-preview {
          margin-top: 40px;
          max-width: 600px;
        }
        .article-thumbnail img {
          max-width: 100%;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
