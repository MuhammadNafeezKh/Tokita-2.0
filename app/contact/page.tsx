"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Github,
  Instagram,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TYPES
// ============================================================================
interface ContactMethod {
  icon: React.ElementType;
  label: string;
  value: string;
  action: string;
  external?: boolean;
  accent: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const [copied, setCopied] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      icon: Github,
      label: "GitHub",
      value: "@TokitaKun",
      action: "https://github.com/Tokitakun",
      external: true,
      accent: "blue",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Muhammad Nafis",
      action: "https://www.linkedin.com/in/muhammad-dzurunnafis-khairuddin/",
      external: true,
      accent: "blue",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@_nafietzsche",
      action: "https://www.instagram.com/_nafietzsche/",
      external: true,
      accent: "coral",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+62 856-1470-816",
      action: "https://wa.me/628561470816",
      external: true,
      accent: "green",
    },
  ];

  // Handle copy email
  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("nafismuhammad277@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );

      // Cards staggered animation
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(0.8)", scrollTrigger: { trigger: ".contact-grid", start: "top 85%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getAccentStyles = (accent: string) => {
    switch (accent) {
      case "blue":
        return "border-[#6B9FBF]/20 group-hover:border-[#6B9FBF] group-hover:shadow-[#6B9FBF]/10";
      case "coral":
        return "border-[#B06C6C]/20 group-hover:border-[#B06C6C] group-hover:shadow-[#B06C6C]/10";
      case "green":
        return "border-[#6B9F6B]/20 group-hover:border-[#6B9F6B] group-hover:shadow-[#6B9F6B]/10";
      default:
        return "border-white/10 group-hover:border-white/30";
    }
  };

  const getIconBg = (accent: string) => {
    switch (accent) {
      case "blue":
        return "bg-[#6B9FBF]/10 text-[#6B9FBF]";
      case "coral":
        return "bg-[#B06C6C]/10 text-[#B06C6C]";
      case "green":
        return "bg-[#6B9F6B]/10 text-[#6B9F6B]";
      default:
        return "bg-white/5 text-gray-400";
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-[#121212] scroll-mt-20 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B9FBF]/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ========== HEADER ========== */}
        <div ref={headerRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B9FBF] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6B9FBF]" />
            </span>
            <span className="text-[11px] font-mono text-gray-400 tracking-wide">GET IN TOUCH</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Let's Work Together
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Interested in collaborating? Reach out and let's create something great.
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#6B9FBF] to-transparent mx-auto mt-5 rounded-full" />
        </div>

        {/* ========== CONTACT GRID ========== */}
        <div className="contact-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                href={method.action}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative bg-[#1A1A1A] border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getAccentStyles(method.accent)}`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-xl ${getIconBg(method.accent)} transition-all duration-300 group-hover:scale-110`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">{method.label}</p>
                    <p className="text-sm font-medium text-white">{method.value}</p>
                  </div>
                  <ExternalLink size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors absolute top-4 right-4" />
                </div>
              </a>
            );
          })}
        </div>

        {/* ========== EMAIL CARD (Featured) ========== */}
        <div
          ref={(el) => {
            cardsRef.current[contactMethods.length] = el;
          }}
          className="relative bg-gradient-to-r from-[#1A1A1A] to-[#1E1E1E] border border-white/10 rounded-2xl overflow-hidden mb-8"
        >
          {/* Decorative accent bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6B9FBF] to-transparent" />

          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#6B9FBF]/10 rounded-xl">
                <Mail size={24} className="text-[#6B9FBF]" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Direct Email</p>
                <p className="text-sm font-mono text-white font-medium">nafismuhammad277@gmail.com</p>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-[#6B9FBF]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="group-hover:text-[#6B9FBF] transition-colors" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========== FOOTER INFO ========== */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <MapPin size={14} className="text-[#6B9FBF]" />
            <span>Indonesia</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Clock size={14} className="text-[#6B9FBF]" />
            <span>WIB (UTC+7)</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>📧 Response: ~24h</span>
          </div>
        </div>

        {/* Response note */}
        <p className="text-center text-[11px] text-gray-600 mt-6">
          Open for freelance, collaboration, and full-time opportunities.
        </p>
      </div>
    </section>
  );
};

export default ContactSection;