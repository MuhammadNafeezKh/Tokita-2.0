"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ArrowLeft, Award, Trophy, ExternalLink, Download, AlertCircle, Github, Instagram, Linkedin, Mail, Heart } from "lucide-react";

// ✅ Import JSON eksternal
import certificatesData from "../../public/data/serti.json";

// ✅ Tipe Data
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

// ✅ Alert Component - OMORI style
const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] max-w-md w-full p-6 animate-popup" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-[#E0E0E0] hover:text-white p-1 hover:bg-[#2C2C2C] rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2C2C2C] border-2 border-[#4A6B7F] flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-[#6B9FBF]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-[2px_2px_0px_#000000]">Informasi</h3>
              <p className="text-[#F0F0F0] leading-relaxed drop-shadow-[1px_1px_0px_#000000]">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-5 py-2.5 bg-[#2C2C2C] border-2 border-[#4A6B7F] text-white font-medium rounded-xl hover:bg-[#3A3A3A] hover:border-[#6B9FBF] transition-colors shadow-[4px_4px_0px_#1E2C36] hover:shadow-[6px_6px_0px_#1E2C36] hover:-translate-y-[2px]">
              Mengerti
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes popup { 0% { opacity: 0; transform: scale(0.9) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-popup { animation: popup 0.3s ease-out forwards; }
      `}</style>
    </>,
    document.body
  );
};

// ✅ Footer Component - OMORI style
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: Github, href: "https://github.com/MuhammadNafeezKh", label: "GitHub" },
    { icon: Instagram, href: "https://www.instagram.com/_nafietzsche/", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "mailto:nafismuhammad277@gmail.com", label: "Email" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[100] bg-[#232323]/95 backdrop-blur-sm border-t-2 border-[#4A6B7F] shadow-[0_-4px_0px_#1E2C36]">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[#C0C0C0] drop-shadow-[1px_1px_0px_#000000]">
            © {currentYear} Tokita. Made with <Heart size={10} className="inline text-[#B06C6C] fill-[#B06C6C]" />
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C0C0C0] hover:text-[#8FC5F0] transition-colors"
                  aria-label={social.label}
                  data-cursor="hover"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
          <span className="hidden sm:inline text-[10px] text-[#8A8A8A] font-mono drop-shadow-[1px_1px_0px_#000000]">
            Next.js + Tailwind + GSAP
          </span>
        </div>
      </div>
    </footer>
  );
};

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<"kompetensi" | "prestasi">("kompetensi");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificatesJSON | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // ✅✅✅ LOAD DATA + MINIMUM LOADING TIME (2000ms) ✅✅✅
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setCertificates(certificatesData as CertificatesJSON);
      } catch (error) {
        console.error("Failed to load certificates:", error);
        setAlertMessage("Gagal memuat data sertifikat. Silakan refresh halaman.");
      } finally {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
      }
    };
    loadCertificates();
  }, []);

  // ✅ GSAP Animations
  useEffect(() => {
    if (loading || !certificates) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power3.out",
          delay: 0.2 
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading, certificates, activeTab]);

  // ✅ Handler untuk tombol download/view
  const handleAction = (cert: Certificate, action: 'view' | 'download') => {
    if (cert.link) {
      window.open(cert.link, '_blank', 'noopener,noreferrer');
    } else {
      setAlertMessage(`File sertifikat "${cert.title}" belum tersedia untuk di-${action}.`);
    }
  };

  // ✅ Handler untuk kembali ke home
  const handleBackToHome = () => {
    sessionStorage.setItem('returnFromCert', 'true');
  };

  // ✅✅✅ LOADING STATE DENGAN BOUNCING DOTS - OMORI style ✅✅✅
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#1A1A1A] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(74, 107, 127, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 76, 76, 0.1) 0%, transparent 40%),
            repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.2) 0px, rgba(44, 44, 44, 0.2) 2px, transparent 2px, transparent 6px)
          `
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="size-3 animate-bounce rounded-full bg-[#6B9FBF] [animation-delay:-0.3s] shadow-[0_0_10px_#6B9FBF]" />
            <span className="size-3 animate-bounce rounded-full bg-[#8FC5F0] [animation-delay:-0.15s] shadow-[0_0_10px_#8FC5F0]" />
            <span className="size-3 animate-bounce rounded-full bg-[#B06C6C] shadow-[0_0_10px_#B06C6C]" />
          </div>
          <p className="text-white font-medium drop-shadow-[2px_2px_0px_#000000]">Memuat sertifikat...</p>
        </div>
      </div>
    );
  }

  if (!certificates) {
    return (
      <div className="relative min-h-screen bg-[#1A1A1A] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(74, 107, 127, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 76, 76, 0.1) 0%, transparent 40%),
            repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.2) 0px, rgba(44, 44, 44, 0.2) 2px, transparent 2px, transparent 6px)
          `
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center p-6">
          <AlertCircle className="mx-auto mb-4 text-[#6B9FBF]" size={40} />
          <p className="text-white font-medium mb-2 drop-shadow-[2px_2px_0px_#000000]">Gagal memuat data</p>
          <Link 
            href="/" 
            onClick={handleBackToHome}
            className="text-[#C0C0C0] hover:text-white underline drop-shadow-[1px_1px_0px_#000000]"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  const currentData = certificates[activeTab];
  const Icon = activeTab === "kompetensi" ? Award : Trophy;

  return (
    <>
      <div ref={pageRef} className="relative min-h-screen bg-[#1A1A1A] overflow-hidden pb-16"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(74, 107, 127, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 76, 76, 0.08) 0%, transparent 40%),
            repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.15) 0px, rgba(44, 44, 44, 0.15) 2px, transparent 2px, transparent 6px)
          `
        }}
      >
        {/* ✅ Overlay & Grid - OMORI style */}
        <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 107, 127, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 107, 127, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Decorative corner accents */}
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#4A6B7F]/20 rounded-full blur-sm" />
        <div className="absolute bottom-20 right-10 w-40 h-40 border-2 border-[#8B4C4C]/20 rounded-full blur-sm" />

        {/* ✅ Alert Portal */}
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}

        {/* ✅ Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
          
          {/* Header & Back Button - OMORI style */}
          <div ref={headerRef} className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-10">
            <div className="text-center md:text-left">
              <Link 
                href="/" 
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 text-[#C0C0C0] hover:text-white mb-4 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium drop-shadow-[1px_1px_0px_#000000]">Back to Home</span>
              </Link>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-[4px_4px_0px_#000000]">
                My Certificates 🏆
              </h1>
              <p className="text-[#F0F0F0] text-lg drop-shadow-[2px_2px_0px_#000000]">
                Koleksi pencapaian dan kompetensi yang telah diraih.
              </p>
            </div>

            {/* ✅ Toggle Tabs - OMORI style */}
            <div className="flex p-1 bg-[#232323] border-2 border-[#4A6B7F] shadow-[4px_4px_0px_#1E2C36] rounded-xl">
              <button
                onClick={() => setActiveTab("kompetensi")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === "kompetensi" 
                    ? "bg-[#2C2C2C] border border-[#6B9FBF] text-white shadow-[2px_2px_0px_#1E2C36]" 
                    : "text-[#C0C0C0] hover:text-white hover:bg-[#2C2C2C]/50"
                }`}
              >
                <Award size={16} className={activeTab === "kompetensi" ? "text-[#8FC5F0]" : ""} /> Kompetensi
              </button>
              <button
                onClick={() => setActiveTab("prestasi")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === "prestasi" 
                    ? "bg-[#2C2C2C] border border-[#B06C6C] text-white shadow-[2px_2px_0px_#5C3A3A]" 
                    : "text-[#C0C0C0] hover:text-white hover:bg-[#2C2C2C]/50"
                }`}
              >
                <Trophy size={16} className={activeTab === "prestasi" ? "text-[#F08B8B]" : ""} /> Prestasi
              </button>
            </div>
          </div>

          {/* ✅ Certificates Grid - OMORI style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.map((cert, index) => (
              <div
                key={cert.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group relative bg-[#232323] border-2 border-[#3A3A3A] shadow-[6px_6px_0px_#1E2C36] rounded-2xl overflow-hidden hover:shadow-[8px_8px_0px_#1E2C36] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Area */}
                <div className="relative h-48 overflow-hidden border-b-2 border-[#4A6B7F]">
                  <Image 
                    src={cert.image} 
                    alt={cert.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-[#2C2C2C] border border-[#4A6B7F] rounded-full text-[10px] font-bold text-white uppercase tracking-wide shadow-[2px_2px_0px_#1E2C36]">
                      {cert.date}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 drop-shadow-[2px_2px_0px_#000000]">
                      {cert.title}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-[#C0C0C0] mb-1 drop-shadow-[1px_1px_0px_#000000]">
                    {cert.issuer}
                  </p>
                  {cert.description && (
                    <p className="text-xs text-[#8A8A8A] mb-4 line-clamp-2 drop-shadow-[1px_1px_0px_#000000]">
                      {cert.description}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2 border-t border-[#4A6B7F]/30">
                    <button
                      onClick={() => handleAction(cert, 'view')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-[#2C2C2C] border border-[#4A6B7F] rounded-lg hover:bg-[#3A3A3A] hover:border-[#6B9FBF] transition-colors shadow-[2px_2px_0px_#1E2C36]"
                    >
                      <ExternalLink size={12} className="text-[#8FC5F0]" /> View
                    </button>
                    <button
                      onClick={() => handleAction(cert, 'download')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-[#2C2C2C] border border-[#B06C6C] rounded-lg hover:bg-[#3A3A3A] hover:border-[#F08B8B] transition-colors shadow-[2px_2px_0px_#5C3A3A]"
                    >
                      <Download size={12} className="text-[#F08B8B]" /> Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State - OMORI style */}
          {currentData.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#232323] border-2 border-[#4A6B7F] shadow-[4px_4px_0px_#1E2C36] mb-4">
                <Icon className="w-8 h-8 text-[#6B9FBF]" />
              </div>
              <p className="text-white font-medium drop-shadow-[2px_2px_0px_#000000]">Belum ada data {activeTab}.</p>
              <p className="text-[#C0C0C0] text-sm mt-1 drop-shadow-[1px_1px_0px_#000000]">Silakan cek lagi nanti!</p>
            </div>
          )}

          {/* Footer Note - OMORI style */}
          <div className="text-center mt-12 pb-8">
            <p className="text-[#C0C0C0] text-sm drop-shadow-[1px_1px_0px_#000000]">
              Tertarik dengan sertifikat tertentu? <br className="md:hidden"/>
              <button 
                onClick={() => setAlertMessage("Silakan hubungi saya via email untuk verifikasi sertifikat.")}
                className="underline hover:text-white transition-colors font-medium"
              >
                Hubungi saya untuk verifikasi.
              </button>
            </p>
          </div>

        </div>
      </div>

      {/* Garis pemisah atas untuk footer */}
      <div className="fixed bottom-16 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF]/30 via-[#B06C6C]/30 to-[#6B9FBF]/30 z-[99]"></div>

      {/* ✅ FOOTER */}
      <Footer />
    </>
  );
}