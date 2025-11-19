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
import LangPage from "./pages/Lang";

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
import "./styles/lang.css";
import "./styles/login.css";

/**
 * Root React component that initializes authentication/profile state and renders the app routes.
 *
 * Initializes Firebase authentication listener, fetches the signed-in user's Firestore profile, displays a centered spinner while initialization is in progress, and renders the header, footer, and route hierarchy. Routes for creating articles, making admins, and viewing all users are protected and rendered only when a user is signed in and their profile has `writer` set to a truthy value.
 *
 * @returns {JSX.Element} The application UI including header, routes (with writer-protected routes), and footer.
 */
function App() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

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
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
				}}
			>
				<div
					style={{
						border: "6px solid #4E97FE",
						borderTop: "6px solid transparent",
						borderRadius: "50%",
						width: "64px",
						height: "64px",
						animation: "spin 1s linear infinite",
					}}
				/>
				<style>
					{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
				</style>
			</div>
		);
	}

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
						path="/admin/users"
						element={
							user && profile?.writer ? (
								<UserList />
							) : (
								<p>Not authorized</p>
							)
						}
					/>
					<Route path="/about" element={<About />} />
					<Route
						path="/:category/article/:filename"
						element={<ArticlePage />}
					/>
					<Route path="/account" element={<Account />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignUpForm />} />
					<Route path="/lang" element={<LangPage />} />
				</Routes>
				<Footer />
			</Router>
	);
}

export default App;
