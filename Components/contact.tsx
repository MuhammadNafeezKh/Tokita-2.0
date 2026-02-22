"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Mail, 
  Github, 
  Instagram, 
  Linkedin, 
  Copy, 
  Check, 
  ExternalLink,
  MessageCircle 
} from "lucide-react";

// Tipe data untuk partikel (opsional, untuk TypeScript)
type Particle = {
  top: string;
  left: string;
  delay: string;
};

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | HTMLAnchorElement | null)[]>([]);
  const [copied, setCopied] = useState(false);
  
  // ✅ State untuk menyimpan posisi partikel (client-side only)
  const [particles, setParticles] = useState<Particle[]>([]);

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "nafismuhammad277@gmail.com",
      action: "mailto:nafismuhammad277@gmail.com",
      color: "bg-[#2C2C2C] text-[#8FC5F0] border-[#4A6B7F]",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@MuhammadNafeezKh",
      action: "https://github.com/MuhammadNafeezKh",
      color: "bg-[#2C2C2C] text-[#F0F0F0] border-[#4A6B7F]",
      external: true,
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@_nafietzsche",
      action: "https://www.instagram.com/_nafietzsche/",
      color: "bg-[#2C2C2C] text-[#F08B8B] border-[#B06C6C]",
      external: true,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Muhammad Nafis",
      action: "https://www.linkedin.com/in/muhammad-dzurunnafis-khairuddin/",
      color: "bg-[#2C2C2C] text-[#8FC5F0] border-[#4A6B7F]",
      external: true,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat langsung",
      action: "https://wa.me/628561470816",
      color: "bg-[#2C2C2C] text-[#6B9FBF] border-[#4A6B7F]",
      external: true,
    },
  ];

  // ✅ Generate random positions HANYA di client (setelah mount)
  useEffect(() => {
    const generatedParticles = [...Array(12)].map((_, i) => ({
      top: `${10 + Math.random() * 80}%`,
      left: `${5 + Math.random() * 90}%`,
      delay: `${i * 0.2}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  // ✨ GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards staggered
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Floating particles animation (pakai state particles yang sudah aman)
      const particleElements = document.querySelectorAll(".particle");
      particleElements.forEach((particle, i) => {
        gsap.to(particle, {
          y: -20 + Math.random() * 40,
          x: -10 + Math.random() * 20,
          duration: 3 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ✨ Copy email to clipboard
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("nafismuhammad277@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Small animation feedback
      gsap.fromTo(
        ".copy-feedback",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: "back.out" }
      );
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#1A1A1A] py-20 scroll-mt-24"
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

      {/* ========== BACKGROUND ELEMENTS ========== */}
      
      {/* Grid overlay - OMORI style */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 107, 127, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 107, 127, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles - OMORI style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.delay,
              backgroundColor: i % 2 === 0 ? '#6B9FBF' : '#B06C6C',
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      {/* Decorative corner accents - OMORI style */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#4A6B7F]/20 rounded-full blur-sm" />
      <div className="absolute bottom-20 right-10 w-40 h-40 border-2 border-[#8B4C4C]/20 rounded-full blur-sm" />

      {/* ========== CONTENT ========== */}
      
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Header - OMORI style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#232323] border-2 border-[#4A6B7F] shadow-[4px_4px_0px_#1E2C36] rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-[#8FC5F0] animate-pulse shadow-[0_0_8px_#8FC5F0]" />
            <span className="text-xs font-medium text-white drop-shadow-[1px_1px_0px_#000000]">Available for opportunities</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[4px_4px_0px_#000000]">
            Let's Connect! 👋
          </h2>
          <p className="text-[#F0F0F0] text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[2px_2px_0px_#000000]">
            Punya proyek menarik, pertanyaan, atau sekadar ingin menyapa? 
            Saya selalu terbuka untuk diskusi dan kolaborasi.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#6B9FBF]/50 via-[#B06C6C]/50 to-[#6B9FBF]/50 mx-auto mt-6 rounded-full" />
        </div>

        {/* Contact Cards Grid - OMORI style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                href={method.action}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                className="group relative bg-[#232323] border-2 border-[#3A3A3A] shadow-[6px_6px_0px_#1E2C36] rounded-2xl p-5 
                  transition-all duration-300 hover:shadow-[8px_8px_0px_#1E2C36] hover:-translate-y-1
                  flex items-center gap-4 cursor-pointer
                  hover:border-[#4A6B7F]"
              >
                {/* Icon Container - OMORI style */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${method.color} border-2 
                  flex items-center justify-center group-hover:scale-110 transition-transform duration-300
                  shadow-[2px_2px_0px_#1E2C36]`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Text Content - OMORI style */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#C0C0C0] uppercase tracking-wide drop-shadow-[1px_1px_0px_#000000]">
                    {method.label}
                  </p>
                  <p className="text-sm font-semibold text-white truncate mt-0.5 drop-shadow-[2px_2px_0px_#000000]">
                    {method.value}
                  </p>
                </div>

                {/* External Link Icon */}
                {method.external && (
                  <ExternalLink className="w-4 h-4 text-[#C0C0C0] group-hover:text-white transition-colors" />
                )}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-[#6B9FBF]/5 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                />
              </a>
            );
          })}
        </div>

        {/* Email Copy Section - OMORI style */}
        <div 
          ref={(el) => {
            cardRefs.current[contactMethods.length] = el;
          }}
          className="bg-[#232323] border-2 border-[#3A3A3A] shadow-[6px_6px_0px_#1E2C36] rounded-2xl p-6 
            flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-[8px_8px_0px_#1E2C36] transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2C2C2C] border-2 border-[#4A6B7F] text-[#8FC5F0] flex items-center justify-center shadow-[2px_2px_0px_#1E2C36]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#C0C0C0] uppercase tracking-wide drop-shadow-[1px_1px_0px_#000000]">
                Direct Email
              </p>
              <p className="text-sm font-mono font-semibold text-white drop-shadow-[2px_2px_0px_#000000]">
                nafismuhammad277@gmail.com
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2C] border-2 border-[#4A6B7F] text-white 
              rounded-xl font-medium text-sm hover:bg-[#3A3A3A] hover:border-[#6B9FBF] 
              transition-all duration-200 shadow-[4px_4px_0px_#1E2C36] hover:shadow-[6px_6px_0px_#1E2C36] hover:-translate-y-1 active:translate-y-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#8FC5F0]" />
                <span className="copy-feedback">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Email</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Note - OMORI style */}
        <div className="text-center mt-10">
          <p className="text-sm text-[#C0C0C0] drop-shadow-[1px_1px_0px_#000000]">
            📍 Based in Indonesia • 🕐 Response time: ~24 hours
          </p>
        </div>
      </div>

      {/* Garis pemisah bawah - OMORI style */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF]/30 via-[#B06C6C]/30 to-[#6B9FBF]/30"></div>
    </section>
  );
};

export default ContactSection;