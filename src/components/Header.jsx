import React, { useEffect, useState } from "react";
import TSC from "../assets/tsc_xmas.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
	const { t, i18n } = useTranslation();
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem("theme") === "dark";
	});

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [darkMode]);

	return (
		<div className="navigation">
			<div className="nav-content">
				<div className="nav-left">
					<Link to="/">
						<img src={TSC} alt="TSC Logo" />
					</Link>
					<Link to="/">{t("header.home")}</Link>
					<Link to="/lang">{t("header.language")}</Link>
					<Link to="/about">{t("header.about")}</Link>
				</div>
				<div className="nav-right">
					<button
						onClick={() => setDarkMode((prev) => !prev)}
						className="dark-mode-btn"
						aria-label="Toggle Dark Mode"
					>
						<i
							className={
								darkMode
									? "fa-solid fa-sun"
									: "fa-solid fa-moon"
							}
						/>
					</button>
					<Link to="/account">{t("header.account")}</Link>
				</div>
			</div>
		</div>
	);
}
