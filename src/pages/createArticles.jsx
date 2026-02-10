import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	MDXEditor,
	headingsPlugin,
	listsPlugin,
	ListsToggle,
	CodeToggle,
	quotePlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
	toolbarPlugin,
	BoldItalicUnderlineToggles,
	CreateLink,
	InsertImage,
	linkDialogPlugin,
	InsertThematicBreak,
	imagePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import sanitizeHtml from "sanitize-html";

export default function CreateArticle({ user, profile }) {
	const navigate = useNavigate();
	const { category: routeCategory } = useParams();

	const [title, setTitle] = useState("");
	const [date] = useState(new Date().toISOString().split("T")[0]);
	const categories = ["TSC Announcements", "TSC Update Log", "Scratch News", "DevJokes"];
	const [category, setCategory] = useState(
		categories.includes(routeCategory) ? routeCategory : categories[0]
	);

	const [content, setContent] = useState("");
	const [t, i18n] = useTranslation();

	if (!profile?.writer) return <p>Not authorized to create articles</p>;

	const handleSubmit = async () => {
		if (!title) return alert("Title is required");

		await addDoc(collection(db, "articles"), {
			title,
			author: profile.username,
			date,
			category,
			content: sanitizeHtml(content), // already Markdown from MDXEditor
			createdAt: serverTimestamp(),
		});

		navigate("/");
	};

	return (
		<div className="container mt-4">
			<div className="card shadow p-4">
				<h1 className="mb-4">{t("write.heading")}</h1>

				<div className="mb-3">
					<label className="form-label">{t("write.title")}</label>
					<input
						className="form-control"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={t("write.title-placeholder")}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">{t("write.author")}</label>
					<input
						className="form-control"
						type="text"
						value={profile.username}
						readOnly
						disabled
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">{t("write.date")}</label>
					<input
						className="form-control"
						type="date"
						value={date}
						readOnly
						disabled
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">{t("write.category")}</label>
					<select
						className="form-select"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<label className="form-label">{t("write.content")}</label>
					<MDXEditor
						markdown={content}
						onChange={setContent}
						plugins={[
							headingsPlugin(),
							listsPlugin(),
							quotePlugin(),
							thematicBreakPlugin(),
							markdownShortcutPlugin(),
							linkDialogPlugin(),
							imagePlugin(),
							toolbarPlugin({
								toolbarContents: () => (
									<>
										<BoldItalicUnderlineToggles />
										<ListsToggle />
										<CodeToggle />
										<CreateLink />
										<InsertThematicBreak />
										<InsertImage />
									</>
								),
							}),
						]}
					/>
				</div>

				<div className="d-flex gap-3 mt-3">
					<button className="btn btn-primary" onClick={handleSubmit}>
						{t("write.submit")}
					</button>
					<button
						className="btn btn-secondary"
						onClick={() => navigate("/")}
					>
						{t("write.cancel")}
					</button>
				</div>
			</div>
		</div>
	);
}
