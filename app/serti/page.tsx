"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Award,
  Trophy,
  ExternalLink,
  Download,
  AlertCircle,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Calendar,
  Building2,
  FileText,
  Sparkles,
  ChevronRight
} from "lucide-react";

import certificatesData from "../../public/data/serti.json";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TYPES
// ============================================================================
type Certificate = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  link?: string;
  description?: string;
};

type CertificatesJSON = {
  kompetensi: Certificate[];
  prestasi: Certificate[];
};

// ============================================================================
// ALERT COMPONENT
// ============================================================================
const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#2A2A2A]/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#2D2D2D] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6B9FBF]/10 border border-[#6B9FBF]/20 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-[#6B9FBF]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Information</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ============================================================================
// FOOTER COMPONENT
// ============================================================================
const Footer = () => {
  const currentYear = new Date().getFullYear();
  // Updated links to match your profile
  const socialLinks = [
    { icon: Github, href: "https://github.com/Tokitakun", label: "GitHub" },
    { icon: Instagram, href: "https://www.instagram.com/_nafietzsche/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/muhammad-dzurunnafis-khairuddin/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:nafismuhammad277@gmail.com", label: "Email" },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#2A2A2A] relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#6B9FBF]"></span>
             <p className="text-sm text-gray-400">
              © {currentYear} <span className="text-white font-medium">Muhammad Nafis</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#6B9FBF] transition-colors transform hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<"kompetensi" | "prestasi">("kompetensi");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificatesJSON | null>(null);
  const [loading, setLoading] = useState(true);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Load data
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        // Simulate slight delay for smooth entrance
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCertificates(certificatesData as CertificatesJSON);
      } catch (error) {
        console.error("Failed to load certificates:", error);
        setAlertMessage("Failed to load certificates. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (loading || !certificates) return;

    const ctx = gsap.context(() => {
      // Header Stagger
      gsap.fromTo(
        ".header-element",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out" 
        }
      );

      // Tabs Slide In
      gsap.fromTo(
        tabsRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: "power2.out" }
      );

      // Cards Stagger
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.2)",
          delay: 0.5,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading, certificates, activeTab]);

  const handleAction = (cert: Certificate, action: "view" | "download") => {
    if (cert.link) {
      window.open(cert.link, "_blank", "noopener,noreferrer");
    } else {
      setAlertMessage(`Certificate "${cert.title}" is not available for ${action} yet.`);
    }
  };

  const handleBackToHome = () => {
    sessionStorage.setItem("returnFromCert", "true");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#6B9FBF]/30 border-t-[#6B9FBF] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono animate-pulse">Loading Achievements...</p>
        </div>
      </div>
    );
  }

  if (!certificates) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-4 text-gray-500" size={40} />
          <p className="text-white font-medium mb-2">Failed to load data</p>
          <Link
            href="/"
            onClick={handleBackToHome}
            className="text-sm text-[#6B9FBF] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentData = certificates[activeTab];

  return (
    <>
      <div ref={pageRef} className="min-h-screen bg-[#2A2A2A] relative overflow-hidden flex flex-col">
        {/* Subtle Background Noise/Gradient */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#6B9FBF]/5 to-transparent pointer-events-none" />
        
        {/* Content Container */}
        <main className="flex-grow max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 w-full">
          
          {/* Header Section - Asymmetrical Layout */}
          <div ref={headerRef} className="mb-12 md:mb-16">
            <Link
              href="/"
              onClick={handleBackToHome}
              className="header-element inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#6B9FBF] transition-colors mb-8 group"
            >
              <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-[#6B9FBF]/10 transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span>Back to Home</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="header-element inline-flex items-center gap-2 text-[#6B9FBF] mb-2">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold tracking-wider uppercase">Portfolio Validation</span>
                </div>
                <h1 className="header-element text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                  Certificates & <br/>
                  <span className="text-gray-500">Achievements</span>
                </h1>
                <p className="header-element text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
                  Dokumentasi profesional dan penghargaan yang telah saya raih selama perjalanan karir di dunia teknologi.
                </p>
              </div>

              {/* Stats Badge */}
              <div className="header-element hidden md:block">
                 <div className="bg-[#2D2D2D] border border-white/10 rounded-2xl p-4 text-right min-w-[140px]">
                    <span className="block text-3xl font-bold text-white">{currentData.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Total Items</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Tabs & Filter */}
          <div ref={tabsRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
            <div className="flex gap-2 bg-[#252525] p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("kompetensi")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "kompetensi"
                    ? "bg-[#2D2D2D] text-white shadow-sm border border-white/5"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Award size={16} className={activeTab === "kompetensi" ? "text-[#6B9FBF]" : ""} />
                Certifications
              </button>
              <button
                onClick={() => setActiveTab("prestasi")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "prestasi"
                    ? "bg-[#2D2D2D] text-white shadow-sm border border-white/5"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Trophy size={16} className={activeTab === "prestasi" ? "text-[#F08B8B]" : ""} />
                Achievements
              </button>
            </div>
            
            <div className="text-xs text-gray-500 font-mono">
               Showing {activeTab === "kompetensi" ? "Professional Certs" : "Competition Awards"}
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentData.map((cert, index) => (
              <div
                key={cert.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group relative bg-[#2D2D2D] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6B9FBF]/30 hover:shadow-2xl hover:shadow-[#6B9FBF]/5 transition-all duration-500 flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-52 overflow-hidden bg-[#232323]">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D] via-transparent to-transparent opacity-60" />

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                    <Calendar size={10} className="text-gray-300" />
                    <span className="text-[10px] font-medium text-white">{cert.date}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={12} className="text-[#6B9FBF]" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {cert.issuer}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg leading-snug mb-2 group-hover:text-[#6B9FBF] transition-colors">
                    {cert.title}
                  </h3>

                  {cert.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
                      {cert.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(cert, "view")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-white/5 hover:bg-[#6B9FBF] hover:border-[#6B9FBF] border border-white/10 rounded-xl transition-all duration-300 group/btn"
                      >
                        <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        View Proof
                      </button>
                      
                      {cert.link && (
                         <a
                           href={cert.link}
                           download
                           className="flex items-center justify-center p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                           title="Download"
                         >
                           <Download size={14} />
                         </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentData.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <FileText size={24} className="text-gray-500" />
              </div>
              <p className="text-white font-medium mb-1">No data found</p>
              <p className="text-gray-500 text-sm">This category is currently empty.</p>
            </div>
          )}
        </main>

        {/* OMORI Divider */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0] opacity-80" />
        
        <Footer />
      </div>

      {/* Alert Portal */}
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </>
  );
}