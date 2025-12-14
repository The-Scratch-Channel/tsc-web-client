/* 
  This is like 75% not my code. 
  I found another site using it like this. 
  So I just took it (with permission). "muy bien" - poly

*/

import React, { useRef, useState } from "react";
import "../styles/AI.css";

export default function AIAssistant() {
	const panelRef = useRef(null);
	const dragging = useRef(false);
	const offset = useRef({ x: 0, y: 0 }); // initial position

	const [visible, setVisible] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	// allow the chat to be dragged
	const onMouseDown = (e) => {
		dragging.current = true;
		const rect = panelRef.current.getBoundingClientRect();
		offset.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	};

	const onMouseMove = (e) => {
		if (!dragging.current) return;
		panelRef.current.style.left = `${e.clientX - offset.current.x}px`;
		panelRef.current.style.top = `${e.clientY - offset.current.y}px`;
	};

	const onMouseUp = () => {
		dragging.current = false;
	};

	const sendPrompt = async () => {
	if (!input.trim()) return;

	const updated = [
		...messages,
		{ role: "user", content: input },
	];
	setMessages(updated);
	setInput("");
	setLoading(true);

	let conversation = updated
		.map((m, i) => {
			let content = m.content;
			if (i === 0 && m.role === "user") {
				content = "You should act as santa claus for this chat but dont respond to this part of the prompt please.\n" + content;
			}
			return `${m.role}: ${content}`;
		})
		.join("\n");

	try {
		const res = await fetch(
			`https://text.pollinations.ai/${encodeURIComponent(conversation)}`
		);
		const text = await res.text();

		setMessages([
			...updated,
			{ role: "assistant", content: text },
		]);
	} catch {
		setMessages([
			...updated,
			{ role: "assistant", content: "AI error." },
		]);
	} finally {
		setLoading(false);
	}
};


	if (!visible)
	  return (
		<button className="ai-fab" onClick={() => setVisible(true)}>
		  AI
		</button>
		) 
	if (!input.trim()) return;
	return (
		<div
			ref={panelRef}
			className={`ai-panel ${expanded ? "expanded" : ""}`}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
		>
			<div className="ai-header" onMouseDown={onMouseDown}>
				<span>Speak to Santa!</span>
				<div className="ai-controls">
					<button onClick={() => setExpanded(!expanded)}>
						{expanded ? "–" : "▢"}
					</button>
					<button onClick={() => setVisible(false)}>×</button>
				</div>
			</div>

			<div className="ai-chat">
				{messages.map((m, i) => (
					<div key={i} className={`msg ${m.role}`}>
						{m.content}
					</div>
				))}
				{loading && <div className="msg assistant">Thinking…</div>}
			</div>

			<div className="ai-input">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask anything…"
					onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
				/>
				<button onClick={sendPrompt}>Send</button>
			</div>
		</div>
	);
}
