"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    audioRef.current?.close();
    audioRef.current = null;
    setPlaying(false);
  };

  const start = () => {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    const context = new AudioEngine();
    audioRef.current = context;
    const chime = () => {
      const now = context.currentTime;
      [220, 330, 440].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, now + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.018, now + index * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.4);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(now + index * 0.12);
        oscillator.stop(now + index * 0.12 + 1.45);
      });
    };
    chime();
    timerRef.current = window.setInterval(chime, 6000);
    setPlaying(true);
  };

  useEffect(() => () => stop(), []);

  return <button className={`soundToggle ${playing ? "isPlaying" : ""}`} type="button" onClick={playing ? stop : start} aria-label={playing ? "Turn ambient sound off" : "Turn ambient sound on"} aria-pressed={playing}>
    {playing ? <Volume2 size={17} /> : <VolumeX size={17} />}
    <span>{playing ? "Sound on" : "Sound off"}</span>
    <i aria-hidden="true"><b /><b /><b /></i>
  </button>;
}

declare global { interface Window { webkitAudioContext: typeof AudioContext; } }
