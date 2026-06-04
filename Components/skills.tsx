"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Database,
  FileCode,
  Terminal,
  GitBranch,
  Cloud,
  Braces,
  Code2,
  Layers,
  Palette,
} from "lucide-react";
import {
  FaReact,
  FaGithub,
  FaNodeJs,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiTypescript,
  SiFigma,
  SiCanva,
  SiVite,
  SiMysql,
  SiNextdotjs,
} from "react-icons/si";
import { SiFlutter } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TYPES
// ============================================================================
interface SkillItem {
  icon: React.ElementType;
  name: string;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: SkillItem[];
}

interface LanguageData {
  flag: string;
  name: string;
  level: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const skillCategories: SkillCategory[] = [
    {
      title: "Front-End Development",
      icon: Code2,
      skills: [
        { icon: FileCode, name: "JavaScript", color: "text-yellow-400" },
        { icon: SiTypescript, name: "TypeScript", color: "text-blue-500" },
        { icon: FaReact, name: "React.js", color: "text-sky-400" },
        { icon: SiNextdotjs, name: "Next.js", color: "text-white" },
        { icon: SiVite, name: "Vite", color: "text-purple-400" },
        { icon: SiFlutter, name: "Flutter", color: "text-sky-500" },
        { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-400" },
      ],
    },
    {
      title: "Back-End & DevOps",
      icon: Layers,
      skills: [
        { icon: FaNodeJs, name: "Node.js", color: "text-green-500" },
        { icon: Braces, name: "Express.js", color: "text-gray-400" },
        { icon: FaGithub, name: "GitHub", color: "text-white" },
        { icon: GitBranch, name: "Git", color: "text-orange-500" },
        { icon: Cloud, name: "Vercel / Netlify", color: "text-white" },
        { icon: Terminal, name: "CLI / Bash", color: "text-green-400" },
        { icon: SiMysql, name: "MySQL / MariaDB", color: "text-blue-400" },
        { icon: Database, name: "SQLite3", color: "text-gray-400" },
      ],
    },
    {
      title: "UI/UX & Design",
      icon: Palette,
      skills: [
        { icon: SiFigma, name: "Figma", color: "text-pink-500" },
        { icon: SiCanva, name: "Canva", color: "text-cyan-400" },
      ],
    },
  ];

  const languages: LanguageData[] = [
    { flag: "🇮🇩", name: "Indonesia", level: "Native" },
    { flag: "🇬🇧", name: "English", level: "B2 (Upper Intermediate)" },
    { flag: "🇯🇵", name: "Japanese", level: "JLPT N5" },
    { flag: "🇸🇦", name: "Arabic", level: "A2 (Elementary)" },
  ];

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );

      // Category cards staggered
      const cards = gsap.utils.toArray(".skill-category-card") as HTMLElement[];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(0.8)", scrollTrigger: { trigger: ".skills-grid", start: "top 85%" } }
      );

      // Skill badges
      const badges = gsap.utils.toArray(".skill-badge") as HTMLElement[];
      gsap.fromTo(
        badges,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "power2.out", scrollTrigger: { trigger: ".skills-grid", start: "top 85%" } }
      );

      // Language cards
      const langCards = gsap.utils.toArray(".lang-card") as HTMLElement[];
      gsap.fromTo(
        langCards,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ".lang-section", start: "top 85%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-[#2A2A2A] overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B9FBF]/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ========== HEADER ========== */}
        <div ref={headerRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B9FBF] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6B9FBF]" />
            </span>
            <span className="text-[11px] font-mono text-gray-400 tracking-wide">TECH STACK</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Skills & Tools
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Technologies I work with to build modern web applications
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#6B9FBF] to-transparent mx-auto mt-5 rounded-full" />
        </div>

        {/* ========== SKILLS GRID ========== */}
        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="skill-category-card group bg-[#2D2D2D] border border-white/10 rounded-2xl overflow-hidden hover:border-[#6B9FBF]/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/5">
                  <Icon size={16} className="text-[#6B9FBF]" />
                  <h3 className="text-sm font-medium text-white tracking-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Card Body - Skill Badges */}
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => {
                      const IconSkill = skill.icon;
                      return (
                        <div
                          key={i}
                          className="skill-badge flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 hover:border-[#6B9FBF]/30 transition-all duration-200 cursor-default group/badge"
                          title={skill.name}
                        >
                          <IconSkill
                            size={12}
                            className={`${skill.color} flex-shrink-0 group-hover/badge:scale-110 transition-transform duration-200`}
                          />
                          <span className="text-xs font-medium text-gray-300">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========== LANGUAGES SECTION ========== */}
        <div className="lang-section max-w-2xl mx-auto">
          <div className="text-center mb-5">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Languages
            </h4>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#6B9FBF] to-transparent mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="lang-card flex justify-between items-center bg-[#2D2D2D] border border-white/10 rounded-xl px-4 py-2.5 hover:border-[#6B9FBF]/30 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium text-white">
                    {lang.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-500">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GARIS PEMISAH - OMORI style di bagian bawah */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0]"></div>
    </section>
  );
};

export default Skills;