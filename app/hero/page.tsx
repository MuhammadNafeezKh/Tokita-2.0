"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Award,
  Instagram,
  Github,
  Mail,
  MessageCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc,
  ListMusic,
  ChevronDown,
  Music2,
} from "lucide-react";
import { SiMyanimelist, SiRobloxstudio } from "react-icons/si";
import { FaReact } from "react-icons/fa6";
import { PiGameControllerDuotone } from "react-icons/pi";
import law from "../../img/ce.webp";

// ============================================================================
// PRO AUDIO PLAYER (WITH PLAYLIST DRAWER)
// ============================================================================
interface Track { title: string; file: string; }

const ProAudioPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/audio/playlist.json')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setTracks)
      .catch(() => setTracks([{ title: "Default Vibes", file: "/audio/Background.mp3" }]));
  }, []);

  useEffect(() => {
    if (!audioRef.current && tracks.length) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    const audio = audioRef.current;
    if (!audio) return;

    const onMeta = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => {
      if (currentIndex + 1 < tracks.length) setCurrentIndex(i => i + 1);
      else setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, [tracks.length]);

  useEffect(() => {
    if (!audioRef.current || !tracks.length) return;
    const audio = audioRef.current;
    if (audio.src !== tracks[currentIndex]?.file) {
      audio.src = tracks[currentIndex].file;
      audio.load();
      setCurrentTime(0);
      if (isPlaying) audio.play().catch(() => {});
    }
  }, [currentIndex, tracks, isPlaying]);

  useEffect(() => {
    if (audioRef.current) isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const fmt = (s: number) => isNaN(s) ? "0:00" : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  const selectTrack = (i: number) => { setCurrentIndex(i); setIsPlaying(true); setShowPlaylist(false); };

  if (!tracks.length) return null;

  return (
    <div className="absolute -bottom-8 right-0 md:right-4 z-30 flex flex-col items-end gap-2">
      {/* Playlist Drawer */}
      <div className={`bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 origin-bottom-right ${showPlaylist ? "scale-100 opacity-100 mb-2 w-64" : "scale-90 opacity-0 pointer-events-none h-0 w-0"}`}>
        <div className="max-h-48 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
          {tracks.map((t, i) => (
            <button key={i} onClick={() => selectTrack(i)} className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${i === currentIndex ? "bg-[#6B9FBF]/20 text-[#6B9FBF]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              {i === currentIndex && isPlaying ? <div className="flex gap-0.5 h-3 items-end"><span className="w-0.5 h-2 bg-current animate-[bounce_1s_infinite]"/><span className="w-0.5 h-3 bg-current animate-[bounce_1.2s_infinite]"/></div> : <Music2 size={12} />}
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Player Pill */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#2A2A2A]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl hover:border-[#6B9FBF]/30 transition-all group min-w-[280px]">
        <div className={`p-1.5 rounded-full ${isPlaying ? 'bg-[#6B9FBF] text-white' : 'bg-white/5 text-gray-400'}`}>
          <Disc size={16} className={isPlaying ? "animate-spin-slow" : ""} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-500 font-mono uppercase">Now Playing</p>
          <p className="text-xs text-white font-medium truncate">{tracks[currentIndex]?.title}</p>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setShowPlaylist(!showPlaylist)} className={`p-1.5 rounded-lg transition ${showPlaylist ? 'text-[#6B9FBF]' : 'text-gray-400 hover:text-white'}`}>
            {showPlaylist ? <ChevronDown size={14} /> : <ListMusic size={14} />}
          </button>
          <button onClick={() => setIsPlaying(p => !p)} className="p-1.5 text-white hover:text-[#6B9FBF]">
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button onClick={() => setCurrentIndex(i => (i + 1) % tracks.length)} className="p-1.5 text-gray-400 hover:text-white">
            <SkipForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const [displayText, setDisplayText] = useState("");
  const phrases = ["Front End Developer", "UI/UX Enthusiast", "Creative Problem Solver"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentPhrase = phrases[phraseIndex];
    if (displayText.length < currentPhrase.length) {
      timeout = setTimeout(() => setDisplayText(currentPhrase.slice(0, displayText.length + 1)), 100);
    } else {
      timeout = setTimeout(() => { setDisplayText(""); setPhraseIndex((prev) => (prev + 1) % phrases.length); }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [displayText, phraseIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" });
      if (orbitRef.current) gsap.to(orbitRef.current, { rotate: 360, duration: 30, repeat: -1, ease: "linear" });
      if (textRef.current) gsap.fromTo(textRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.3 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-screen bg-[#2A2A2A] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(107,159,191,0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(176,108,108,0.1),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 pb-10 flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">
        
        {/* LEFT CONTENT */}
        <div ref={textRef} className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-gray-300">Available for Hire</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
            Hello, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B9FBF] to-[#8FC5F0]">Nafis.</span>
          </h1>

          <div className="h-8 md:h-10">
            <p className="text-xl md:text-2xl text-gray-400 font-light">
              {displayText}<span className="animate-blink">|</span>
            </p>
          </div>

          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Seorang pengembang frontend yang berfokus pada menciptakan pengalaman digital yang interaktif, responsif, dan estetis menggunakan teknologi modern.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
            {[
              { icon: Github, href: "https://github.com/Tokitakun" },
              { icon: Instagram, href: "https://www.instagram.com/_nafietzsche/" },
              { icon: Mail, href: "mailto:nafismuhammad277@gmail.com" },
              { icon: MessageCircle, href: "#contact" },
            ].map((item, i) => (
              <a key={i} href={item.href} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-[#6B9FBF] hover:border-[#6B9FBF] hover:text-white text-gray-400 transition-all duration-300 hover:-translate-y-1">
                <item.icon size={20} />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-6">
            <Link href="/serti" className="group relative px-6 py-3 bg-white text-[#2A2A2A] font-semibold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 flex items-center gap-2"><Award size={18} /> Certificates</span>
            </Link>
            <a href="#" className="px-6 py-3 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-2">
              <Download size={18} /> Download CV
            </a>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative w-full max-w-md md:max-w-lg aspect-square flex items-center justify-center">
          <div ref={imageRef} className="relative z-20 w-64 h-80 md:w-80 md:h-96">
             <div className="absolute inset-0 bg-[#6B9FBF] rounded-2xl rotate-6 opacity-20 blur-lg" />
             <div className="absolute inset-0 bg-[#B06C6C] rounded-2xl -rotate-6 opacity-20 blur-lg" />
             <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#2D2D2D]">
               <Image src={law} alt="Nafis Profile" fill className="object-cover hover:scale-105 transition-transform duration-700" priority />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
             </div>
          </div>

          <div ref={orbitRef} className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-[-40px] border border-dashed border-white/10 rounded-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 bg-[#2A2A2A] p-3 rounded-xl border border-white/10 shadow-lg"><SiMyanimelist className="text-[#6B9FBF] text-3xl" /></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 bg-[#2A2A2A] p-3 rounded-xl border border-white/10 shadow-lg"><FaReact className="text-[#61DAFB] text-3xl" /></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-[#2A2A2A] p-3 rounded-xl border border-white/10 shadow-lg"><PiGameControllerDuotone className="text-[#B06C6C] text-3xl" /></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-[#2A2A2A] p-3 rounded-xl border border-white/10 shadow-lg"><SiRobloxstudio className="text-white text-3xl" /></div>
          </div>

          {/* INTEGRATED PRO AUDIO PLAYER */}
          <ProAudioPlayer />
        </div>
      </div>
    </section>
  );
}