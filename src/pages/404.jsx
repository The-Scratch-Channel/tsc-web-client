import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div>
			<centre>
				<h1>Oops!</h1>
				<p>The page you are trying to access was not found</p>
				<button onClick={() => navigate("/")}>Return to home</button>
			</centre>
		</div>
	);
}
