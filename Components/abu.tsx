"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Fish, Gamepad2, Film, Terminal, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AboutModern = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Text Content
      gsap.fromTo(
        ".about-text",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate Card/Image Area
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.2)",
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      className="relative py-24 md:py-32 bg-[#1A1A1A] overflow-hidden border-t border-white/5"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#6B9FBF]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#B06C6C]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Introduction (Original Text) */}
          <div ref={contentRef} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#6B9FBF] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B9FBF] animate-pulse" />
              WHO AM I?
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight about-text tracking-tight">
              Hello, I'm <span className="text-[#6B9FBF]">Nafis</span>.
            </h2>

            <div className="space-y-6 text-gray-400 leading-relaxed text-base md:text-lg about-text">
              <p>
                Halo! Saya <strong className="text-white">Muhammad Dzurunnafis Khairuddin (Nafis)</strong>, seorang 
                {' '}<span className="text-[#6B9FBF] font-semibold">Front End Developer</span> dan 
                {' '}<span className="text-[#B06C6C] font-semibold">UI/UX Design Enthusiast</span> yang 
                tinggal di <span className="text-[#F0F0F0]">Indonesia</span>.
              </p>
              <p>
                Saya memiliki passion dalam membangun antarmuka yang tidak hanya fungsional, tetapi juga estetis dan nyaman digunakan.
                Saat ini saya mendalami <span className="text-[#6B9FBF]">Flutter</span>,{' '}
                <span className="text-[#6B9FBF]">Next.js</span>, dan berbagai teknologi front-end modern lainnya.
              </p>
              <p>
                Di luar coding, saya menikmati eksplorasi bahasa asing, bermain game, dan mendengarkan musik.
              </p>
            </div>

            
          </div>

          {/* RIGHT COLUMN: Hobby Card */}
          <div ref={cardRef} className="relative mt-8 md:mt-0">
            {/* Decorative Blur Behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#6B9FBF]/20 to-[#B06C6C]/20 rounded-2xl blur-xl opacity-70" />
            
            {/* Main Card */}
            <div className="relative bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              
              {/* Header Card */}
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] border border-white/10 flex items-center justify-center text-[#6B9FBF]">
                    <Heart size={24} className="fill-[#6B9FBF]/20" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Beyond The Code</h3>
                    <p className="text-xs text-gray-500 font-mono">My Personal Interests</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
              </div>

              {/* Hobbies Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Reading */}
                <div className="bg-[#2A2A2A] p-4 rounded-xl border border-white/5 hover:border-[#6B9FBF]/30 transition-colors group">
                  <BookOpen size={20} className="text-[#6B9FBF] mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Reading</p>
                  <p className="text-sm font-medium text-white mt-1">Books & Stories</p>
                </div>
                
                {/* Aquarium */}
                <div className="bg-[#2A2A2A] p-4 rounded-xl border border-white/5 hover:border-sky-400/30 transition-colors group">
                  <Fish size={20} className="text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Aquarium</p>
                  <p className="text-sm font-medium text-white mt-1">Fish Keeping</p>
                </div>

                {/* Gaming */}
                <div className="bg-[#2A2A2A] p-4 rounded-xl border border-white/5 hover:border-purple-400/30 transition-colors group">
                  <Gamepad2 size={20} className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Gaming</p>
                  <p className="text-sm font-medium text-white mt-1">RPG Story & Fps</p>
                </div>

                {/* Movies */}
                <div className="bg-[#2A2A2A] p-4 rounded-xl border border-white/5 hover:border-rose-400/30 transition-colors group">
                  <Film size={20} className="text-rose-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Movies</p>
                  <p className="text-sm font-medium text-white mt-1">Movies & Series Anime</p>
                </div>
              </div>

              {/* Footer Card */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Terminal size={12} className="text-green-500" />
                   <span className="text-[10px] text-gray-500 font-mono">Always learning something new</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutModern;