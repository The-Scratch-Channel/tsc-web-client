import React, { useEffect, useState } from "react";
import "../styles/snow.css";

export default function Snow() {
	const [docHeight, setDocHeight] = useState(
		document.documentElement.scrollHeight
	);
	const [showSnow, setShowSnow] = useState(false);

	useEffect(() => {
		const cookies = document.cookie.split(';').reduce((acc, cookie) => {
			const [key, value] = cookie.trim().split('=');
			acc[key] = value;
			return acc;
		}, {});

		const urlParams = new URLSearchParams(window.location.search);
		const snowParam = urlParams.get('snow');
		const toggleSnowParam = urlParams.get('toggle_snow');
		let paramHandled = false;
		let newSnowValue = cookies.snow;

		if (snowParam === '1' || snowParam === '0') {
			newSnowValue = snowParam;
			document.cookie = `snow=${newSnowValue}; path=/; max-age=31536000`;
			paramHandled = true;
		} else if (toggleSnowParam !== null) {
			newSnowValue = cookies.snow === '1' ? '0' : '1';
			document.cookie = `snow=${newSnowValue}; path=/; max-age=31536000`;
			paramHandled = true;
		}

		if (paramHandled) {
			const newUrl = new URL(window.location);
			newUrl.searchParams.delete('snow');
			newUrl.searchParams.delete('toggle_snow');
			window.history.replaceState({}, '', newUrl);
		}

		setShowSnow(newSnowValue === '1');

		const updateHeight = () =>
			setDocHeight(document.documentElement.scrollHeight);

		updateHeight();
		window.addEventListener("resize", updateHeight);

		const observer = new MutationObserver(updateHeight);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener("resize", updateHeight);
			observer.disconnect();
		};
	}, []);

	if (!showSnow) return null;

	return (
		<>
			{Array.from({ length: 80 }).map((_, i) => {
				const style = {
					left: `${Math.random() * 100}%`,
					animationDuration: `${6 + Math.random() * 6}s`,
					animationDelay: `${Math.random() * -10}s`,
					"--fall-distance": `${docHeight}px`,
				};

				return <span className="snowflake" key={i} style={style} />;
			})}
		</>
	);
}
