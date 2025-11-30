import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function Account() {
	const [user, setUser] = useState(null);
	const { t } = useTranslation(); // Proper destructuring to only get t

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

	const getUsername = (user) => {
		if (!user) return "";
		// Prefer displayName, fall back to the email local-part (before @), then uid
		if (user.displayName) return user.displayName;
		if (user.email) return user.email.split("@")[0];
		return user.uid || "";
	};

	const username = getUsername(user);

	return (
		<div style={{ padding: "20px", textAlign: "center" }}>
			{user ? (
				<> 
					<p>
						{t("account.welcome")}, {username}!
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
}					<button onClick={handleLogout}>
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
