import React, { useEffect, useRef, useState } from "react";
import "../styles/ChristmasPlayer.css";

const TRACKS = [
  { title: "Last Christmas", file: "/audio/christmas/last-christmas.mp3" },
  { title: "Santa Tracker", file: "/audio/christmas/theme.mp3" },
];

export default function ChristmasPlayer() {
  const isDecember = new Date().getMonth() === 11;
  if (!isDecember) return null;

  const audioRef = useRef(null);

  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(
    Number(localStorage.getItem("xmas-track")) || 0
  );

  const track = TRACKS[index];

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.src = track.file;
    audio.volume = 0.25;

    const handleEnded = () => next();
    audio.addEventListener('ended', handleEnded);

    if (playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'The Scratch Channel',
        album: 'Christmas',
      });

      navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
      navigator.mediaSession.setActionHandler('nexttrack', next);
      navigator.mediaSession.setActionHandler('previoustrack', prev);

      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    }

    return () => audio.removeEventListener('ended', handleEnded);
  }, [index, playing, track.file]);

  const next = () => {
    setIndex((i) => (i + 1) % TRACKS.length);
    localStorage.setItem("xmas-track", (index + 1) % TRACKS.length);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    localStorage.setItem("xmas-track", (index - 1 + TRACKS.length) % TRACKS.length);
  };

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
