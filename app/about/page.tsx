"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Palette, Gamepad2 } from "lucide-react";
import { BiSolidMoviePlay } from "react-icons/bi";

gsap.registerPlugin(ScrollTrigger);

const AboutGrid = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animasi title
      gsap.fromTo(
        ".about-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-title",
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Animasi semua card dengan stagger
      gsap.fromTo(
        ".about-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cards-container",
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-6 md:px-16 bg-[#2A2A2A] overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(74, 107, 127, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 70% 60%, rgba(139, 76, 76, 0.15) 0%, transparent 40%),
          repeating-linear-gradient(45deg, rgba(55, 55, 55, 0.3) 0px, rgba(55, 55, 55, 0.3) 2px, transparent 2px, transparent 6px)
        `
      }}
    >
      {/* Overlay gelap OMORI style - lebih tipis */}
      <div className="absolute inset-0 bg-black/10 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="about-title text-5xl md:text-6xl font-bold text-center text-white mb-12" 
            style={{
              textShadow: `
                3px 3px 0 #2A2A2A,
                5px 5px 0 rgba(0,0,0,0.3),
                0 0 10px rgba(255,255,255,0.3)
              `
            }}>
          About Me 💬
        </h2>

        {/* Intro text - OMORI style dengan efek lebih terang */}
        <div className="text-white text-lg md:text-xl font-inter mb-16 space-y-4 p-8 rounded-2xl border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#2A3A44]"
             style={{
               background: 'rgba(45, 45, 45, 0.95)',
               textShadow: '2px 2px 0 #2A2A2A, 0 0 10px rgba(255,255,255,0.2)'
             }}>
          <p>
            {"Hi! I'm"} <span className="font-semibold text-[#8FC5F0]">Muhammad Dzurunnafis Khairuddin</span>, Web developer & UI/UX design enthusiast from Jakarta, Indonesia.
          </p>
          <p>
            Passionate about philosophy, psychology, and history — always exploring human existence and empathy.
          </p>
          <p>
            Outside coding & design, I enjoy reading, watching documentaries, anime, and exploring nature.
          </p>
          <p className="text-[#F08B8B] font-semibold">An INFJ!</p>
        </div>

        {/* Cards grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-8 cards-container">
          {/* Left column */}
          <div className="space-y-6">
            <div className="about-card bg-[#2D2D2D] border-2 border-[#8FC5F0] shadow-[8px_8px_0px_#2A3A44] rounded-2xl p-6 hover:shadow-[12px_12px_0px_#2A3A44] hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-start gap-3">
              <div className="bg-[#383838] p-3 rounded-lg border-2 border-[#8FC5F0] shadow-[4px_4px_0px_#2A3A44]">
                <Code2 size={36} className="text-[#8FC5F0]" />
              </div>
              <h3 className="text-xl font-semibold text-white" style={{textShadow: '2px 2px 0 #2A2A2A, 0 0 8px rgba(255,255,255,0.3)'}}>Frontend Development</h3>
              <p className="text-white text-base" style={{textShadow: '1px 1px 0 #2A2A2A, 0 0 5px rgba(255,255,255,0.2)'}}>
                Building responsive, modern websites using HTML, CSS, JavaScript, and React. I focus on clean code, accessibility, and smooth user experiences.
              </p>
            </div>

            <div className="about-card bg-[#2D2D2D] border-2 border-[#F08B8B] shadow-[8px_8px_0px_#4A2F2F] rounded-2xl p-6 hover:shadow-[12px_12px_0px_#4A2F2F] hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-start gap-3">
              <div className="bg-[#383838] p-3 rounded-lg border-2 border-[#F08B8B] shadow-[4px_4px_0px_#4A2F2F]">
                <Gamepad2 size={36} className="text-[#F08B8B]" />
              </div>
              <h3 className="text-xl font-semibold text-white" style={{textShadow: '2px 2px 0 #2A2A2A, 0 0 8px rgba(255,255,255,0.3)'}}>Gaming</h3>
              <p className="text-white text-base" style={{textShadow: '1px 1px 0 #2A2A2A, 0 0 5px rgba(255,255,255,0.2)'}}>
                Playing games like Roblox, Genshin Impact, and story-driven titles gives me inspiration for UI design and storytelling mechanics.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="about-card bg-[#2D2D2D] border-2 border-[#8FC5F0] shadow-[8px_8px_0px_#2A3A44] rounded-2xl p-6 hover:shadow-[12px_12px_0px_#2A3A44] hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-start gap-3">
              <div className="bg-[#383838] p-3 rounded-lg border-2 border-[#8FC5F0] shadow-[4px_4px_0px_#2A3A44]">
                <Palette size={36} className="text-[#8FC5F0]" />
              </div>
              <h3 className="text-xl font-semibold text-white" style={{textShadow: '2px 2px 0 #2A2A2A, 0 0 8px rgba(255,255,255,0.3)'}}>UI/UX Design</h3>
              <p className="text-white text-base" style={{textShadow: '1px 1px 0 #2A2A2A, 0 0 5px rgba(255,255,255,0.2)'}}>
                Crafting user-friendly interfaces and aesthetic designs with Figma & Adobe XD. I enjoy turning complex concepts into intuitive experiences.
              </p>
            </div>

            <div className="about-card bg-[#2D2D2D] border-2 border-[#F08B8B] shadow-[8px_8px_0px_#4A2F2F] rounded-2xl p-6 hover:shadow-[12px_12px_0px_#4A2F2F] hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-start gap-3">
              <div className="bg-[#383838] p-3 rounded-lg border-2 border-[#F08B8B] shadow-[4px_4px_0px_#4A2F2F]">
                <BiSolidMoviePlay size={36} className="text-[#F08B8B]" />
              </div>
              <h3 className="text-xl font-semibold text-white" style={{textShadow: '2px 2px 0 #2A2A2A, 0 0 8px rgba(255,255,255,0.3)'}}>Movies & Anime</h3>
              <p className="text-white text-base" style={{textShadow: '1px 1px 0 #2A2A2A, 0 0 5px rgba(255,255,255,0.2)'}}>
                Watching documentaries, films, and anime fuels my creativity and storytelling skills. I love engaging narratives and immersive experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GARIS PEMISAH - OMORI style di bagian bawah */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0]"></div>
    </section>
  );
};

export default AboutGrid;