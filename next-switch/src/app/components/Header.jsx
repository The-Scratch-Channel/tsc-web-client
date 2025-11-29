"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TSC from "../../public/tsc.png"; // move your asset to public for Next.js

export default function Header() {
	const { t, i18n } = useTranslation();

	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("theme") === "dark";
		}
		return false;
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
					<Link href="/">
						<a>
							<Image
								src={TSC}
								alt="TSC Logo"
								width={40}
								height={40}
							/>
						</a>
					</Link>
					<Link href="/">{t("header.home")}</Link>
					<Link href="/lang">{t("header.language")}</Link>
					<Link href="/about">{t("header.about")}</Link>
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
					<Link href="/account">{t("header.account")}</Link>
				</div>
			</div>
		</div>
	);
}
