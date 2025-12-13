import React, { useEffect, useState } from "react";
import "../styles/snow.css";

export default function Snow() {
	const [docHeight, setDocHeight] = useState(
		document.documentElement.scrollHeight
	);

	useEffect(() => {
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
