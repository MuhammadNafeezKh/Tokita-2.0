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
  ListMusic,
} from "lucide-react";
import { SiMyanimelist, SiRobloxstudio } from "react-icons/si";
import { FaReact } from "react-icons/fa6";
import { PiGameControllerDuotone } from "react-icons/pi";
import law from "../../img/ce.jpg";

// Audio Player Component (inside hero)
const AudioPlayer = () => {
  const [tracks, setTracks] = useState<{ title: string; file: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.15);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/audio/playlist.json')
      .then(res => res.json())
      .then(setTracks)
      .catch(() => console.warn("Playlist not found"));
  }, []);

  useEffect(() => {
    if (!audioRef.current && tracks.length) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration);
    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleEnd = () => {
      if (currentIndex + 1 < tracks.length) setCurrentIndex(i => i + 1);
      else setIsPlaying(false);
    };
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnd);
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [tracks, currentIndex, volume, playbackRate]);

  useEffect(() => {
    if (!audioRef.current || !tracks.length) return;
    const audio = audioRef.current;
    audio.src = tracks[currentIndex]?.file || '';
    audio.load();
    if (isPlaying) audio.play().catch(e => console.log(e));
    setCurrentTime(0);
    setDuration(0);
  }, [currentIndex, tracks, isPlaying]);

  useEffect(() => {
    if (audioRef.current) isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = () => setIsPlaying(p => !p);
  const next = () => currentIndex + 1 < tracks.length && setCurrentIndex(i => i + 1);
  const prev = () => currentIndex > 0 && setCurrentIndex(i => i - 1);
  const toggleMute = () => setIsMuted(m => !m);
  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playbackRate);
    setPlaybackRate(speeds[(idx + 1) % speeds.length]);
  };
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, '0')}`;
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  if (!tracks.length) return null;

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-black/80 backdrop-blur-sm rounded-xl p-2 border border-[#8B0000]/50 shadow-lg w-64">
      <div className="flex justify-between items-center text-white text-xs mb-1">
        <span className="text-[#8B0000] font-mono">🎵 Now Playing</span>
        <button onClick={() => setShowPlaylist(!showPlaylist)} className="hover:text-[#8B0000]">
          <ListMusic size={14} />
        </button>
      </div>
      <div className="text-white text-xs truncate mb-1">{tracks[currentIndex]?.title}</div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-400">{formatTime(currentTime)}</span>
        <input type="range" min={0} max={duration || 0} value={currentTime} onChange={handleSeek} className="flex-1 h-1 bg-gray-600 rounded-lg accent-[#8B0000]" />
        <span className="text-[10px] text-gray-400">{formatTime(duration)}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <button onClick={prev} disabled={currentIndex === 0} className="text-white hover:text-[#8B0000] disabled:opacity-30"><SkipBack size={16} /></button>
        <button onClick={togglePlay} className="bg-[#8B0000] p-1 rounded-full">{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button>
        <button onClick={next} disabled={currentIndex + 1 >= tracks.length} className="text-white hover:text-[#8B0000] disabled:opacity-30"><SkipForward size={16} /></button>
        <button onClick={toggleMute} className="text-white hover:text-[#8B0000]">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
        <button onClick={changeSpeed} className="text-white text-[10px] bg-[#8B0000]/30 px-1 rounded">{playbackRate}x</button>
      </div>
      {showPlaylist && (
        <div className="mt-2 max-h-32 overflow-y-auto bg-black/90 rounded border border-[#8B0000]/30 p-1">
          {tracks.map((track, idx) => (
            <div key={idx} className={`text-[10px] p-1 cursor-pointer hover:bg-[#8B0000]/30 ${idx === currentIndex ? 'text-[#8B0000] font-bold' : 'text-white'}`} onClick={() => { setCurrentIndex(idx); setIsPlaying(true); setShowPlaylist(false); }}>
              {track.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const phrases = ["Welcome to my portfolio", "Front End Developer", "UI/UX Enthusiast", "Creative Problem Solver"];
  const typingSpeed = 100, deletingSpeed = 50, pauseDuration = 1500;

  useEffect(() => {
    const current = phrases[loopIndex % phrases.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < current.length) setDisplayText(current.slice(0, displayText.length + 1));
        else setIsDeleting(true);
      } else {
        if (displayText.length > 0) setDisplayText(displayText.slice(0, -1));
        else { setIsDeleting(false); setLoopIndex(prev => prev + 1); }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    if (!isDeleting && displayText.length === current.length) {
      clearTimeout(timeout);
      setTimeout(() => setIsDeleting(true), pauseDuration);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, loopIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, y: 80, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.4 });
      if (textRef.current) gsap.fromTo(textRef.current.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.2 });
      if (buttonsRef.current) gsap.fromTo(buttonsRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.6 });
      if (socialRef.current) gsap.fromTo(socialRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.9 });
      if (orbitRef.current) gsap.to(orbitRef.current, { rotate: 360, duration: 25, repeat: -1, ease: "linear", transformOrigin: "center center" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleCVClick = (e: React.MouseEvent) => { e.preventDefault(); alert("CV belum tersedia, cek nanti ya!"); };

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-screen bg-[#1A1A1A]" style={{
      backgroundImage: `radial-gradient(circle at 20% 30%, rgba(74,107,127,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(107,159,191,0.05) 0%, transparent 40%), repeating-linear-gradient(45deg, rgba(44,44,44,0.2) 0px, rgba(44,44,44,0.2) 2px, transparent 2px, transparent 6px)`
    }}>
      <div className="absolute inset-0 bg-black/20 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-28 md:pt-32 gap-10 min-h-screen">
        <div ref={textRef} className="text-center md:text-left space-y-5 md:w-1/2 z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-[2px_2px_0px_#000000] min-h-[5rem]">
            {displayText}<span className="inline-block w-0.5 h-8 md:h-10 bg-white ml-1 animate-pulse"></span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#6B9FBF] drop-shadow-[2px_2px_0px_#000000]">I'm Nafis</h2>
          <div ref={socialRef} className="flex justify-center md:justify-start gap-4 pt-2">
            <a href="https://www.instagram.com/_nafietzsche/" className="bg-[#2C2C2C] p-3 rounded-lg border border-[#3A3A3A] hover:border-[#6B9FBF]"><Instagram size={24} className="text-[#C0C0C0] hover:text-white" /></a>
            <a href="https://github.com/Tokitakun" className="bg-[#2C2C2C] p-3 rounded-lg border border-[#3A3A3A] hover:border-[#6B9FBF]"><Github size={24} className="text-[#C0C0C0] hover:text-white" /></a>
            <a href="mailto:nafismuhammad277@gmail.com" className="bg-[#2C2C2C] p-3 rounded-lg border border-[#3A3A3A] hover:border-[#6B9FBF]"><Mail size={24} className="text-[#C0C0C0] hover:text-white" /></a>
            <a href="#contact" className="bg-[#2C2C2C] p-3 rounded-lg border border-[#3A3A3A] hover:border-[#6B9FBF]"><MessageCircle size={24} className="text-[#C0C0C0] hover:text-white" /></a>
          </div>
          <p className="text-xl md:text-2xl text-[#F0F0F0] drop-shadow-[1px_1px_0px_#000000]">
            <span className="font-semibold text-[#6B9FBF]">Front End Developer</span> & <span className="font-semibold text-[#B06C6C]">UI/UX Design Enthusiast</span>
          </p>
          <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center md:justify-start pt-6">
            <Link href="/serti" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C2C2C] border border-[#3A3A3A] text-white font-semibold rounded-xl hover:bg-[#3A3A3A] hover:border-[#6B9FBF]"><Award size={20} className="text-[#6B9FBF]" /> Certificate</Link>
            <a href="#" onClick={handleCVClick} className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C2C2C] border border-[#3A3A3A] text-white font-semibold rounded-xl hover:bg-[#3A3A3A] hover:border-[#B06C6C]"><Download size={20} className="text-[#B06C6C]" /> Download CV</a>
          </div>
        </div>
        <div className="relative w-80 h-[420px] md:w-[480px] md:h-[540px] flex items-center justify-center">
          <div ref={imageRef} className="absolute w-72 h-96 md:w-[400px] md:h-[480px] overflow-hidden border border-[#3A3A3A] shadow-2xl z-10">
            <Image src={law} alt="Profile" fill className="object-cover" priority />
          </div>
          <div ref={orbitRef} className="absolute w-full h-full flex items-center justify-center" style={{ transformOrigin: "center" }}>
            <div className="absolute inset-0 rounded-full border border-[#3A3A3A] border-dashed"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[100px]"><div className="bg-[#232323] border border-[#3A3A3A] rounded-lg p-3"><SiMyanimelist className="text-[#6B9FBF] text-4xl" /></div></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[100px]"><div className="bg-[#232323] border border-[#3A3A3A] rounded-lg p-3"><SiRobloxstudio className="text-[#B06C6C] text-4xl" /></div></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[100px]"><div className="bg-[#232323] border border-[#3A3A3A] rounded-lg p-3"><FaReact className="text-[#6B9FBF] text-4xl" /></div></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-[100px]"><div className="bg-[#232323] border border-[#3A3A3A] rounded-lg p-3"><PiGameControllerDuotone className="text-[#B06C6C] text-4xl" /></div></div>
          </div>
          <AudioPlayer />
        </div>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#6B9FBF] to-transparent mt-10 md:mt-16 opacity-30"></div>
    </section>
  );
}