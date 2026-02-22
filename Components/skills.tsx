"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Database,
  Globe,
  FileCode,
  Terminal,
  Server,
  GitBranch,
  Cloud,
  Braces,
  Zap,
} from "lucide-react";
import {
  FaReact,
  FaVuejs,
  FaPython,
  FaBootstrap,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  FaNodeJs,
  FaUnity,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiTypescript,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiCanva,
  SiArduino,
  SiRobloxstudio,
  SiVite,
  SiMysql,
  SiMongodb,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// ✅ Tipe data untuk skill
interface SkillItem {
  icon: React.ElementType;
  name: string;
  color: string;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const skillCategories: SkillCategory[] = [
    {
      title: "🌐 Front-End Development",
      skills: [
        { icon: FaHtml5, name: "HTML5", color: "text-orange-500" },
        { icon: FaCss3Alt, name: "CSS3", color: "text-blue-500" },
        { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-400" },
        { icon: FaBootstrap, name: "Bootstrap 5", color: "text-purple-600" },
        { icon: FileCode, name: "JavaScript", color: "text-yellow-400" },
        { icon: SiTypescript, name: "TypeScript", color: "text-blue-600" },
        { icon: FaReact, name: "React.js", color: "text-sky-400" },
        { icon: SiVite, name: "Vite", color: "text-purple-500" },
        { icon: FaVuejs, name: "Vue.js", color: "text-emerald-500" },
      ],
    },
    {
      title: "🧠 Back-End & DevOps",
      skills: [
        { icon: FaNodeJs, name: "Node.js", color: "text-green-600" },
        { icon: Braces, name: "Express.js", color: "text-gray-700" },
        { icon: FaGithub, name: "GitHub", color: "text-gray-900" },
        { icon: GitBranch, name: "Git", color: "text-orange-600" },
        { icon: Cloud, name: "Vercel / Netlify", color: "text-black" },
        { icon: Terminal, name: "CLI / Bash", color: "text-green-500" },
      ],
    },
    {
      title: "💾 Databases",
      skills: [
        { icon: SiMysql, name: "MySQL / MariaDB", color: "text-blue-500" },
        { icon: SiMongodb, name: "MongoDB", color: "text-green-500" },
        { icon: Database, name: "Prisma ORM", color: "text-indigo-500" },
      ],
    },
    {
      title: "🎨 UI/UX & Design Tools",
      skills: [
        { icon: SiFigma, name: "Figma", color: "text-pink-600" },
        { icon: SiAdobeillustrator, name: "Illustrator", color: "text-orange-500" },
        { icon: SiAdobephotoshop, name: "Photoshop", color: "text-blue-600" },
        { icon: SiCanva, name: "Canva", color: "text-cyan-500" },
      ],
    },
    {
      title: "📊 Data & Scripting",
      skills: [
        { icon: FaPython, name: "Python", color: "text-yellow-500" },
        { icon: Database, name: "Pandas", color: "text-blue-600" },
        { icon: FileCode, name: "Chart.js", color: "text-pink-600" },
      ],
    },
    {
      title: "🎮 Creative & Embedded",
      skills: [
        { icon: SiArduino, name: "C++ / Arduino", color: "text-teal-500" },
        { icon: SiRobloxstudio, name: "Roblox (Luau)", color: "text-black" },
        { icon: FaUnity, name: "Unity Engine", color: "text-gray-800" },
      ],
    },
  ];

  // 🔹 Data untuk GitHub-style language overview
  const languageStats = [
    { name: "HTML/CSS", percent: 32, color: "bg-[#6B9FBF]" },
    { name: "JavaScript", percent: 30, color: "bg-[#8FC5F0]" },
    { name: "TypeScript", percent: 18, color: "bg-[#4A6B7F]" },
    { name: "Python", percent: 12, color: "bg-[#B06C6C]" },
    { name: "Other", percent: 8, color: "bg-[#5C3A3A]" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ✨ Animasi judul section
      gsap.fromTo(
        ".skills-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      // ✨ Animasi tiap category card - DIPERBAIKI dengan type assertion
      const cards = gsap.utils.toArray(".skill-category-card") as HTMLElement[];
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.3)",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ✨ Animasi tiap skill badge - DIPERBAIKI dengan type assertion
      const badges = gsap.utils.toArray(".skill-badge") as HTMLElement[];
      badges.forEach((badge) => {
        gsap.fromTo(
          badge,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: badge,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

   // ✨ Animasi GitHub-style bars - DIPERBAIKI
gsap.fromTo(
  ".lang-bar",
  { width: 0 },
  {
    width: (i: number, target: HTMLElement) => 
      parseFloat(target.getAttribute("data-width") || "0"),
    duration: 1.2,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".lang-overview",
      start: "top 85%",
    },
  }
);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen bg-[#1A1A1A] py-20 px-4 overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(74, 107, 127, 0.12) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 76, 76, 0.12) 0%, transparent 40%),
          repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.2) 0px, rgba(44, 44, 44, 0.2) 2px, transparent 2px, transparent 6px)
        `
      }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 🔹 Judul Section - OMORI style */}
        <div className="text-center mb-12">
          <h2 className="skills-title text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-[4px_4px_0px_#000000]">
            ⚙️ Skills & Tools
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#6B9FBF] via-[#B06C6C] to-[#6B9FBF] mx-auto rounded"></div>
        </div>

        {/* 🔹 Grid Categories - OMORI dark style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="skill-category-card bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] rounded-2xl overflow-hidden hover:shadow-[12px_12px_0px_#1E2C36] hover:translate-y-[-2px] transition-all duration-300"
            >
              {/* Card Header - OMORI style */}
              <div className="bg-gradient-to-r from-[#2C2C2C] to-[#232323] border-b-2 border-[#4A6B7F] py-3 px-4">
                <h3 className="text-base font-semibold text-white drop-shadow-[2px_2px_0px_#000000]">
                  {category.title}
                </h3>
              </div>

              {/* Card Body - Skill Badges */}
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={i}
                        className="skill-badge flex items-center gap-1.5 bg-[#2C2C2C] border border-[#4A6B7F] rounded-full px-3 py-1.5 hover:bg-[#3A3A3A] hover:border-[#6B9FBF] transition-all duration-200 cursor-default group shadow-[2px_2px_0px_#1E2C36]"
                        title={skill.name}
                      >
                        <Icon
                          size={14}
                          className={`${skill.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-200 drop-shadow-[1px_1px_0px_#000000]`}
                        />
                        <span className="text-xs font-medium text-white whitespace-nowrap drop-shadow-[1px_1px_0px_#000000]">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 GitHub-style Language Overview - OMORI style */}
        <div className="lang-overview mt-10 p-4 bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] rounded-2xl max-w-2xl mx-auto">
          <h4 className="text-center font-semibold text-white mb-3 text-sm drop-shadow-[2px_2px_0px_#000000]">
            📊 Most Used Languages
          </h4>
          <div className="space-y-2">
            {languageStats.map((lang, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium text-white w-24 flex-shrink-0 drop-shadow-[1px_1px_0px_#000000]">
                  {lang.name}
                </span>
                <div className="flex-1 h-2 bg-[#2C2C2C] rounded-full overflow-hidden border border-[#4A6B7F]/30">
                  <div
                    className={`lang-bar h-full ${lang.color} rounded-full transition-all duration-300`}
                    data-width={`${lang.percent}%`}
                    style={{ width: 0 }}
                    role="progressbar"
                    aria-valuenow={lang.percent}
                    aria-label={`${lang.name}: ${lang.percent}%`}
                  ></div>
                </div>
                <span className="text-xs text-[#F0F0F0] w-10 text-right drop-shadow-[1px_1px_0px_#000000]">
                  {lang.percent}%
                </span>
              </div>
            ))}
          </div>
          {/* Visual bar legend seperti GitHub - OMORI style */}
          <div className="flex gap-1 mt-3 h-2 rounded-full overflow-hidden border border-[#4A6B7F]/30">
            {languageStats.map((lang, i) => (
              <div
                key={i}
                className={`${lang.color} flex-1`}
                style={{ flex: lang.percent }}
                title={`${lang.name}: ${lang.percent}%`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Garis pemisah bawah - OMORI style */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF] via-[#B06C6C] to-[#6B9FBF] opacity-50"></div>

      {/* 🔹 Custom CSS */}
      <style>{`
        .rounded-4 { border-radius: 1rem !important; }
        .rounded-full { border-radius: 9999px !important; }
        
        .skill-badge:hover {
          transform: translateY(-1px);
        }
        .lang-bar { transition: width 0.3s ease; }
        
        /* Warna untuk language bars */
        .bg-\\[\\#6B9FBF\\] { background-color: #6B9FBF; }
        .bg-\\[\\#8FC5F0\\] { background-color: #8FC5F0; }
        .bg-\\[\\#4A6B7F\\] { background-color: #4A6B7F; }
        .bg-\\[\\#B06C6C\\] { background-color: #B06C6C; }
        .bg-\\[\\#5C3A3A\\] { background-color: #5C3A3A; }
      `}</style>
    </section>
  );
};

export default Skills;