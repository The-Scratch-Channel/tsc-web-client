import { useEffect, useRef, useState } from "react";
import "../styles/ChristmasPlayer.css";

const TRACKS = [
	{ title: "Santa Tracker", file: "/audio/christmas/theme.mp3" },
	{ title: "Last Rizzmas", file: "/audio/christmas/last-rizzmas.mp3" }
];

export default function ChristmasPlayer() {
	const isDecember = new Date().getMonth() === 11;

	const audioRef = useRef(null);

	const [visible, setVisible] = useState(isDecember);
	const [playing, setPlaying] = useState(false);
	const [index, setIndex] = useState(
		Number(localStorage.getItem("xmas-track")) || 0
	);

	const track = TRACKS[index];

	// finnaly fixed lint errors here yay
	const next = () => {
		setIndex((i) => {
			const nextIndex = (i + 1) % TRACKS.length;
			localStorage.setItem("xmas-track", nextIndex);
			return nextIndex;
		});
	};

	const prev = () => {
		setIndex((i) => {
			const prevIndex = (i - 1 + TRACKS.length) % TRACKS.length;
			localStorage.setItem("xmas-track", prevIndex);
			return prevIndex;
		});
	};

	useEffect(() => {
		if (!audioRef.current) return;

		const audio = audioRef.current;
		audio.src = track.file;
		audio.volume = 0.25;

		const handleEnded = () => next();
		audio.addEventListener("ended", handleEnded);

		if (playing) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}

		if ("mediaSession" in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track.title,
				artist: "The Scratch Channel",
				album: "Christmas",
			});

			console.log(track.title);

			navigator.mediaSession.setActionHandler("play", () =>
				setPlaying(true)
			);
			navigator.mediaSession.setActionHandler("pause", () =>
				setPlaying(false)
			);
			navigator.mediaSession.setActionHandler("nexttrack", next);
			navigator.mediaSession.setActionHandler("previoustrack", prev);

			navigator.mediaSession.playbackState = playing
				? "playing"
				: "paused";
		}

		return () => audio.removeEventListener("ended", handleEnded);
	}, [track, playing]);

	if (!isDecember || !visible) return null;

	return (
		<div className="xmas-player">
			<audio ref={audioRef} />

			<div className="xmas-header">
				<span>🎄 {track.title}</span>
				<button onClick={() => setVisible(false)}>×</button>
			</div>

			<div className="xmas-body">
				<button onClick={prev}>⏮</button>
				<button onClick={() => setPlaying(!playing)}>
					{playing ? "⏸" : "▶"}
				</button>
				<button onClick={next}>⏭</button>
			</div>
		</div>
	);
}
