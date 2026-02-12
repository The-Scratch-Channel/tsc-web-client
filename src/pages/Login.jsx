import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormInput from "../components/FormInput";

/**
 * Render a login page that authenticates users with email and password.
 *
 * Renders a form with email and password inputs and a submit button. On submit it validates that
 * both fields are provided, attempts Firebase authentication, navigates to '/' on successful sign-in,
 * and displays an alert on validation failure or authentication error.
 *
 * @returns {JSX.Element} The login page element containing the email/password form.
 */
export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const [t, i18n] = useTranslation();

	const handleSignIn = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			alert(t("login.emailpass-error"));
			return;
		}

		try {
			await signInWithEmailAndPassword(auth, email, password);
			console.log(`User ${email} signed in successfully`);
			navigate("/");
		} catch (error) {
			console.error("Error signing in", error.message);
			alert(`Error signing in: ${error.message}`);
		}
	};

	return (
		<>
			<center>
				<h1>{t("login.signin")}</h1>
				<form onSubmit={handleSignIn}>
					<FormInput
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
					/>
					<FormInput
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
					/>
					<button className="submit-button" type="submit">
						{t("login.signin")}
					</button>
				</form>
			</center>
		</>
	);
}
