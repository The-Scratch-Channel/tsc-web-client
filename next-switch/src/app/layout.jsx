"use client";

import React, { createContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Firebase imports
import { auth, db } from "../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import "../styles/main.css";
import "../styles/about.css";
import "../styles/footer.css";
import "../styles/navbar.css";
import "../styles/article.css";
import "../styles/article-page.css";
import "../styles/article-modal.css";
import "../styles/categories.css";
import "../styles/editor.css";
import "../styles/lang.css";
import "../styles/login.css";

export const AuthContext = createContext({
	user: null,
	profile: null,
});

export default function RootLayout({ children }) {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				try {
					const userDoc = await getDoc(
						doc(db, "users", firebaseUser.uid)
					);
					if (userDoc.exists()) {
						setProfile(userDoc.data());
					} else {
						setProfile(null);
					}
				} catch (e) {
					console.error("Failed to load user profile:", e);
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
			<html>
				<body>
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
						<style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
					</div>
				</body>
			</html>
		);
	}

	return (
		<html>
			<body>
				<AuthContext.Provider value={{ user, profile }}>
					<Header user={user} profile={profile} />
					<main>{children}</main>
					<Footer />
				</AuthContext.Provider>
			</body>
		</html>
	);
}
