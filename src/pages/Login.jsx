import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [ t, i18n ] = useTranslation();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert(t("login.emailpass-error"));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(`User ${email} signed in successfully`);
      navigate('/');
    } catch (error) {
      console.error("Error signing in", error.message);
      alert(`Error signing in: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={handleSignIn}>
      <div className="form-group">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="form-input"
      />
      </div><div className="form-group">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="form-input"
      />
      </div>
      <button className="submit-button" type="submit">{t("login.signin")}</button>
    </form>
    </div>
  );
}