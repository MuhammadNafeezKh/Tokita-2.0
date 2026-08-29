"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Code2, 
  Server, 
  Palette, 
  Globe, 
  TerminalSquare, 
  Database, 
  Cpu 
} from "lucide-react";
import {
  FaReact,
  FaGithub,
  FaNodeJs,
  FaFigma,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiVite,
  SiMysql,
  SiFlutter,
  SiJavascript,
  SiExpress,
  SiGit,
  SiVercel,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

const TECH_STACK = [
  {
    category: "Frontend Core",
    icon: Code2,
    items: [
      { name: "React.js", icon: FaReact, color: "text-[#61DAFB]" },
      { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
      { name: "TypeScript", icon: SiTypescript, color: "text-[#3178C6]" },
      { name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-[#38B2AC]" },
      { name: "Vite", icon: SiVite, color: "text-[#646CFF]" },
    ]
  },
  {
    category: "Backend & Data",
    icon: Server,
    items: [
      { name: "Node.js", icon: FaNodeJs, color: "text-[#339933]" },
      { name: "Express", icon: SiExpress, color: "text-gray-400" },
      { name: "MySQL", icon: SiMysql, color: "text-[#4479A1]" },
      { name: "SQLite", icon: Database, color: "text-gray-500" },
    ]
  },
  {
    category: "Tools & DevOps",
    icon: TerminalSquare,
    items: [
      { name: "Git & GitHub", icon: FaGithub, color: "text-white" },
      { name: "Vercel", icon: SiVercel, color: "text-white" },
      { name: "Flutter", icon: SiFlutter, color: "text-[#02569B]" },
    ]
  },
  {
    category: "Design",
    icon: Palette,
    items: [
      { name: "Figma", icon: FaFigma, color: "text-[#F24E1E]" },
    ]
  }
];

const LANGUAGES = [
  { name: "Indonesia", level: 100, label: "Native" },
  { name: "English", level: 80, label: "Professional Working" },
  { name: "Japanese", level: 40, label: "Basic (JLPT N5)" },
  { name: "Arabic", level: 25, label: "Elementary" },
];

// ============================================================================
// COMPONENT
// ============================================================================

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pastikan context dibuat ulang setiap render jika perlu
    const ctx = gsap.context(() => {
      
      // 1. Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power3.out", 
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: "top 80%",
            toggleActions: "play none none reverse" // Play saat masuk, reverse saat keluar
          } 
        }
      );

      // 2. Staggered Grid Items
      if (gridRef.current) {
        const cards = gsap.utils.toArray(".tech-card") as HTMLElement[];
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6, 
            stagger: 0.1, 
            ease: "back.out(1.2)", // Efek memantul sedikit agar terlihat hidup
            scrollTrigger: { 
              trigger: gridRef.current, 
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // 3. Language Bars Animation
      const bars = gsap.utils.toArray(".lang-fill") as HTMLElement[];
      gsap.fromTo(
        bars,
        { width: "0%" },
        { 
          width: (i) => `${LANGUAGES[i].level}%`, 
          duration: 1.5, 
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { 
            trigger: ".lang-container", 
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 4. Hover Effects using GSAP (Lebih smooth dari CSS)
      const techItems = gsap.utils.toArray(".tech-item") as HTMLElement[];
      techItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
          gsap.to(item, { scale: 1.1, duration: 0.2, ease: "power2.out" });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-[#2A2A2A] overflow-hidden"
    >
      {/* Background Noise/Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(107,159,191,0.1),_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* ========== HEADER ========== */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-[#6B9FBF]" />
                <span className="text-xs font-mono text-[#6B9FBF] tracking-widest uppercase">Technical Arsenal</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Tools & <br className="hidden md:block" />
                <span className="text-gray-500">Technologies</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed md:text-right">
              Kombinasi teknologi modern untuk membangun aplikasi web yang cepat, responsif, dan skalabel. Fokus pada clean code dan user experience.
            </p>
          </div>
          <div className="w-full h-px bg-white/5 mt-8" />
        </div>

        {/* ========== TECH STACK GRID ========== */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TECH_STACK.map((group, idx) => (
            <div 
              key={idx} 
              className="tech-card group relative bg-[#2D2D2D]/50 border border-white/5 rounded-2xl p-6 hover:bg-[#2D2D2D] hover:border-[#6B9FBF]/20 transition-colors duration-300"
            >
              {/* Header Group */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-[#6B9FBF] group-hover:bg-[#6B9FBF]/10 transition-colors">
                  <group.icon size={20} />
                </div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  {group.category}
                </h3>
              </div>

              {/* Icons Grid */}
              <div className="grid grid-cols-4 gap-4">
                {group.items.map((tech, i) => (
                  <div 
                    key={i} 
                    className="tech-item flex flex-col items-center gap-2 cursor-default"
                    title={tech.name}
                  >
                    <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover/item:border-[#6B9FBF]/30 group-hover/item:bg-[#6B9FBF]/5 transition-all">
                      <tech.icon size={20} className={`${tech.color} opacity-80 group-hover/item:opacity-100 transition-opacity`} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono truncate w-full text-center group-hover/item:text-gray-300">
                      {tech.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ========== LANGUAGES (Terminal Style) ========== */}
        <div className="lang-container max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={16} className="text-gray-500" />
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Language Proficiency</h3>
          </div>

          <div className="space-y-4">
            {LANGUAGES.map((lang, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-gray-300">{lang.name}</span>
                  <span className="text-xs font-mono text-gray-500">{lang.label}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="lang-fill h-full bg-gradient-to-r from-[#6B9FBF] to-[#8FC5F0] rounded-full"
                    style={{ width: '0%' }} // Initial state for GSAP
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* OMORI Divider */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0] opacity-80"></div>
    </section>
  );
};

export default Skills;