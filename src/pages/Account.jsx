import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../hooks/useAuth";

export default function Account() {
	const { user } = useAuthUser();
	const [t, i18n] = useTranslation();

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
						{t("account.welcome")}, {user.displayName}!
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
