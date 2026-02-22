"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import timelineData from "../public/data/timeline.json";

type TimelineItem = {
  date: string;
  title: string;
  role?: string;
  description: string;
  details?: string[];
};

const ExperienceTimeline = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const visibleCards = 3;
  const CARD_TOTAL_WIDTH = 468; // 420px card + 48px gap

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    let startX = 0;
    let currentTranslateX = 0;
    let isDown = false;

    const getBoundaries = () => {
      const totalWidth = timelineData.length * CARD_TOTAL_WIDTH;
      const viewportWidth = viewport.clientWidth;
      const maxDrag = 0;
      const minDrag = -(totalWidth - viewportWidth);
      return { min: minDrag, max: maxDrag };
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      setIsDragging(true);
      startX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      gsap.killTweensOf(track);
      viewport.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const walk = clientX - startX;
      const newX = currentTranslateX + walk;
      const { min, max } = getBoundaries();
      const boundedX = Math.max(min, Math.min(max, newX));
      gsap.set(track, { x: boundedX });
      startX = clientX;
      currentTranslateX = boundedX;
    };

    const onEnd = () => {
      if (!isDown) return;
      isDown = false;
      setIsDragging(false);
      viewport.style.cursor = "grab";
      document.body.style.userSelect = "";

      // ✅ DIUBAH: Tidak balik ke posisi tertentu, tetap di posisi terakhir
      const { min } = getBoundaries();
      
      // Hitung index berdasarkan posisi saat ini (optional, untuk update dots)
      const newIndex = Math.round(Math.abs(currentTranslateX / min) * (timelineData.length - visibleCards));
      const boundedIndex = Math.max(0, Math.min(newIndex, timelineData.length - visibleCards));
      setCurrentIndex(boundedIndex);
      
      // Tidak perlu animate balik, tetap di posisi sekarang
      // currentTranslateX sudah di posisi yang benar
    };

    viewport.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    viewport.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      viewport.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      viewport.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  // Hover effect untuk dots
  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];
    items.forEach((item) => {
      const dot = item.querySelector(".timeline-dot");
      if (!dot) return;
      const onEnter = () => gsap.to(dot, { scale: 1.5, duration: 0.2, ease: "power2.out" });
      const onLeave = () => gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out" });
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      return () => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
      };
    });
  }, []);

  const goToIndex = (index: number) => {
    if (!trackRef.current) return;
    setCurrentIndex(index);
    gsap.to(trackRef.current, {
      x: -index * CARD_TOTAL_WIDTH,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        // Update currentTranslateX saat animasi berlangsung
        // Tidak perlu karena pakai gsap.to langsung
      }
    });
  };

  return (
    <section
      id="journey"
      className="relative min-h-screen overflow-hidden bg-[#1A1A1A] py-20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(74, 107, 127, 0.12) 0%, transparent 40%),
          radial-gradient(circle at 70% 60%, rgba(139, 76, 76, 0.12) 0%, transparent 40%),
          repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.2) 0px, rgba(44, 44, 44, 0.2) 2px, transparent 2px, transparent 6px)
        `
      }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Background Grid - OMORI style */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 107, 127, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 107, 127, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header - OMORI style */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[4px_4px_0px_#000000]">
            Pendidikan & Perjalanan
          </h2>
          <p className="text-[#F0F0F0] text-sm md:text-base drop-shadow-[2px_2px_0px_#000000]">
            {isDragging ? "👋 Lepaskan" : "🖱️ Bebas drag - tidak akan balik"}
          </p>
        </div>

        {/* Viewport Area */}
        <div 
          ref={viewportRef}
          className="relative w-full h-[420px] overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y"
        >
          {/* Track yang bergerak */}
          <div 
            ref={trackRef}
            className="absolute flex gap-12 left-0 will-change-transform"
            style={{ width: "max-content" }} 
          >
            {(timelineData as TimelineItem[]).map((item, index) => {
              const isTop = index % 2 === 0; // ✅ 0,2,4 = ATAS | 1,3,5 = BAWAH

              return (
                <li
                  key={index}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  className="group relative flex-shrink-0 w-[380px] md:w-[420px] list-none h-[380px]"
                >
                  {/* Container untuk kartu - diposisikan absolut: atas atau bawah */}
                  <div 
                    className={`absolute left-0 right-0 flex flex-col items-center px-2 z-10 ${
                      isTop ? "top-0" : "bottom-0"
                    }`}
                  >
                    {/* Timeline Dot - OMORI style */}
                    <span
                      className="timeline-dot relative z-20 size-4 shrink-0 rounded-full 
                               bg-[#6B9FBF] border-4 border-[#1A1A1A] shadow-[0_0_10px_rgba(107,159,191,0.5)]
                               transition-transform duration-200"
                      style={{ 
                        marginBottom: isTop ? "-8px" : "16px",
                        marginTop: isTop ? "16px" : "-8px"
                      }}
                    />

                    {/* Card Body - OMORI dark style */}
                    <div className="bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] 
                      rounded-2xl p-6 w-full text-center md:text-left
                      hover:shadow-[12px_12px_0px_#1E2C36] hover:translate-y-[-2px] transition-all duration-300
                    ">
                      <time className="inline-block px-3 py-1 text-[10px] md:text-xs font-bold 
                        rounded-full bg-[#2C2C2C] border border-[#6B9FBF] text-[#6B9FBF] mb-3 tracking-wide uppercase">
                        {item.date}
                      </time>

                      <h3 className="text-lg font-bold text-white mb-1 leading-tight drop-shadow-[2px_2px_0px_#000000]">
                        {item.title}
                      </h3>

                      {item.role && (
                        <p className="text-xs font-semibold text-[#8FC5F0] mb-3 drop-shadow-[1px_1px_0px_#000000]">
                          {item.role}
                        </p>
                      )}

                      <p className="text-sm text-[#F0F0F0] leading-relaxed mb-4 text-justify md:text-left drop-shadow-[1px_1px_0px_#000000]">
                        {item.description}
                      </p>

                      {item.details && (
                        <ul className="space-y-2 text-left">
                          {item.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#C0C0C0] drop-shadow-[1px_1px_0px_#000000]">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6B9FBF] flex-shrink-0 shadow-[0_0_5px_rgba(107,159,191,0.5)]" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Center guideline visual - OMORI style */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-[#4A6B7F]/20 rounded-full" />
                </li>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots - OMORI style (tetap bisa diklik untuk navigasi) */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ 
            length: Math.max(1, timelineData.length - visibleCards + 1) 
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={`transition-all duration-300 ${
                currentIndex === i 
                  ? "w-6 h-2 bg-[#6B9FBF] shadow-[0_0_10px_rgba(107,159,191,0.5)]" 
                  : "w-2 h-2 bg-[#4A6B7F]/30 hover:bg-[#6B9FBF]/60"
              } rounded-full`}
              aria-label={`Lihat halaman ${i + 1}`}
            />
          ))}
        </div>
        
        {/* Info bahwa drag bebas */}
        <p className="text-center text-[#8A8A8A] text-xs mt-2 drop-shadow-[1px_1px_0px_#000000]">
          Bebas geser - tidak akan kembali ke posisi awal
        </p>
      </div>

      {/* Garis pemisah bawah - OMORI style */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF] via-[#B06C6C] to-[#6B9FBF] opacity-50"></div>
    </section>
  );
};

export default ExperienceTimeline;