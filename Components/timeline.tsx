"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap, Calendar, ArrowRight } from "lucide-react";
import timelineData from "../public/data/timeline.json";

gsap.registerPlugin(ScrollTrigger);

type TimelineItem = {
  date: string;
  title: string;
  role?: string;
  description: string;
  details?: string[];
  type?: "education" | "work" | "certification";
};

const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Ref khusus untuk track yang akan BERGERAK
  const scrollingTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out", 
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: "top 80%" 
          } 
        }
      );

      // 2. Horizontal Scroll Logic
      const track = scrollingTrackRef.current;
      if (!track || !sectionRef.current) return;

      // Hitung jarak geser: Lebar Track - Lebar Layar + Padding Akhir
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth + 100);
      };

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top", // Pin saat bagian atas section menyentuh atas layar
        end: () => `+=${Math.abs(getScrollAmount())}`, // Durasi pin sesuai lebar geser
        pin: true,       // Section menempel
        scrub: 1,        // Animasi mengikuti scroll bar
        animation: tween,// Gerakkan track
        invalidateOnRefresh: true,
        anticipatePin: 1 // Mencegah jitter saat mulai pin
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pisahkan data
  const educationData = timelineData.find(item => item.type === "education") || timelineData[0];
  const experienceData = timelineData.filter(item => item.type !== "education");

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "work": return <Briefcase size={18} />;
      case "education": return <GraduationCap size={18} />;
      default: return <Calendar size={18} />;
    }
  };

  return (
    // PENTING: Jangan pakai overflow-hidden di sini agar pinning GSAP bekerja
    <section
      id="journey"
      ref={sectionRef}
      className="relative w-full bg-[#2A2A2A] min-h-screen flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#6B9FBF]/10 via-[#2A2A2A] to-[#2A2A2A] pointer-events-none" />

      {/* HEADER (Fixed di dalam section yang di-pin) */}
      <div className="absolute top-8 left-0 w-full z-30 px-6 md:px-12 pointer-events-none">
        <div ref={headerRef} className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B9FBF] animate-pulse" />
              <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Timeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Perjalanan <span className="text-[#6B9FBF]">Karir</span>
            </h2>
          </div>
          <p className="hidden md:block text-xs text-gray-500 font-mono">SCROLL TO EXPLORE →</p>
        </div>
      </div>

      {/* CONTAINER UTAMA */}
      <div className="relative w-full h-screen flex items-center pl-6 md:pl-12">
        
        {/* 1. KARTU PENDIDIKAN (STICKY / DIAM) */}
        {/* Posisi absolute terhadap section, jadi TIDAK ikut bergeser */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-[280px] md:w-[380px]">
          <div className="bg-[#2D2D2D]/90 backdrop-blur-xl border border-[#6B9FBF]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6B9FBF]/20 blur-3xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-[#6B9FBF]/30" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#6B9FBF]/10 rounded-lg text-[#6B9FBF]">
                <GraduationCap size={20} />
              </div>
              <span className="text-xs font-bold text-[#6B9FBF] uppercase tracking-wider">Foundation</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{educationData.title}</h3>
            <p className="text-sm text-gray-400 mb-4 font-medium">{educationData.role}</p>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-6 border-l-2 border-[#6B9FBF]/30 pl-3">
              {educationData.description}
            </p>

            <ul className="space-y-2">
              {educationData.details?.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B9FBF] flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. TRACK EXPERIENCE (BERGERAK HORIZONTAL) */}
        {/* Hanya elemen ini yang akan digeser oleh GSAP */}
        <div
          ref={scrollingTrackRef}
          // Padding kiri besar agar kartu pertama muncul setelah kartu pendidikan
          className="flex items-center gap-6 h-full w-max pl-[320px] md:pl-[440px] pr-[50vw]"
        >
          {experienceData.map((item, index) => (
            <div
              key={index}
              className="w-[300px] md:w-[340px] h-[420px] flex-shrink-0 list-none"
            >
              <div className="h-full bg-[#252525] border border-white/5 rounded-3xl p-6 hover:border-[#6B9FBF]/20 hover:bg-[#2A2A2A] transition-all duration-300 flex flex-col group relative">
                
                {/* Garis konektor visual */}
                <div className="absolute left-0 top-1/2 -translate-x-full h-px w-6 bg-white/10 hidden md:block" />

                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-300 group-hover:text-[#6B9FBF] group-hover:bg-[#6B9FBF]/10 transition-colors">
                    {getTypeIcon(item.type)}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                    {item.date}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6B9FBF] font-medium mb-4">{item.role}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="space-y-2">
                    {item.details?.slice(0, 3).map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <ArrowRight size={10} className="text-[#6B9FBF] flex-shrink-0" />
                        <span className="truncate">{detail.replace(/^(Project|Tech Stack|Fokus|Peran|Keahlian):/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest">Detail</span>
                  <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#6B9FBF] group-hover:bg-[#6B9FBF] transition-all">
                    <ArrowRight size={12} className="text-gray-500 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OMORI Divider */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0] opacity-80 z-30" />
    </section>
  );
};

export default ExperienceTimeline;