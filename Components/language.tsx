'use client';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Language {
  flag: string;
  name: string;
  level: string;
  percent: number;
  accentColor: string;
}

const LanguagesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const percentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const languages: Language[] = [
    { flag: "🇮🇩", name: "Indonesia", level: "Native / Fasih", percent: 100, accentColor: "#6B9FBF" },
    { flag: "🇬🇧", name: "English", level: "B2 (Upper Intermediate)", percent: 75, accentColor: "#5A8AA8" },
    { flag: "🇸🇦", name: "Arabic", level: "A2 (Elementary)", percent: 45, accentColor: "#B08F7C" },
    { flag: "🇯🇵", name: "Japanese", level: "JLPT N5", percent: 40, accentColor: "#B06C6C" },
    { flag: "🇩🇪", name: "German", level: "A1 (Beginner)", percent: 20, accentColor: "#8B7B6E" },
    { flag: "🇷🇺", name: "Russian", level: "Alphabet & Basics", percent: 10, accentColor: "#6B8F8F" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animasi Judul
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Animasi Cards dengan Stagger
      gsap.fromTo(
        ".lang-card",
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 3. Animasi Progress Bar + Counter Percentage
      const cards = document.querySelectorAll<HTMLElement>(".lang-card");
      
      cards.forEach((card, index) => {
        const barFill = card.querySelector<HTMLElement>(".lang-bar-fill");
        const percentText = percentRefs.current[index];
        const targetPercent = languages[index]?.percent || 0;

        if (!barFill || !percentText) return;

        gsap.set(barFill, { width: "0%" });
        gsap.set(percentText, { innerText: "0" });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => animateCard(barFill, percentText, targetPercent),
          onEnterBack: () => animateCard(barFill, percentText, targetPercent),
          onLeave: () => resetCard(barFill, percentText),
          onLeaveBack: () => resetCard(barFill, percentText),
        });

        function animateCard(fill: HTMLElement, text: HTMLSpanElement, percent: number) {
          gsap.to(fill, {
            width: `${percent}%`,
            duration: 1.5,
            ease: "power2.out",
          });

          gsap.to(text, {
            innerText: percent,
            duration: 1.5,
            ease: "power2.out",
            snap: { innerText: 1 },
            onUpdate: function () {
              text.textContent = Math.round(parseFloat(text.innerText)) + "%";
            },
          });
        }

        function resetCard(fill: HTMLElement, text: HTMLSpanElement) {
          gsap.set(fill, { width: "0%" });
          gsap.set(text, { innerText: "0", textContent: "0%" });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [languages]);

  return (
    <section
      id="languages"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-6 md:px-16 bg-[#1A1A1A] overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(74, 107, 127, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 76, 76, 0.08) 0%, transparent 40%),
          repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.15) 0px, rgba(44, 44, 44, 0.15) 2px, transparent 2px, transparent 6px)
        `
      }}
    >
      {/* Overlay gelap lembut */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* ✨ Subtle Decorative Break Lines - OMORI style */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A6B7F]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B4C4C]/30 to-transparent" />
      
      {/* Side Accent Dots - OMORI style */}
      <div className="absolute top-1/3 left-4 w-1 h-1 rounded-full bg-[#6B9FBF] opacity-30" />
      <div className="absolute bottom-1/3 right-4 w-1 h-1 rounded-full bg-[#B06C6C] opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <h2 
            ref={titleRef}
            className="about-title text-4xl md:text-6xl font-bold text-white font-poppins drop-shadow-[4px_4px_0px_#000000]"
          >
            🌐 Languages Mastered
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-[#6B9FBF]/60 via-[#8B7B6E]/60 to-[#B06C6C]/60 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cards-container">
          {languages.map((lang, index) => (
            <div 
              key={index} 
              className="lang-card bg-[#232323]/90 border border-[#3A3A3A] rounded-2xl p-6 shadow-[6px_6px_0px_#1E2C36] hover:shadow-[8px_8px_0px_#1E2C36] hover:translate-y-[-2px] transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-3xl opacity-90 filter drop-shadow-[2px_2px_0px_#000000]">{lang.flag}</span>
                  <div>
                    <h3 className="text-base font-medium text-white font-poppins drop-shadow-[2px_2px_0px_#000000]">{lang.name}</h3>
                    <span className="text-xs text-[#C0C0C0] italic font-inter drop-shadow-[1px_1px_0px_#000000]">{lang.level}</span>
                  </div>
                </div>
                
                <span 
                  ref={(el) => {
                    percentRefs.current[index] = el;
                  }}
                  className="text-xs font-bold text-white bg-[#2C2C2C] px-2.5 py-1 rounded-full border border-[#4A6B7F] font-mono min-w-[3rem] text-center drop-shadow-[2px_2px_0px_#000000]"
                >
                  0%
                </span>
              </div>

              <div className="lang-bar-container w-full h-2 bg-[#2C2C2C] rounded-full overflow-hidden border border-[#4A6B7F]/30">
                <div
                  className="lang-bar-fill h-full rounded-full will-change-[width] relative"
                  style={{ 
                    background: `linear-gradient(90deg, ${lang.accentColor}, ${lang.accentColor}CC)`,
                    boxShadow: `0 0 8px ${lang.accentColor}40` 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                </div>
              </div>

              <div 
                className="h-px w-12 rounded-full opacity-30"
                style={{ background: lang.accentColor }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Garis pemisah bawah */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF]/30 via-[#B06C6C]/30 to-[#6B9FBF]/30"></div>
    </section>
  );
};

export default LanguagesSection;