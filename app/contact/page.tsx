"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Mail, 
  Github, 
  Instagram, 
  Linkedin, 
  Copy, 
  Check, 
  ArrowUpRight, 
  MapPin, 
  Clock,
  TerminalSquare
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const contactLinks = [
    {
      icon: Github,
      label: "GitHub",
      value: "@TokitaKun",
      url: "https://github.com/Tokitakun",
      color: "text-white"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Muhammad Nafis",
      url: "https://www.linkedin.com/in/muhammad-dzurunnafis-khairuddin/",
      color: "text-[#0A66C2]"
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@_nafietzsche",
      url: "https://www.instagram.com/_nafietzsche/",
      color: "text-[#E1306C]"
    },
    {
      icon: TerminalSquare,
      label: "WhatsApp",
      value: "+62 856-1470-816",
      url: "https://wa.me/628561470816",
      color: "text-[#25D366]"
    },
  ];

  // Handle copy email
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("nafismuhammad277@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power3.out", 
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } 
        }
      );

      // List Items Stagger
      if (listRef.current) {
        const items = gsap.utils.toArray(".contact-row") as HTMLElement[];
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: "power2.out",
            scrollTrigger: { trigger: listRef.current, start: "top 85%" }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-[#2A2A2A] min-h-screen flex items-center justify-center"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        
        {/* HEADER MINIMALIS */}
        <div ref={headerRef} className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-4 text-[#6B9FBF]">
            <Mail size={16} />
            <span className="text-xs font-mono tracking-widest uppercase">Contact Protocol</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Let's Start a <span className="text-gray-500">Conversation</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            Terbuka untuk kolaborasi proyek, freelance, atau sekadar diskusi teknologi. Jangan ragu untuk menghubungi saya melalui kanal di bawah ini.
          </p>
        </div>

        {/* MAIN CONTACT CARD */}
        <div className="bg-[#2D2D2D]/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Email Hero Section */}
          <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Primary Email</p>
                <p className="text-lg md:text-xl font-medium text-white font-mono break-all">
                  nafismuhammad277@gmail.com
                </p>
              </div>
              <button
                onClick={handleCopyEmail}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-[#6B9FBF] hover:bg-[#5a8fae] text-white text-sm font-medium rounded-lg transition-all active:scale-95"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy Address"}
              </button>
            </div>
          </div>

          {/* Social Links List */}
          <div ref={listRef} className="divide-y divide-white/5">
            {contactLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-row group flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#6B9FBF] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{item.value}</p>
                  </div>
                </div>
                
                <ArrowUpRight 
                  size={18} 
                  className="text-gray-600 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" 
                />
              </a>
            ))}
          </div>
        </div>

        {/* FOOTER META INFO */}
        <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-[#6B9FBF]" />
            <span>Indonesia (WIB)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-[#6B9FBF]" />
            <span>Response Time: ~24h</span>
          </div>
        </div>

      </div>

      {/* OMORI Divider */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0] opacity-80"></div>
    </section>
  );
};

export default ContactSection;