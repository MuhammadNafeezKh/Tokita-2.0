"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Database,
  FileCode,
  Terminal,
  Server,
  GitBranch,
  Cloud,
  Braces,
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
  SiGodotengine,
  SiNextdotjs,
  
} from "react-icons/si";
import { SiFlutter } from "react-icons/si";


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

// ✅ Data Languages untuk menggantikan Most Used Languages
interface LanguageData {
  flag: string;
  name: string;
  level: string;
  percent: number;
  accentColor: string;
}

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const percentRefs = useRef<(HTMLSpanElement | null)[]>([]);

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
        { icon: SiNextdotjs, name: "Next.js", color: "text-gray-900" },
                { icon: SiFlutter, name: "Flutter", color: "text-blue-900" },

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
        { icon: Database, name: "SQLite3", color: "text-grey-500" },
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
        { icon: SiGodotengine, name: "Godot Engine", color: "text-blue-500" },
      ],
    },
  ];

  // ✅ DATA LANGUAGES (diambil dari LanguagesSection)
  const languages: LanguageData[] = [
    { flag: "🇮🇩", name: "Indonesia", level: "Native / Fasih", percent: 100, accentColor: "#6B9FBF" },
    { flag: "🇬🇧", name: "English", level: "B2 (Upper Intermediate)", percent: 75, accentColor: "#5A8AA8" },
    { flag: "🇸🇦", name: "Arabic", level: "A2 (Elementary)", percent: 45, accentColor: "#B08F7C" },
    { flag: "🇯🇵", name: "Japanese", level: "JLPT N5", percent: 40, accentColor: "#B06C6C" },
    { flag: "🇩🇪", name: "German", level: "A1 (Beginner)", percent: 20, accentColor: "#8B7B6E" },
    { flag: "🇷🇺", name: "Russian", level: "Alphabet & Basics", percent: 10, accentColor: "#6B8F8F" },
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

      // ✨ Animasi tiap category card
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

      // ✨ Animasi tiap skill badge
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

      // ✨ Animasi Language Bars + Counter Percentage
      const langCards = document.querySelectorAll<HTMLElement>(".lang-card");
      
      langCards.forEach((card, index) => {
        const barFill = card.querySelector<HTMLElement>(".lang-bar-fill");
        const percentText = percentRefs.current[index];
        const targetPercent = languages[index]?.percent || 0;

        if (!barFill || !percentText) return;

        gsap.set(barFill, { width: "0%" });
        gsap.set(percentText, { innerText: "0" });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.to(barFill, {
              width: `${targetPercent}%`,
              duration: 1.5,
              ease: "power2.out",
            });
            gsap.to(percentText, {
              innerText: targetPercent,
              duration: 1.5,
              ease: "power2.out",
              snap: { innerText: 1 },
              onUpdate: function () {
                percentText.textContent = Math.round(parseFloat(percentText.innerText)) + "%";
              },
            });
          },
          onEnterBack: () => {
            gsap.to(barFill, {
              width: `${targetPercent}%`,
              duration: 1.5,
              ease: "power2.out",
            });
            gsap.to(percentText, {
              innerText: targetPercent,
              duration: 1.5,
              ease: "power2.out",
              snap: { innerText: 1 },
              onUpdate: function () {
                percentText.textContent = Math.round(parseFloat(percentText.innerText)) + "%";
              },
            });
          },
          onLeave: () => {
            gsap.set(barFill, { width: "0%" });
            gsap.set(percentText, { innerText: "0", textContent: "0%" });
          },
          onLeaveBack: () => {
            gsap.set(barFill, { width: "0%" });
            gsap.set(percentText, { innerText: "0", textContent: "0%" });
          },
        });
      });
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
        {/* 🔹 Judul Section */}
        <div className="text-center mb-12">
          <h2 className="skills-title text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-[4px_4px_0px_#000000]">
            ⚙️ Skills & Tools
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#6B9FBF] via-[#B06C6C] to-[#6B9FBF] mx-auto rounded"></div>
        </div>

        {/* 🔹 Grid Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="skill-category-card bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] rounded-2xl overflow-hidden hover:shadow-[12px_12px_0px_#1E2C36] hover:translate-y-[-2px] transition-all duration-300"
            >
              {/* Card Header */}
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

        {/* 🔹 Languages Mastered Section - Menggantikan Most Used Languages */}
        <div className="lang-overview mt-10 p-6 bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] rounded-2xl max-w-3xl mx-auto">
          <h4 className="text-center font-semibold text-white mb-5 text-xl drop-shadow-[2px_2px_0px_#000000]">
            🌍 Languages Mastered
          </h4>
          
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div 
                key={index} 
                className="lang-card flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-90 drop-shadow-[2px_2px_0px_#000000]">
                      {lang.flag}
                    </span>
                    <div>
                      <h5 className="text-sm font-medium text-white drop-shadow-[1px_1px_0px_#000000]">
                        {lang.name}
                      </h5>
                      <span className="text-xs text-[#C0C0C0] italic">
                        {lang.level}
                      </span>
                    </div>
                  </div>
                  <span 
                    ref={(el) => {
                      percentRefs.current[index] = el;
                    }}
                    className="text-xs font-bold text-white bg-[#2C2C2C] px-2.5 py-1 rounded-full border border-[#4A6B7F] font-mono min-w-[3rem] text-center drop-shadow-[1px_1px_0px_#000000]"
                  >
                    0%
                  </span>
                </div>

                <div className="w-full h-2 bg-[#2C2C2C] rounded-full overflow-hidden border border-[#4A6B7F]/30">
                  <div
                    className="lang-bar-fill h-full rounded-full transition-all duration-300 relative"
                    style={{ 
                      background: `linear-gradient(90deg, ${lang.accentColor}, ${lang.accentColor}CC)`,
                      boxShadow: `0 0 8px ${lang.accentColor}40`,
                      width: 0
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual bar legend seperti GitHub */}
          <div className="flex gap-1 mt-4 h-2 rounded-full overflow-hidden border border-[#4A6B7F]/30">
            {languages.map((lang, i) => (
              <div
                key={i}
                className="h-full"
                style={{ 
                  flex: lang.percent,
                  background: lang.accentColor,
                  boxShadow: `0 0 4px ${lang.accentColor}80`
                }}
                title={`${lang.name}: ${lang.percent}%`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Garis pemisah bawah */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF] via-[#B06C6C] to-[#6B9FBF] opacity-50"></div>
    </section>
  );
};

export default Skills;