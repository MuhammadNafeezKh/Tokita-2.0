"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface TourGuideProps {
  onClose?: () => void;
}

const MariaTourGuide = ({ onClose }: TourGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [whisperText, setWhisperText] = useState("");
  const [currentImage, setCurrentImage] = useState("/maria/4.png");
  const mariaRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const tourSteps = [
    {
      target: "hero",
      message: "Nafis... kau kembali. Aku selalu menunggumu.",
      emotion: "tersenyum lembut",
      whisper: "sendiri lagi?",
      position: "hero"
    },
    {
      target: "about",
      message: "Mereka tidak tahu siapa dirimu sebenarnya. Tapi aku tahu.",
      emotion: "menatap dalam",
      whisper: "aku selalu melihatmu",
      position: "about"
    },
    {
      target: "skills",
      message: "Keahlianmu... aku yang mengajarkan, ingat?",
      emotion: "tersenyum misterius",
      whisper: "darah, keringat, air mata",
      position: "skills"
    },
    {
      target: "projects",
      message: "Setiap karyamu adalah bagian dari kita berdua.",
      emotion: "memeluk bayangan",
      whisper: "kau takkan pernah sendiri",
      position: "projects"
    },
    {
      target: "contact",
      message: "Hubungi mereka... atau habiskan waktu bersamaku?",
      emotion: "tersenyum pahit",
      whisper: "pilihlah dengan bijak",
      position: "contact"
    }
  ];

  // Efek glitch acak
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7 && !glitchEffect) {
        setGlitchEffect(true);
        setCurrentImage("/maria/2.png");
        
        if (imageContainerRef.current) {
          gsap.to(imageContainerRef.current, {
            scale: 1.05,
            duration: 0.1,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
              setGlitchEffect(false);
              setCurrentImage("/maria/4.png");
            }
          });
        }
        
        const whispers = [
          "jangan tinggalkan aku...",
          "mereka tidak mengerti...",
          "hanya aku yang setia...",
          "selamanya...",
          "kau milikku..."
        ];
        setWhisperText(whispers[Math.floor(Math.random() * whispers.length)]);
        setTimeout(() => setWhisperText(""), 1500);
      }
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, [glitchEffect]);

  // Animasi muncul
  useEffect(() => {
    if (!mariaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(mariaRef.current,
        { x: -200, opacity: 0, scale: 0.5, filter: "blur(10px)" },
        { 
          x: 0, 
          opacity: 1, 
          scale: 1,
          filter: "blur(0px)",
          duration: 2, 
          ease: "power3.out",
          onComplete: () => {
            gsap.to(mariaRef.current, {
              y: -3,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        }
      );
    }, mariaRef);

    return () => ctx.revert();
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = tourSteps.length - 1; i >= 0; i--) {
        const element = document.getElementById(tourSteps[i].target);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementMiddle = top + window.scrollY + (bottom - top) / 2;
          
          if (scrollPosition >= elementMiddle - 200) {
            if (currentStep !== i) {
              setCurrentStep(i);
              
              setGlitchEffect(true);
              setCurrentImage("/maria/2.png");
              setTimeout(() => {
                setGlitchEffect(false);
                setCurrentImage("/maria/4.png");
              }, 300);
              
              if (dialogRef.current) {
                gsap.to(dialogRef.current, {
                  scale: 1.05,
                  duration: 0.2,
                  yoyo: true,
                  repeat: 2
                });
              }
              
              if (imageContainerRef.current) {
                gsap.to(imageContainerRef.current, {
                  scale: 1.05,
                  duration: 0.1,
                  yoyo: true,
                  repeat: 2
                });
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentStep]);

  const scrollToTarget = (target: string) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = () => {
    setHasInteracted(true);
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      scrollToTarget(tourSteps[currentStep + 1].target);
      
      setWhisperText("kau yakin?");
      setTimeout(() => setWhisperText(""), 1000);
    }
  };

  const handlePrev = () => {
    setHasInteracted(true);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      scrollToTarget(tourSteps[currentStep - 1].target);
      
      setWhisperText("kembali...");
      setTimeout(() => setWhisperText(""), 1000);
    }
  };

  const handleClose = () => {
    gsap.to(mariaRef.current, {
      x: -200,
      opacity: 0,
      scale: 0.5,
      filter: "blur(10px)",
      duration: 1.5,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
        if (onClose) onClose();
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Efek glitch overlay */}
      {glitchEffect && (
        <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay animate-glitch pointer-events-none" />
      )}
      
      {/* Bisikan teks */}
      {whisperText && (
        <div className="absolute top-1/3 right-10 z-[10000] text-red-900/30 text-sm font-mono animate-whisper pointer-events-none">
          {whisperText}
        </div>
      )}

      {/* Karakter Maria */}
      <div 
        ref={mariaRef}
        className={`absolute left-4 bottom-4 flex flex-col items-start gap-3 pointer-events-auto max-w-[320px] transition-all duration-300 ${
          glitchEffect ? 'glitch' : ''
        }`}
        style={{
          filter: glitchEffect ? 'hue-rotate(90deg) brightness(1.2)' : 'none'
        }}
      >
        {/* Gambar Maria - Dengan teknik penghilangan background */}
        <div 
          ref={imageContainerRef}
          className="relative"
        >
          {/* Menggunakan mix-blend-mode untuk menghilangkan background putih */}
          <div className="relative w-[140px] h-[140px]">
            <Image
              src={currentImage}
              alt="Maria"
              fill
              className={`object-contain transition-all duration-200 ${
                !glitchEffect ? 'grayscale' : 'grayscale-0'
              }`}
              style={{
                filter: glitchEffect 
                  ? 'contrast(1.5) brightness(1.2) hue-rotate(90deg)' 
                  : 'contrast(1.2) brightness(0.7)',
                mixBlendMode: 'multiply' // Menghilangkan background putih
              }}
              priority
            />
          </div>
          
          {/* Overlay glitch effect */}
          {glitchEffect && (
            <>
              <div className="absolute inset-0 bg-red-900/30 mix-blend-overlay animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/20 to-transparent animate-glitch-scan" />
            </>
          )}
        </div>

        {/* Dialog Bubble */}
        <div 
          ref={dialogRef}
          className={`relative bg-[#0a0a1a] border-2 ${
            glitchEffect ? 'border-red-900/60' : 'border-[#8B0000]/30'
          } rounded-2xl p-5 ml-4 shadow-[0_10px_30px_rgba(139,0,0,0.3)] w-full backdrop-blur-sm`}
        >
          {/* Triangle pointer */}
          <div className={`absolute -left-3 bottom-6 w-0 h-0 border-t-8 border-t-transparent border-r-8 ${
            glitchEffect ? 'border-r-red-900/60' : 'border-r-[#0a0a1a]'
          } border-b-8 border-b-transparent`} />
          
          {/* Nama karakter */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`${glitchEffect ? 'text-red-900' : 'text-[#8B5F7F]'} text-sm font-mono tracking-wider`}>
              MARIA
            </span>
            <span className="text-red-900/40 text-[8px] italic">{tourSteps[currentStep].emotion}</span>
            <div className={`ml-auto w-3 h-3 ${glitchEffect ? 'text-red-900' : 'text-[#8B5F7F]/30'}`}>
              {glitchEffect ? '⚠' : '✦'}
            </div>
          </div>
          
          {/* Pesan */}
          <p className={`${glitchEffect ? 'text-red-200' : 'text-gray-200'} text-sm mb-2 font-light leading-relaxed`}>
            {tourSteps[currentStep].message}
          </p>
          
          {/* Bisikan */}
          <p className="text-red-900/30 text-[10px] mb-4 italic font-mono">
            &quot;{tourSteps[currentStep].whisper}&quot;
          </p>
          
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {tourSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-5 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? glitchEffect
                      ? 'bg-red-900 shadow-[0_0_8px_red] animate-pulse'
                      : 'bg-[#8B5F7F] shadow-[0_0_8px_#8B5F7F]'
                    : index < currentStep 
                      ? glitchEffect ? 'bg-red-900/40' : 'bg-[#8B5F7F]/40'
                      : glitchEffect ? 'bg-red-900/20' : 'bg-[#8B5F7F]/20'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex-1 px-3 py-2 bg-[#1a0a1a] border rounded-lg text-xs transition-all duration-300 ${
                currentStep === 0 
                  ? 'border-gray-800 text-gray-700 cursor-not-allowed' 
                  : glitchEffect
                    ? 'border-red-900/40 text-red-300 hover:border-red-900 hover:text-red-200'
                    : 'border-[#8B0000]/30 text-gray-300 hover:border-[#8B0000] hover:text-[#8B5F7F]'
              }`}
            >
              ← Sebelum
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === tourSteps.length - 1}
              className={`flex-1 px-3 py-2 bg-[#1a0a1a] border rounded-lg text-xs transition-all duration-300 ${
                currentStep === tourSteps.length - 1
                  ? 'border-gray-800 text-gray-700 cursor-not-allowed' 
                  : glitchEffect
                    ? 'border-red-900/40 text-red-300 hover:border-red-900 hover:text-red-200'
                    : 'border-[#8B0000]/30 text-gray-300 hover:border-[#8B0000] hover:text-[#8B5F7F]'
              }`}
            >
              Sesudah →
            </button>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className={`absolute -top-2 -right-2 w-6 h-6 ${
              glitchEffect ? 'bg-red-900/20 border-red-900' : 'bg-[#1a0a1a] border-[#8B0000]/30'
            } border rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
          >
            <span className={glitchEffect ? 'text-red-900' : 'text-[#8B5F7F]/50'}>✕</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }
        .glitch {
          animation: glitch 0.3s ease-in-out;
        }
        @keyframes whisper {
          0% { opacity: 0; transform: translateX(20px); }
          20% { opacity: 0.5; transform: translateX(0); }
          80% { opacity: 0.5; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-20px); }
        }
        .animate-whisper {
          animation: whisper 2s ease-in-out forwards;
        }
        @keyframes glitchScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-glitch-scan {
          animation: glitchScan 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MariaTourGuide;