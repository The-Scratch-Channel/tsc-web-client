import React from "react";
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
import AIAssistant from "./components/AIAssistant";
import Snow from "./components/Snow";
import ChristmasPlayer from "./pages/ChristmasPlayer";
import SantaTracker from "./pages/Santa";
import NotFound from "./pages/404";

import { useAuth } from "./hooks/useAuth";

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
import "./styles/UserList.css";
import "./styles/account.css";

/**
 * Root React component that initializes authentication/profile state and renders the app routes.
 *
 * Initializes Firebase authentication listener, fetches the signed-in user's Firestore profile, displays a centered spinner while initialization is in progress, and renders the header, footer, and route hierarchy. Routes for creating articles, making admins, and viewing all users are protected and rendered only when a user is signed in and their profile has `writer` set to a truthy value.
 *
 * @returns {JSX.Element} The application UI including header, routes (with writer-protected routes), and footer.
 */
function App() {
	const { user, profile, loading } = useAuth();

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
			<Snow />
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
				<Route path="/tracksanta" element={<SantaTracker />} />
				<Route path="/404" element={<NotFound />} />
			</Routes>
			<Footer />
			<AIAssistant />
			<ChristmasPlayer />
		</Router>
	);
}

export default App;
