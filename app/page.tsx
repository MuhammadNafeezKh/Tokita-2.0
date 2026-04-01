"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "../Components/hero";
import Navbar from "../Components/Navbar";
import AboutModern from "../Components/about";
import LanguagesSection from "../Components/language";
import Skills from "@/Components/skills";
import Projects from "@/Components/project";
import Window from "@/Components/window";
import EducationTimeline from "@/Components/timeline";
import ContactSection from "@/Components/contact";
import CustomCursor from "@/Components/cursor"
import Footer from "@/Components/footer";
import MariaTourGuide from "@/Components/miranda";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Refs untuk audio
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Init Audio Context untuk RBD sound
  const initAudioContext = async () => {
    if (audioContextRef.current) return audioContextRef.current;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;
    
    return ctx;
  };

  // Play Background Music (looping)
  const playBGM = () => {
    try {
      if (!bgmAudioRef.current) {
        bgmAudioRef.current = new Audio('/audio/Background.mp3');
        bgmAudioRef.current.loop = true;
        bgmAudioRef.current.volume = 0.15;
      }
      
      bgmAudioRef.current.play()
        .then(() => {
          setAudioEnabled(true);
        })
        .catch(e => console.log("BGM Play Error:", e));
        
    } catch (e) {
      console.log("BGM Error:", e);
    }
  };

  // Stop Background Music
  const stopBGM = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
      bgmAudioRef.current.currentTime = 0;
    }
    setAudioEnabled(false);
  };

  // Play RBD Sound Effect
  const playRBDSound = async () => {
    try {
      const ctx = await initAudioContext();
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const response = await fetch('/audio/RBD.mp3');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      source.start();
      
    } catch (e) {
      console.log("RBD Sound Error:", e);
      
      try {
        const fallbackAudio = new Audio('/audio/RBD.mp3');
        fallbackAudio.volume = 0.4;
        fallbackAudio.play();
      } catch (fallbackError) {
        console.log("RBD Fallback Error:", fallbackError);
      }
    }
  };

  // Function to start audio on first user interaction
  const startAudio = async () => {
    if (hasUserInteracted) return;
    
    setHasUserInteracted(true);
    
    try {
      const ctx = await initAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      playBGM();
    } catch (error) {
      console.log("Audio start failed:", error);
    }
  };

  useEffect(() => {
    ScrollTrigger.refresh();
    
    if (heroRef.current) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    
    // Add global click listener to start audio on first click anywhere
    const handleFirstInteraction = () => {
      startAudio();
      // Remove listener after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    // Also listen for keydown (for keyboard users)
    const handleFirstKeyDown = () => {
      startAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstKeyDown);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstKeyDown);
    
    // Pasang event listener untuk RBD sound setelah audio aktif
    const handleDocumentClick = (e: MouseEvent) => {
      if (!hasUserInteracted) return;
      
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        if (Math.random() < 0.3) {
          playRBDSound();
        }
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstKeyDown);
      document.removeEventListener('click', handleDocumentClick);
      stopBGM();
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [hasUserInteracted]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Simple overlay hint - will disappear on first click */}
      {!hasUserInteracted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full animate-pulse">
            <p className="text-white text-sm font-mono">✨ Klik di mana saja untuk memulai ✨</p>
          </div>
        </div>
      )}
      
      {/* Audio Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => audioEnabled ? stopBGM() : playBGM()}
          className="p-3 bg-black/60 border border-[#8B0000]/30 rounded-full hover:border-[#8B0000] transition-all duration-300 backdrop-blur-sm group"
          title={audioEnabled ? "Matikan Musik" : "Nyalakan Musik"}
        >
          {audioEnabled ? (
            <svg className="w-5 h-5 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#8B0000]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
        
        {/* Easter Egg: Test RBD sound */}
        <button
          onClick={playRBDSound}
          className="p-3 bg-black/60 border border-[#8B0000]/30 rounded-full hover:border-[#8B0000] transition-all duration-300 backdrop-blur-sm group"
          title="Test RBD Sound"
        >
          <span className="text-[#8B0000] text-xs font-bold">RBD</span>
        </button>
      </div>
      
      <CustomCursor />
      
      <div id="hero" ref={heroRef}>
        <Hero />
      </div>
      
      <Navbar />
      
      <div id="about">
        <AboutModern />
      </div>
      
      <div id="window">
        <Window/>
      </div>
      
      <div id="education">
        <EducationTimeline/>
      </div>
      
      <div id="languages">
        <LanguagesSection/>
      </div>
      
      <div id="skills">
        <Skills />
      </div>
      
      <div id="projects">
        <Projects/>
      </div>
      
      <div id="contact">
        <ContactSection/>
      </div>
      
      <Footer/>
      
      <MariaTourGuide />
    </div>
  );
}