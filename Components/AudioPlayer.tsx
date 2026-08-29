"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Disc, ListMusic, 
  ChevronUp, ChevronDown, Music2 
} from "lucide-react";

interface Track {
  title: string;
  file: string;
}

export default function ProAudioPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5); // Default volume lebih wajar
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 1. Load Playlist
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const res = await fetch('/audio/playlist.json');
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTracks(data);
      } catch (e) {
        console.warn("Playlist fallback used");
        setTracks([
          { title: "Chill Lo-Fi Beat", file: "/audio/Background.mp3" },
          { title: "Coding Focus", file: "/audio/focus.mp3" },
        ]);
      }
    };
    loadPlaylist();
    setIsClient(true);
  }, []);

  // 2. Setup Audio Element & Events
  useEffect(() => {
    if (!isClient || tracks.length === 0) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    const audio = audioRef.current;

    const updateDuration = () => setDuration(audio.duration);
    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (currentTrackIndex + 1 < tracks.length) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isClient, tracks.length]); // Only run once on init

  // 3. Handle Track Change
  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;
    
    const audio = audioRef.current;
    const currentSrc = tracks[currentTrackIndex]?.file;
    
    // Hanya load ulang jika src berubah
    if (audio.src !== currentSrc) {
      audio.src = currentSrc;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      if (isPlaying) audio.play().catch(e => console.log("Autoplay blocked"));
    }
  }, [currentTrackIndex, tracks]);

  // 4. Handle Play/Pause State
  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play().catch(e => {}) : audioRef.current.pause();
  }, [isPlaying]);

  // 5. Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Controls
  const togglePlay = () => setIsPlaying(p => !p);
  const nextTrack = () => setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
  const prevTrack = () => setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false); // Tutup playlist setelah pilih
  };

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return "0:00";
    const mins = Math.floor(sec / 60);
    const remainSec = Math.floor(sec % 60);
    return `${mins}:${remainSec < 10 ? '0' : ''}${remainSec}`;
  };

  if (!isClient || tracks.length === 0) return null;

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* PLAYLIST DRAWER (Muncul di atas player) */}
      <div 
        className={`bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          showPlaylist ? "scale-100 opacity-100 mb-2" : "scale-90 opacity-0 pointer-events-none h-0"
        }`}
        style={{ width: "280px", maxHeight: "300px" }}
      >
        <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Playlist</span>
          <span className="text-[10px] text-gray-500">{tracks.length} Tracks</span>
        </div>
        <div className="overflow-y-auto max-h-[240px] custom-scrollbar p-2 space-y-1">
          {tracks.map((track, idx) => (
            <button
              key={idx}
              onClick={() => selectTrack(idx)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                idx === currentTrackIndex 
                  ? "bg-[#6B9FBF]/20 text-[#6B9FBF]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {idx === currentTrackIndex && isPlaying ? (
                <div className="flex gap-0.5 h-3 items-end">
                  <span className="w-0.5 h-2 bg-[#6B9FBF] animate-[bounce_1s_infinite]" />
                  <span className="w-0.5 h-3 bg-[#6B9FBF] animate-[bounce_1.2s_infinite]" />
                  <span className="w-0.5 h-1 bg-[#6B9FBF] animate-[bounce_0.8s_infinite]" />
                </div>
              ) : (
                <Music2 size={14} className="opacity-50" />
              )}
              <span className="truncate">{track.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN PLAYER WIDGET */}
      <div className="group relative bg-[#2A2A2A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl w-[320px] hover:border-[#6B9FBF]/30 transition-all duration-300">
        
        {/* Header: Title & Toggle Playlist */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-full ${isPlaying ? 'bg-[#6B9FBF] text-white animate-pulse' : 'bg-white/5 text-gray-400'}`}>
              <Disc size={20} className={isPlaying ? "animate-spin-slow" : ""} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Now Playing</span>
              <h3 className="text-white text-sm font-medium truncate pr-2">{currentTrack.title}</h3>
            </div>
          </div>
          
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-1.5 rounded-lg transition-colors ${showPlaylist ? 'bg-[#6B9FBF] text-white' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
          >
            {showPlaylist ? <ChevronDown size={16} /> : <ListMusic size={16} />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] text-gray-500 font-mono w-8 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#6B9FBF] hover:h-1.5 transition-all"
          />
          <span className="text-[10px] text-gray-500 font-mono w-8">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
             <button onClick={prevTrack} className="p-2 text-gray-400 hover:text-white transition"><SkipBack size={18} /></button>
             <button 
               onClick={togglePlay} 
               className="p-3 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-lg shadow-white/10"
             >
               {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
             </button>
             <button onClick={nextTrack} className="p-2 text-gray-400 hover:text-white transition"><SkipForward size={18} /></button>
          </div>

          <div className="flex items-center gap-2 group/vol">
            <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="w-0 group-hover/vol:w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#6B9FBF] transition-all duration-300 overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}