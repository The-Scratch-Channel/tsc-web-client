import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
  doc, getDoc, updateDoc, increment, setDoc, collection, addDoc,
  query, orderBy, onSnapshot, serverTimestamp, deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs";

export default function ArticlePage() {
  const [ t, i18n ] = useTranslation();
  const { filename, category } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // For admin check
  const [userReactions, setUserReactions] = useState({ thumbsUp: false, thumbsDown: false, heart: false });
  const [animate, setAnimate] = useState({ thumbsUp: false, thumbsDown: false, heart: false });
  const [reactions, setReactions] = useState({ thumbsUp: 0, thumbsDown: 0, heart: 0 });

  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyInput, setReplyInput] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState("");
  const [toxicityModel, setToxicityModel] = useState(null);
  const [reportStatus, setReportStatus] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Fetch user data for admin check
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

    // If user already reacted, remove the reaction (decrement)
    if (userReactions[type]) {
      setAnimate((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setAnimate((prev) => ({ ...prev, [type]: false })), 200);

      await updateDoc(articleRef, { [type]: increment(-1) });
      await setDoc(userDocRef, { ...userReactions, [type]: false }, { merge: true });

      setReactions((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
      setUserReactions((prev) => ({ ...prev, [type]: false }));
      return;
    }

    // Otherwise add the reaction (increment)
    setAnimate((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setAnimate((prev) => ({ ...prev, [type]: false })), 200);

    await updateDoc(articleRef, { [type]: increment(1) });
    await setDoc(userDocRef, { ...userReactions, [type]: true }, { merge: true });

    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReactions((prev) => ({ ...prev, [type]: true }));
  };

  // Chat logic
  useEffect(() => {
    toxicity.load(0.85).then(model => setToxicityModel(model));
  }, []);

  useEffect(() => {
    if (!filename) return;
    const q = query(
      collection(db, "chats", filename, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [filename]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper: Build flat comments and replies (only 1 level of nesting)
  function buildFlatComments(msgs) {
    const map = {};
    const roots = [];
    msgs.forEach(msg => {
      map[msg.id] = { ...msg, replies: [] };
    });
    msgs.forEach(msg => {
      if (msg.parentId) {
        if (map[msg.parentId]) map[msg.parentId].replies.push(map[msg.id]);
      } else {
        roots.push(map[msg.id]);
      }
    });
    // Only allow 1 level of nesting
    roots.forEach(root => {
      root.replies.forEach(reply => {
        reply.replies = []; // Remove deeper nesting
      });
    });
    return roots;
  }

  const flatComments = buildFlatComments(messages);

  const sendMessage = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("You have to be logged in to comment.");
      return;
    }
    if (!input.trim()) return;

    if (toxicityModel) {
      const predictions = await toxicityModel.classify([input]);
      const isToxic = predictions.some(
        p => p.results[0].match === true
      );
      if (isToxic) {
        setError("Your message was detected as inappropriate. Please revise.");
        return;
      }
    }

    await addDoc(collection(db, "chats", filename, "messages"), {
      text: input,
      username: user.displayName || user.email || "Anonymous",
      uid: user.uid,
      createdAt: serverTimestamp(),
      reports: 0,
      parentId: null
    });
    setInput("");
  };

  const sendReply = async (parentId) => {
    setError("");
    if (!user) {
      setError("You have to be logged in to comment.");
      return;
    }
    const replyText = replyInput[parentId];
    if (!replyText || !replyText.trim()) return;

    if (toxicityModel) {
      const predictions = await toxicityModel.classify([replyText]);
      const isToxic = predictions.some(
        p => p.results[0].match === true
      );
      if (isToxic) {
        setError("Your message was detected as inappropriate. Please revise.");
        return;
      }
    }

    await addDoc(collection(db, "chats", filename, "messages"), {
      text: replyText,
      username: user.displayName || user.email || "Anonymous",
      uid: user.uid,
      createdAt: serverTimestamp(),
      reports: 0,
      parentId
    });
    setReplyInput((prev) => ({ ...prev, [parentId]: "" }));
    setReplyingTo(null);
  };

  const handleReport = async (msgId, currentReports) => {
    if (!user) return;
    if (reportStatus[msgId]) return; // Prevent multiple reports by same user in session

    const msgRef = doc(db, "chats", filename, "messages", msgId);
    const newReports = (currentReports || 0) + 1;
    if (newReports >= 2) {
      await deleteDoc(msgRef);
    } else {
      await updateDoc(msgRef, { reports: increment(1) });
    }
    setReportStatus((prev) => ({ ...prev, [msgId]: true }));
  };

  const handleDeleteComment = async (msgId) => {
    if (!userData?.writer) return;
    await deleteDoc(doc(db, "chats", filename, "messages", msgId));
  };

  // Render a single comment and its replies (1 level of nesting)
  function renderComment(msg) {
    return (
      <div key={msg.id} className="comment-container">
        <div className={`message ${msg.uid === user?.uid ? "own" : ""}`}>
          <span className="username">{msg.username}:</span>
          <span className="text">{msg.text}</span>
          <button
            className="report-btn"
            onClick={() => handleReport(msg.id, msg.reports)}
            disabled={!!reportStatus[msg.id]}
            title={reportStatus[msg.id] ? "Already reported" : "Report this comment"}
          >
            🚩 report
          </button>
          <span className="report-count">{msg.reports > 0 ? `(${msg.reports})` : ""}</span>
          <button
            className="reply-btn"
            onClick={() => setReplyingTo(msg.id)}
            title="Reply"
          >
            ↩ reply
          </button>
          {userData?.writer && (
            <button
              className="delete-btn"
              onClick={() => handleDeleteComment(msg.id)}
              title="Delete comment"
            >
              🗑️ delete
            </button>
          )}
        </div>
        {replyingTo === msg.id && (
          <form
            className="reply-form"
            onSubmit={e => {
              e.preventDefault();
              sendReply(msg.id);
            }}
          >
            <input
              type="text"
              value={replyInput[msg.id] || ""}
              onChange={e => setReplyInput(prev => ({ ...prev, [msg.id]: e.target.value }))}
              placeholder="Type your reply..."
              maxLength={300}
              required
              disabled={!toxicityModel}
              autoFocus
            />
            <button type="submit" disabled={!toxicityModel}>Reply</button>
            <button type="button" onClick={() => setReplyingTo(null)}>Cancel</button>
          </form>
        )}
        {msg.replies && msg.replies.length > 0 && (
          <div className="replies">
            {msg.replies.map(reply => (
              <div key={reply.id} className="comment-container reply-indent">
                <div className={`message ${reply.uid === user?.uid ? "own" : ""}`}>
                  <span className="username">{reply.username}:</span>
                  <span className="text">{reply.text}</span>
                  <button
                    className="report-btn"
                    onClick={() => handleReport(reply.id, reply.reports)}
                    disabled={!!reportStatus[reply.id]}
                    title={reportStatus[reply.id] ? "Already reported" : "Report this comment"}
                  >
                    🚩 report
                  </button>
                  <span className="report-count">{reply.reports > 0 ? `(${reply.reports})` : ""}</span>
                  <button
                    className="reply-btn"
                    onClick={() => setReplyingTo(msg.id)}
                    title="Reply"
                  >
                    ↩ reply
                  </button>
                  {userData?.writer && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteComment(reply.id)}
                      title="Delete comment"
                    >
                      🗑️ delete
                    </button>
                  )}
                </div>
                {replyingTo === reply.id && (
                  <form
                    className="reply-form"
                    onSubmit={e => {
                      e.preventDefault();
                      sendReply(msg.id); // Always reply to the root comment
                    }}
                  >
                    <input
                      type="text"
                      value={replyInput[reply.id] || ""}
                      onChange={e => setReplyInput(prev => ({ ...prev, [reply.id]: e.target.value }))}
                      placeholder="Type your reply..."
                      maxLength={300}
                      required
                      disabled={!toxicityModel}
                      autoFocus
                    />
                    <button type="submit" disabled={!toxicityModel}>Reply</button>
                    <button type="button" onClick={() => setReplyingTo(null)}>Cancel</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div>Loading article...</div>;
  if (!article) return <div>Article not found</div>;
  if (article.category !== category) return <div>Category mismatch</div>;

  return (
    <div className="page article-full">
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="meta">
          <span className="author">{t("main.by")}: {article.author}</span>
          <span className="date">{t("main.date")}: {article.date}</span>
          <span className="category">{t("main.category")}: {article.category}</span>
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

      {/* Chat Section */}
      <div className="article-chat-preview">
        <h2>Comments</h2>
        <div className="chat-container">
          {/* Write comment section */}
          {user ? (
            <form className="chat-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Write a comment..."
                maxLength={300}
                required
                disabled={!toxicityModel}
              />
              <button type="submit" disabled={!toxicityModel}>Send</button>
            </form>
          ) : (
            <div className="login-message">You have to be logged in to comment.</div>
          )}
          <div className="messages" style={{ maxHeight: 400, overflowY: "auto" }}>
            {flatComments.map(msg => renderComment(msg))}
            <div ref={messagesEndRef} />
          </div>
          {error && <div className="error-message">{error}</div>}
          {!toxicityModel && <div className="loading-message">Loading moderation model...</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Link to={`/`}>← Back to Categories</Link>
        </div>
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
        .chat-container {
          border: 1px solid #eee;
          border-radius: 8px;
          background: #fafbfc;
          padding: 16px;
        }
        .messages {
          margin-top: 16px;
        }
        .comment-container {
          margin-bottom: 16px;
          padding: 0;
        }
        .reply-indent {
          margin-left: 32px;
        }
        .message {
          padding: 8px 10px;
          border-radius: 6px;
          background: #f1f3f7;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .message.own {
          background: #d1e7ff;
          align-self: flex-end;
        }
        .username {
          font-weight: bold;
          color: #0d6efd;
        }
        .text {
          color: #222;
        }
        .report-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 16px;
          margin-left: 8px;
        }
        .report-btn:disabled {
          color: #aaa;
          cursor: not-allowed;
        }
        .report-count {
          font-size: 12px;
          color: #dc3545;
          margin-left: 2px;
        }
        .reply-btn {
          background: none;
          border: none;
          color: #0d6efd;
          cursor: pointer;
          font-size: 16px;
          margin-left: 8px;
        }
        .reply-btn:hover {
          color: #0b5ed7;
        }
        .delete-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 16px;
          margin-left: 8px;
        }
        .delete-btn:hover {
          color: #dc3545;
        }
        .reply-form {
          display: flex;
          gap: 8px;
          margin: 8px 0 8px 0;
        }
        .reply-form input {
          flex: 1;
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .reply-form button {
          padding: 6px 12px;
          border: none;
          background: #0d6efd;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .reply-form button[type="button"] {
          background: #aaa;
        }
        .reply-form button:disabled {
          background: #aaa;
          cursor: not-allowed;
        }
        .reply-form button:hover:enabled {
          background: #0b5ed7;
        }
        .replies {
          margin-left: 0;
        }
        .chat-form {
          display: flex;
          gap: 8px;
          width: 100%;
        }
        .chat-form input {
          flex: 1;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          width: 100%;
        }
        .chat-form button {
          padding: 8px 16px;
          border: none;
          background: #0d6efd;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .chat-form button:disabled {
          background: #aaa;
          cursor: not-allowed;
        }
        .chat-form button:hover:enabled {
          background: #0b5ed7;
        }
        .login-message {
          color: #888;
          text-align: center;
          margin: 12px 0;
        }
        .error-message {
          color: #dc3545;
          margin-top: 8px;
          text-align: center;
        }
        .loading-message {
          color: #888;
          margin-top: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
