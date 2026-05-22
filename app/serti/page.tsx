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
  Heart,
  Calendar,
  Building2,
  FileText,
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200"
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
  const socialLinks = [
    { icon: Github, href: "https://github.com/MuhammadNafeezKh", label: "GitHub" },
    { icon: Instagram, href: "https://www.instagram.com/_nafietzsche/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/muhammad-dzurunnafis-khairuddin/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:nafismuhammad277@gmail.com", label: "Email" },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#121212]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} Muhammad Nafis. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#6B9FBF] transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-600 font-mono">
            Next.js • Tailwind • GSAP
          </p>
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
        // Simulate minimum loading time for smooth animation
        await new Promise((resolve) => setTimeout(resolve, 800));
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
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      // Tabs animation
      gsap.fromTo(
        tabsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );

      // Cards staggered animation
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.3,
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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-2 justify-center mb-4">
            <span className="w-2 h-2 rounded-full bg-[#6B9FBF] animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-[#6B9FBF] animate-pulse [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#6B9FBF] animate-pulse [animation-delay:0.4s]" />
          </div>
          <p className="text-gray-400 text-sm">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (!certificates) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-4 text-gray-500" size={40} />
          <p className="text-white font-medium mb-2">Failed to load data</p>
          <Link
            href="/"
            onClick={handleBackToHome}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentData = certificates[activeTab];
  const Icon = activeTab === "kompetensi" ? Award : Trophy;

  return (
    <>
      <div ref={pageRef} className="min-h-screen bg-[#121212]">
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Header */}
          <div ref={headerRef} className="mb-10">
            <Link
              href="/"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                Certificates & Achievements
              </h1>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                A collection of my professional certifications and competition awards
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#6B9FBF] to-transparent mx-auto mt-4 rounded-full" />
            </div>
          </div>

          {/* Tabs */}
          <div ref={tabsRef} className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab("kompetensi")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "kompetensi"
                  ? "bg-white/10 border border-white/20 text-white"
                  : "bg-transparent border border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <Award size={14} />
              Certifications
            </button>
            <button
              onClick={() => setActiveTab("prestasi")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "prestasi"
                  ? "bg-white/10 border border-white/20 text-white"
                  : "bg-transparent border border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <Trophy size={14} />
              Achievements
            </button>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentData.map((cert, index) => (
              <div
                key={cert.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#0D0D0D]">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Date badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                    <Calendar size={10} className="text-gray-400" />
                    <span className="text-[10px] font-mono text-gray-300">{cert.date}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <Building2 size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
                      {cert.issuer}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-base leading-tight mb-2 line-clamp-2">
                    {cert.title}
                  </h3>

                  {cert.description && (
                    <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                      {cert.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleAction(cert, "view")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                    >
                      <ExternalLink size={12} />
                      View
                    </button>
                    <button
                      onClick={() => handleAction(cert, "download")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                    >
                      <Download size={12} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentData.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
                <FileText size={28} className="text-gray-500" />
              </div>
              <p className="text-white font-medium mb-1">No {activeTab} found</p>
              <p className="text-gray-500 text-sm">Check back later for updates</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert */}
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </>
  );
}