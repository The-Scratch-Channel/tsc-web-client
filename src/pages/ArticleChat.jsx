import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs";

export default function ArticleChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [toxicityModel, setToxicityModel] = useState(null);
  const [reportStatus, setReportStatus] = useState({});
  const messagesEndRef = useRef(null);
  const { category, filename } = useParams();

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
      reports: 0
    });
    setInput("");
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

  return (
    <div className="chat-page">
      <h2>Article Chat</h2>
      <div className="chat-container">
        <div className="messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message ${msg.uid === user?.uid ? "own" : ""}`}
            >
              <span className="username">{msg.username}:</span>
              <span className="text">{msg.text}</span>
              <button
                className="report-btn"
                onClick={() => handleReport(msg.id, msg.reports)}
                disabled={!!reportStatus[msg.id]}
                title={reportStatus[msg.id] ? "Already reported" : "Report this comment"}
              >
                🚩
              </button>
              <span className="report-count">{msg.reports > 0 ? `(${msg.reports})` : ""}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {user ? (
          <form className="chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              maxLength={300}
              required
              disabled={!toxicityModel}
            />
            <button type="submit" disabled={!toxicityModel}>Send</button>
          </form>
        ) : (
          <div className="login-message">You have to be logged in to comment.</div>
        )}
        {error && <div className="error-message">{error}</div>}
        {!toxicityModel && <div className="loading-message">Loading moderation model...</div>}
      </div>
      <div style={{ marginTop: 20 }}>
        <Link to={`/${category}/article/${filename}`}>← Back to Article</Link>
      </div>
      <style>{`
        .chat-page {
          max-width: 500px;
          margin: 40px auto;
          padding: 24px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px #0001;
        }
        .chat-container {
          border: 1px solid #eee;
          border-radius: 8px;
          background: #fafbfc;
          padding: 16px;
        }
        .messages {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 12px;
        }
        .message {
          margin-bottom: 8px;
          padding: 6px 10px;
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
        .chat-form {
          display: flex;
          gap: 8px;
        }
        .chat-form input {
          flex: 1;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
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