"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc } from "lucide-react";

interface Track {
  title: string;
  file: string;
}

export default function AudioPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.15);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load playlist
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const res = await fetch('/audio/playlist.json');
        const data = await res.json();
        setTracks(data);
      } catch (e) {
        console.warn("Playlist tidak ditemukan, pakai default");
        setTracks([
          { title: "Background Vibes", file: "/audio/Background.mp3" },
        ]);
      }
    };
    loadPlaylist();
    setIsClient(true);
  }, []);

  // Setup audio element
  useEffect(() => {
    if (!isClient) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
    const audio = audioRef.current;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (currentTrackIndex + 1 < tracks.length) {
        setCurrentTrackIndex(idx => idx + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [isClient, tracks, currentTrackIndex]);

  // Change track
  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex]?.file || '';
    audio.load();
    if (isPlaying) {
      audio.play().catch(e => console.log("Auto-play blocked:", e));
    }
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackIndex, tracks, isPlaying]);

  // Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Play error:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume & Rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Controls
  const togglePlay = () => setIsPlaying(prev => !prev);
  const nextTrack = () => {
    if (currentTrackIndex + 1 < tracks.length) setCurrentTrackIndex(prev => prev + 1);
  };
  const prevTrack = () => {
    if (currentTrackIndex > 0) setCurrentTrackIndex(prev => prev - 1);
  };
  const toggleMute = () => setIsMuted(prev => !prev);
  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
  };
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainSec = Math.floor(sec % 60);
    return `${mins}:${remainSec < 10 ? '0' : ''}${remainSec}`;
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  if (!isClient || tracks.length === 0) return null;

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[480px] sm:w-[560px] bg-black/90 backdrop-blur-lg border border-[#8B0000]/40 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:border-[#8B0000]">
      {/* Header: Judul & Speed */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8B0000]/20 rounded-full">
            <Disc size={20} className="text-[#8B0000]" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Now Playing</p>
            <h3 className="text-white text-xl font-bold truncate max-w-[300px]">{currentTrack.title}</h3>
          </div>
        </div>
        <button
          onClick={changeSpeed}
          className="text-xs bg-[#8B0000]/20 px-3 py-1 rounded-full hover:bg-[#8B0000]/40 transition text-gray-200"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Progress Bar (Tebal & Besar) */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-400 font-mono w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#8B0000] transition-all hover:h-3"
        />
        <span className="text-xs text-gray-400 font-mono w-10 text-left">{formatTime(duration)}</span>
      </div>

      {/* Kontrol (Besar) */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={prevTrack} 
          disabled={currentTrackIndex === 0} 
          className="p-2 text-gray-300 hover:text-white disabled:opacity-30 transition"
        >
          <SkipBack size={28} />
        </button>
        
        <button 
          onClick={togglePlay} 
          className="p-4 bg-[#8B0000] rounded-full hover:bg-[#a00000] transition shadow-lg shadow-[#8B0000]/30"
        >
          {isPlaying ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white" />}
        </button>
        
        <button 
          onClick={nextTrack} 
          disabled={currentTrackIndex + 1 >= tracks.length} 
          className="p-2 text-gray-300 hover:text-white disabled:opacity-30 transition"
        >
          <SkipForward size={28} />
        </button>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            className="w-16 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#8B0000]"
          />
        </div>
      </div>
    </div>
  );
}