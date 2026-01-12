import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { marked } from "marked";
import { useAuthUser } from "../hooks/useAuth";

export default function ArticlePage() {
	const { filename, category } = useParams();
	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const { user } = useAuthUser(); // simplified auth hook since we only need user
	const [userReactions, setUserReactions] = useState({
		thumbsUp: false,
		thumbsDown: false,
		heart: false,
		confetti: false,
		sad: false,
	});
	const [animate, setAnimate] = useState({
		thumbsUp: false,
		thumbsDown: false,
		heart: false,
		confetti: false,
		sad: false,
	});
	const [reactions, setReactions] = useState({
		thumbsUp: 0,
		thumbsDown: 0,
		heart: 0,
		confetti: 0,
		sad: 0,
	});

	// set title to article title
	useEffect(() => {
		const setPageTitle = () => {
			const titleElement = document.getElementById("article-title");
			if (titleElement) {
				document.title = `${titleElement.innerText} - The Scratch Channel`;
			} else {
				document.title = "The Scratch Channel";
				setTimeout(setPageTitle, 100); // retry after 100ms
			}
		};
		setPageTitle();
	}, []);

	useEffect(() => {
		async function fetchArticle() {
			const docRef = doc(db, "articles", filename);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				setArticle(null);
			} else {
				const data = docSnap.data();
				setArticle(data);
				setReactions({
					thumbsUp: data.thumbsUp || 0,
					thumbsDown: data.thumbsDown || 0,
					heart: data.heart || 0,
					confetti: data.confetti || 0,
					sad: data.sad || 0,
				});

				if (user) {
					const userDocRef = doc(
						db,
						"articles",
						filename,
						"reactions",
						user.uid
					);
					const userDoc = await getDoc(userDocRef);
					if (userDoc.exists()) {
						setUserReactions(userDoc.data());
					}
				}
			}
			setLoading(false);
		}
		fetchArticle();
	}, [filename, user]);

	const handleReaction = async (type) => {
		if (!user) return;

		const articleRef = doc(db, "articles", filename);
		const userDocRef = doc(db, "articles", filename, "reactions", user.uid);

		// If user already reacted, remove the reaction (decrement)
		if (userReactions[type]) {
			setAnimate((prev) => ({ ...prev, [type]: true }));
			setTimeout(
				() => setAnimate((prev) => ({ ...prev, [type]: false })),
				200
			);

			await updateDoc(articleRef, { [type]: increment(-1) });
			await setDoc(
				userDocRef,
				{ ...userReactions, [type]: false },
				{ merge: true }
			);

			setReactions((prev) => ({
				...prev,
				[type]: Math.max(0, prev[type] - 1),
			}));
			setUserReactions((prev) => ({ ...prev, [type]: false }));
			return;
		}

		// Otherwise add the reaction (increment)
		setAnimate((prev) => ({ ...prev, [type]: true }));
		setTimeout(
			() => setAnimate((prev) => ({ ...prev, [type]: false })),
			200
		);

		await updateDoc(articleRef, { [type]: increment(1) });
		await setDoc(
			userDocRef,
			{ ...userReactions, [type]: true },
			{ merge: true }
		);

		setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
		setUserReactions((prev) => ({ ...prev, [type]: true }));
	};

	if (loading) return <div>Loading article...</div>;
	if (!article) return <div>Article not found</div>;
	if (article.category !== category) return <div>Category mismatch</div>;
	return (
		<div className="page article-full">
			<div className="article-header">
				<h1 id="article-title">{article.title}</h1>
				<div className="meta">
					<span className="author">By: {article.author}</span>
					<span className="date">Date: {article.date}</span>
					<span className="category">
						Category: {article.category}
					</span>
				</div>
			</div>

			{article.thumbnail && (
				<div className="article-thumbnail">
					<img src={article.thumbnail} alt="Article thumbnail" />
				</div>
			)}

			<div
				className="article-full-content"
				dangerouslySetInnerHTML={{
					__html: marked.parse(article.content),
				}}
			/>

			<div className="reactions">
				<button
					className={`reaction-btn ${animate.thumbsUp ? "animate" : ""}`}
					onClick={() => handleReaction("thumbsUp")}
					style={{
						color: userReactions.thumbsUp ? "#0d6efd" : "grey",
					}}
				>
					👍 {reactions.thumbsUp}
				</button>
				<button
					className={`reaction-btn ${animate.thumbsDown ? "animate" : ""}`}
					onClick={() => handleReaction("thumbsDown")}
					style={{
						color: userReactions.thumbsDown ? "#dc3545" : "grey",
					}}
				>
					👎 {reactions.thumbsDown}
				</button>
				<button
					className={`reaction-btn ${animate.heart ? "animate" : ""}`}
					onClick={() => handleReaction("heart")}
					style={{ color: userReactions.heart ? "#ff4081" : "grey" }}
				>
					❤️ {reactions.heart}
				</button>
				<button
					className={`reaction-btn ${animate.confetti ? "animate" : ""}`}
					onClick={() => handleReaction("confetti")}
					style={{
						color: userReactions.confetti ? "#0d6efd" : "grey",
					}}
				>
					🎉 {reactions.confetti}
				</button>
				<button
					className={`reaction-btn ${animate.sad ? "animate" : ""}`}
					onClick={() => handleReaction("sad")}
					style={{ color: userReactions.sad ? "#0d6efd" : "grey" }}
				>
					😭 {reactions.sad}
				</button>
			</div>
		</div>
	);
}
