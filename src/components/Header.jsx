import React, { useEffect, useState } from "react";
import TSC from "../assets/tsc.png";
import { Link } from "react-router-dom";

export default function Header() {
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
                    <Link to="/"><img src={TSC} alt="TSC Logo" /></Link>
                    <Link to="/">Home</Link>
                    <Link to="https://stats.uptimerobot.com/abiwl4EvLm">Status</Link>
                    <Link to="/about">About Us</Link>
                </div>
                <div className="nav-right">
                    <Link to="/articles/create">Write an Article</Link>
                    <button
                        onClick={() => setDarkMode(prev => !prev)}
                        className="dark-mode-btn"
                        aria-label="Toggle Dark Mode"
                    >
                        <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"} />
                    </button>
                    <Link to="/account">
                        Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
