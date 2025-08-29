import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./pages/MainContent";
import Footer from "./components/Footer";
import CreateArticle from "./pages/createArticles";
import About from "./pages/About";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/Login";
import Account from "./pages/Account";
import SignUpForm from "./pages/SignUp";
import MakeAdmin from "./pages/MakeAdmin";
import UserList from "./pages/UserList";
import ArticleChat from "./pages/ArticleChat";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import "./styles/main.css";
import "./styles/about.css";
import "./styles/footer.css";
import "./styles/navbar.css";
import "./styles/article.css";
import "./styles/article-page.css";
import "./styles/article-modal.css";
import "./styles/categories.css";
import "./styles/editor.css";

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route
          path="/articles/create"
          element={
            user && profile?.writer ? (
              <CreateArticle user={user} profile={profile} />
            ) : (
              <p>Not authorized</p>
            )
          }
        />
        <Route
          path="/users/:username/admin/create"
          element={
            user && profile?.writer ? (
              <MakeAdmin user={user} profile={profile} />
            ) : (
              <p>Not authorized</p>
            )
          }
        />
        <Route
          path="/users/all"
          element={ user && profile?.writer ? <UserList /> : <p>Not authorized</p> }
        />
        <Route path="/about" element={<About />} />
        <Route path="/:category/article/:filename" element={<ArticlePage />} />
        <Route path="/:category/article/:filename/chat" element={<ArticleChat user={user} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
