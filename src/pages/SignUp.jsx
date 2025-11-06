import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTranslation } from "react-i18next";

export default function SignUpForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [t, i18n] = useTranslation();

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
			// create user
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// usernam functionality using firestore
			await setDoc(doc(db, "users", user.uid), {
				username: username,
				email: user.email,
				createdAt: new Date(),
				writer: false,
			});
			console.log("user registered", user);
		} catch (error) {
			console.error("error signing up", error.message);
		}
	};
	return (
		<center>
			<form onSubmit={handleSignUp}>
				<div className="form-group">
					<h2>{t("signup.heading")}</h2>
					<div className="form-group">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={t("signup.email-placeholder")}
							required
							className="form-input"
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={t("signup.password-placeholder")}
							required
							className="form-input"
						/>
					</div>
					<div className="form-group">
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder={t("signup.username-placeholder")}
							required
							className="form-input"
						/>
					</div>
					<button className="submit-button" type="submit">
						{t("signup.register")}
					</button>
				</div>
			</form>
		</center>
	);
}
