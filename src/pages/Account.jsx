import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function Account() {
	const [user, setUser] = useState(null);
	const [t, i18n] = useTranslation();
	useEffect(() => {
		// listen for auth state changes any change causes this
		const removeCookie = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});

		// sign out and remove local data from browsers
		return () => removeCookie();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			alert("Logged out successfully");
		} catch (error) {
			console.error("Error logging out:", error.message);
			alert(`Error logging out: ${error.message}`);
		}
	};

	return (
		<div style={{ padding: "20px", textAlign: "center" }}>
			{user ? (
				<>
					<p>
						{t("account.welcome")}, {user.displayName || user.email}!
					</p>
					<button onClick={handleLogout}>
						{t("account.logout")}
					</button>
				</>
			) : (
				<>
					<p>{t("account.liketodo")}</p>
					<div style={{ marginTop: "10px" }}>
						<Link to="/login" style={{ marginRight: "15px" }}>
							{t("account.login")}
						</Link>
						<Link to="/signup">{t("account.signup")}</Link>
					</div>
				</>
			)}
		</div>
	);
} 
