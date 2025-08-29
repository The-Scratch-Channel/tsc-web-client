import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTranslation } from "react-i18next";

export default function SignUpForm() {
    const [ t, i18n ] = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // usernam functionality using firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email,
                createdAt: new Date(),
                writer: false
            })
            console.log("user registered", user);

        } catch (error) {
            console.error("error signing up", error.message);
        }
    };
    return (
        <form onSubmit={handleSignUp}>
            <h2>{t("signup.heading")}</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("signup.email-placeholder")}
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("signup.password-placeholder")}
                required
            />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("signup.username-placeholder")}
                required
            />
            <button type="submit">{t("signup.register")}</button>
        </form>
    )
}