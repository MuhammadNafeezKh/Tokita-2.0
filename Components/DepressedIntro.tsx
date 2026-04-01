"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface Props {
  onEnter?: () => void;
}

interface WhisperBubble {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
}

const DarkIntro = ({ onEnter }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const [whisperBubbles, setWhisperBubbles] = useState<WhisperBubble[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [imageRevealed, setImageRevealed] = useState(false);
  
  // Fix hydration mismatch - use empty string initially, then set after mount
  const [imageTimestamp, setImageTimestamp] = useState<string>("");

  const whisperLines = [
    "tidak ada yang peduli...",
    "aku hanya sampah...",
    "kenapa masih hidup?",
    "semua sia-sia...",
    "aku lelah...",
    "capek berpura-pura kuat...",
    "hatiku hancur berkeping-keping...",
    "aku benci diriku sendiri...",
    "kenapa aku dilahirkan?",
    "hidup ini menyakitkan...",
    "luka ini menghibur...",
    "darah yang mengalir... damai...",
    "sayatan terakhir... tenang...",
    "aku ingin pergi...",
    "cukup sudah...",
    "selesaiin saja...",
    "tidak ada artinya...",
    "semua akan berakhir...",
    "aku ingin mati saja...",
    "lepas dari semua ini...",
    "mereka semua bohong...",
    "aku dikhianati...",
    "janji palsu...",
    "mereka pergi... semua...",
    "aku ditinggal sendiri...",
    "percuma percaya...",
    "semua meninggalkanku...",
    "aku hanya alat...",
    "dimanfaatkan lalu dibuang...",
    "tidak ada yang tulus...",
    "semua tidak berarti...",
    "hidup hanya lelucon...",
    "tidak ada tujuan...",
    "kita hanya debu...",
    "semuanya fana...",
    "tidak ada yang abadi...",
    "kenapa repot-repot?",
    "pada akhirnya... kosong...",
    "semuanya akan hancur...",
    "tidak ada makna...",
    "tolong... seseorang...",
    "aku tidak bisa sendiri...",
    "hampa...",
    "mati rasa...",
    "aku tidak merasakan apa-apa...",
    "kosong di dalam...",
    "terjebak dalam kegelapan...",
    "tidak ada jalan keluar...",
    "semakin dalam aku tenggelam...",
    "tidak bisa bernafas..."
  ];

  // Set timestamp after mount to avoid hydration mismatch
  useEffect(() => {
    setImageTimestamp(Date.now().toString());
  }, []);

  useEffect(() => {
    if (!showWarning && !showEnter) {
      const interval = setInterval(() => {
        const x = 10 + Math.random() * 80;
        const y = 15 + Math.random() * 70;
        const randomText = whisperLines[Math.floor(Math.random() * whisperLines.length)];
        
        const newBubble: WhisperBubble = {
          id: Date.now() + Math.random(),
          text: randomText,
          x: x,
          y: y,
          delay: 0
        };
        
        setWhisperBubbles(prev => [...prev, newBubble]);
        
        setTimeout(() => {
          setWhisperBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id));
        }, 1500);
        
        if (Math.random() > 0.85 && audioContext) {
          playQuickSound('whisper');
        }
        
      }, 400);
      
      return () => clearInterval(interval);
    }
  }, [showWarning, showEnter, audioContext]);

  const playQuickSound = (type: 'whisper' | 'warning' | 'enter') => {
    if (!audioContext) return;
    
    try {
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      if (type === 'whisper') {
        osc.type = 'sine';
        osc.frequency.value = 300 + Math.random() * 100;
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      } else if (type === 'warning') {
        osc.type = 'sawtooth';
        osc.frequency.value = 150;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      } else if (type === 'enter') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.8);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      }
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + (type === 'whisper' ? 0.3 : 1));
    } catch (e) {
      console.log("Audio error:", e);
    }
  };

  useEffect(() => {
    if (!showWarning && !showEnter) {
      const timer = setTimeout(() => {
        setImageRevealed(true);
        playQuickSound('whisper');
        
        if (imageRef.current) {
          gsap.fromTo(imageRef.current, 
            { opacity: 0, scale: 0.8, filter: "blur(10px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
          );
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showWarning, showEnter]);

  useEffect(() => {
    if (!showWarning && !showEnter) {
      const timer = setTimeout(() => {
        setShowWarning(true);
        playQuickSound('warning');
        setWhisperBubbles([]);
        
        gsap.to(vignetteRef.current, {
          opacity: 0.95,
          duration: 0.8,
          ease: "power2.in"
        });
        
        gsap.to(containerRef.current, {
          backgroundColor: '#050000',
          duration: 0.8
        });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showWarning, showEnter]);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        ctx.resume();
      }
    };
    
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    gsap.to(titleRef.current, {
      opacity: 0.15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const handleWarningChoice = (choice: 'yes' | 'no') => {
    setShowWarning(false);
    
    if (choice === 'yes') {
      setShowEnter(true);
      playQuickSound('enter');
      
      gsap.to(containerRef.current, {
        backgroundColor: '#0a0303',
        duration: 1
      });
      
      gsap.to(vignetteRef.current, {
        opacity: 0.7,
        duration: 1
      });
      
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          opacity: 0.3,
          scale: 0.9,
          duration: 0.8
        });
      }
    } else {
      setShowEnter(false);
      setImageRevealed(false);
      setWhisperBubbles([]);
      
      gsap.to(containerRef.current, {
        backgroundColor: '#0a0a0a',
        duration: 0.5
      });
      
      gsap.to(vignetteRef.current, {
        opacity: 0.4,
        duration: 0.5
      });
      
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          onComplete: () => {
            setImageRevealed(false);
            setTimeout(() => {
              setShowWarning(false);
              setShowEnter(false);
            }, 100);
          }
        });
      }
    }
  };

  const handleEnter = () => {
    playQuickSound('enter');
    
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 1.2,
        onComplete: () => {
          if (onEnter) onEnter();
        }
      });
    } else {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1.2,
        onComplete: onEnter
      });
    }
  };

  const handleScreenClick = () => {
    if (!showWarning && !showEnter) {
      setShowWarning(true);
      setWhisperBubbles([]);
      playQuickSound('warning');
      
      gsap.to(containerRef.current, {
        backgroundColor: '#050000',
        duration: 0.5
      });
      
      gsap.to(vignetteRef.current, {
        opacity: 0.95,
        duration: 0.5
      });
    }
  };

  // Sementara pakai src tanpa timestamp sampai client ready
  const imageSrc = imageTimestamp ? `/maria/as.png?t=${imageTimestamp}` : "/maria/as.png";

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center cursor-pointer transition-colors duration-1000"
      onClick={handleScreenClick}
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #030303 100%)'
      }}
    >
      <div 
        ref={titleRef}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20 opacity-20"
      >
        <span className="text-[#660000] text-xs tracking-[0.5em] font-mono">
          PORTFOLIO
        </span>
        <div className="h-px w-full bg-[#660000]/30 mt-1" />
      </div>

      {/* Image - With cache bypass only on client */}
      <div
        ref={imageRef}
        className={`relative z-10 transition-all duration-1000 ${imageRevealed && !showWarning && !showEnter ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          <Image
            src={imageSrc}
            alt="Mysterious figure"
            fill
            className="object-contain transition-all duration-700"
            style={{
              filter: 'contrast(1.2) brightness(0.8) grayscale(0.7)'
            }}
            priority
            unoptimized
          />
        </div>
        <div className="absolute -inset-4 rounded-full blur-2xl bg-red-900/10 animate-pulse -z-10" />
      </div>

      {/* Whisper Bubbles */}
      {!showWarning && !showEnter && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {whisperBubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute animate-whisper-bubble"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                animation: 'whisperBubble 1.5s ease-out forwards'
              }}
            >
              <div className="bg-black/70 backdrop-blur-md border-2 border-red-900/50 rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-red-800/90 text-base md:text-lg font-mono tracking-wide whitespace-nowrap font-semibold">
                  {bubble.text}
                </p>
              </div>
              <div className="absolute -left-2 bottom-0 w-3 h-3 bg-red-900/50 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-b from-[#0a0303] to-black border-2 border-red-900/80 p-8 max-w-md w-full mx-4 shadow-2xl animate-shake">
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-xl bg-red-900/20 animate-pulse" />
              <h2 className="relative text-red-800 text-2xl text-center font-mono tracking-widest animate-pulse">
                ⚠️ PERINGATAN ⚠️
              </h2>
            </div>
            
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src={imageSrc}
                alt="Warning symbol"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            
            <p className="text-red-800/70 text-center mb-6 text-sm leading-relaxed font-mono">
              "Di balik karya yang kamu lihat,<br/>
              tersimpan cerita yang tidak mudah<br/>
              untuk dicerna."
            </p>
            
            <p className="text-red-700/60 text-xs text-center mb-8 uppercase tracking-wider">
              Apakah kamu siap untuk melihat?
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleWarningChoice('yes')}
                className="px-8 py-3 border-2 border-red-800 text-red-800 hover:bg-red-800 hover:text-white transition-all duration-500 font-mono tracking-wider text-sm hover:scale-105 hover:shadow-lg"
              >
                LANJUTKAN
              </button>
              
              <button
                onClick={() => handleWarningChoice('no')}
                className="px-8 py-3 border-2 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-all duration-500 font-mono tracking-wider text-sm"
              >
                KEMBALI
              </button>
            </div>
          </div>
        </div>
      )}

      {showEnter && !showWarning && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <button
            onClick={handleEnter}
            className="group relative px-12 py-5 border-2 border-red-800/60 hover:border-red-800 transition-all duration-700 hover:scale-105 bg-black/40 backdrop-blur-sm"
          >
            <span className="relative text-red-800/80 group-hover:text-red-800 text-sm tracking-[0.3em] font-light">
              LIHAT PORTOFOLIO
            </span>
            <div className="absolute inset-0 border border-red-800/0 group-hover:border-red-800/30 scale-95 group-hover:scale-100 transition-all duration-700" />
          </button>
        </div>
      )}

      {!showWarning && !showEnter && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-mono animate-pulse z-20">
          [ klik untuk lewati ]
        </div>
      )}

      <div className="absolute bottom-8 right-8 text-[#660000]/20 text-xs font-mono z-20">
        © 2024
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-1000 z-40"
      />

      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, black 90%)',
          opacity: 0.4
        }}
      />

      <style jsx>{`
        @keyframes whisperBubble {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.7);
          }
          15% {
            opacity: 1;
            transform: translate(0, -15px) scale(1);
          }
          85% {
            opacity: 0.9;
            transform: translate(25px, -40px) scale(0.98);
          }
          100% {
            opacity: 0;
            transform: translate(50px, -70px) scale(0.9);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-whisper-bubble {
          animation: whisperBubble 1.6s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DarkIntro;