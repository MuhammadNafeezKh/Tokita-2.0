"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, Volume2, VolumeX, Eye, AlertTriangle, Quote, Terminal, FileText, Type } from "lucide-react";
import CustomCursor from "@/Components/cursor";
import NavbarBlog from "@/Components/NavbarBlog";
import Footer from "@/Components/footer";

interface Cerpen {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

export default function CerpenDetail() {
  const params = useParams();
  const [cerpen, setCerpen] = useState<Cerpen | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedCerpen, setRelatedCerpen] = useState<Cerpen[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [paperStyle, setPaperStyle] = useState<"default" | "vintage" | "dark">("default");
  const [showTerminalNote, setShowTerminalNote] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // Reading progress
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger warning untuk konten berat
  const [showTriggerWarning, setShowTriggerWarning] = useState(true);

  const playBGM = () => {
    try {
      if (!bgmAudioRef.current) {
        bgmAudioRef.current = new Audio('/audio/blog.mp3');
        bgmAudioRef.current.loop = true;
        bgmAudioRef.current.volume = 0.08;
      }
      bgmAudioRef.current.play()
        .then(() => { setAudioEnabled(true); sessionStorage.setItem('blogAudioEnabled', 'true'); })
        .catch(e => console.log("BGM Play Error:", e));
    } catch (e) { console.log("BGM Error:", e); }
  };

  const stopBGM = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
      bgmAudioRef.current.currentTime = 0;
      bgmAudioRef.current = null;
    }
    setAudioEnabled(false);
    sessionStorage.setItem('blogAudioEnabled', 'false');
  };

  const toggleAudio = () => audioEnabled ? stopBGM() : playBGM();

  useEffect(() => {
    const timer = setTimeout(() => playBGM(), 500);
    return () => { clearTimeout(timer); stopBGM(); sessionStorage.removeItem('blogAudioEnabled'); };
  }, []);

  useEffect(() => {
    const fetchCerpen = async () => {
      try {
        const res = await fetch('/data/cerpen.json?t=' + Date.now());
        const data = await res.json();
        const found = data.cerpen.find((c: Cerpen) => c.id === Number(params.id));
        setCerpen(found);
        if (found) {
          const related = data.cerpen.filter((c: Cerpen) => c.category === found.category && c.id !== found.id).slice(0, 3);
          setRelatedCerpen(related);
        }
      } catch (error) {
        console.error("Gagal ambil data cerpen:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCerpen();
  }, [params.id]);

  // Fungsi untuk memproses konten dengan styling dialog
  const processContent = (text: string, isVintage: boolean) => {
    const lines = text.split('\n');
    const dialogueColor = isVintage ? "text-amber-700" : "text-sky-300";
    const dialogueBg = isVintage ? "bg-amber-100" : "bg-sky-500/5";
    const terminalBg = isVintage ? "bg-amber-50" : "bg-neutral-900/80";
    const terminalBorder = isVintage ? "border-amber-400" : "border-amber-500/30";
    const headingColor = isVintage ? "text-amber-800" : "text-amber-400";
    
    return lines.map((line, idx) => {
      const isDialogue = line.match(/["'].*?["']/);
      const isTerminalNote = line.match(/^[$>#]\s/);
      const isHeading = line.match(/^\*\*.*\*\*$/);
      
      if (isHeading) {
        const content = line.replace(/\*\*/g, '');
        return <h3 key={idx} className={`text-lg font-bold mt-6 mb-3 ${headingColor}`}>{content}</h3>;
      }
      
      if (isTerminalNote) {
        return (
          <div key={idx} className={`my-2 font-mono text-xs ${terminalBg} border ${terminalBorder} rounded-lg p-3 overflow-x-auto`}>
            <span className={`${isVintage ? "text-amber-600" : "text-green-400"} select-none`}>
              {line[0]}
            </span>
            <span className={`${isVintage ? "text-neutral-700" : "text-amber-300"} ml-2`}>
              {line.substring(2)}
            </span>
          </div>
        );
      }
      
      if (isDialogue) {
        const parts = line.split(/(["'].*?["'])/g);
        return (
          <p key={idx} className="mb-3 leading-relaxed">
            {parts.map((part, i) => {
              if (part.match(/["'].*?["']/)) {
                return (
                  <span key={i} className={`${dialogueColor} italic font-medium ${dialogueBg} px-1 rounded`}>
                    {part}
                  </span>
                );
              }
              return <span key={i} className="text-current">{part}</span>;
            })}
          </p>
        );
      }
      
      if (line.trim() === '') return <br key={idx} />;
      return <p key={idx} className="mb-3 leading-relaxed">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-amber-400 font-mono text-sm animate-pulse">Membuka lembaran catatan...</p>
        </div>
      </div>
    );
  }

  if (!cerpen) {
    return (
      <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <BookOpen className="w-16 h-16 text-neutral-700 mx-auto mb-4 animate-float" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-400/50 rounded-full animate-ping" />
          </div>
          <p className="text-neutral-400 mb-4 font-mono">Catatan tidak ditemukan...</p>
          <p className="text-neutral-500 text-xs mb-6">Mungkin halaman ini hilang atau tersembunyi?</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span>Kembali ke Catatan</span>
          </Link>
        </div>
      </div>
    );
  }

  const isVintage = paperStyle === "vintage";
  const isDark = paperStyle === "dark";
  
  const getPaperStyles = () => {
    if (isVintage) {
      return {
        container: "bg-[#fbf7f0] border-amber-200",
        title: "text-neutral-800",
        meta: "text-amber-600",
        quote: "border-amber-400 bg-amber-50/50 text-amber-700",
        content: "text-neutral-700",
        divider: "border-amber-200",
        footer: "text-amber-400",
        tag: "bg-amber-100 border-amber-300 text-amber-700"
      };
    }
    if (isDark) {
      return {
        container: "bg-neutral-900/80 border-neutral-800",
        title: "text-white",
        meta: "text-neutral-400",
        quote: "border-amber-500/50 bg-amber-500/5 text-neutral-300",
        content: "text-gray-200",
        divider: "border-neutral-800",
        footer: "text-neutral-500",
        tag: "bg-amber-500/10 border-amber-500/30 text-amber-400"
      };
    }
    return {
      container: "bg-neutral-900/40 border-neutral-800",
      title: "text-white",
      meta: "text-neutral-500",
      quote: "border-amber-500/50 bg-amber-500/5 text-neutral-400",
      content: "text-white",
      divider: "border-neutral-800",
      footer: "text-neutral-600",
      tag: "bg-amber-500/10 border-amber-500/30 text-amber-400"
    };
  };

  const styles = getPaperStyles();

  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-y-auto overflow-x-hidden">
      <CustomCursor />
      <NavbarBlog />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      
      {/* Background untuk mode vintage */}
      {isVintage && (
        <>
          <div className="fixed inset-0 bg-[#f5efe6] pointer-events-none" />
          <div className="fixed inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
          <div className="fixed inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent pointer-events-none" />
        </>
      )}
      {!isVintage && (
        <div className="fixed inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 pointer-events-none" />
      )}
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-0.5 h-0.5 rounded-full animate-float ${isVintage ? "bg-amber-400/15" : "bg-amber-400/10"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 min-h-screen">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/blog" className={`inline-flex items-center gap-2 transition-colors group ${isVintage ? "text-amber-600 hover:text-amber-800" : "text-neutral-500 hover:text-amber-400"}`}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono">Kembali ke Catatan</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Paper Style Toggle */}
            <div className="flex gap-1 mr-2">
              <button
                onClick={() => setPaperStyle("default")}
                className={`p-1.5 rounded-lg transition-all ${
                  paperStyle === "default" 
                    ? isVintage ? "bg-amber-200 text-amber-800" : "bg-amber-500/20 text-amber-400"
                    : isVintage ? "text-amber-400 hover:text-amber-600" : "text-neutral-600 hover:text-neutral-400"
                }`}
                title="Mode Default"
              >
                <FileText size={14} />
              </button>
              <button
                onClick={() => setPaperStyle("vintage")}
                className={`p-1.5 rounded-lg transition-all ${
                  paperStyle === "vintage" 
                    ? "bg-amber-200 text-amber-800"
                    : isVintage ? "text-amber-400 hover:text-amber-600" : "text-neutral-600 hover:text-neutral-400"
                }`}
                title="Mode Kertas Tua"
              >
                <Type size={14} />
              </button>
              <button
                onClick={() => setPaperStyle("dark")}
                className={`p-1.5 rounded-lg transition-all ${
                  paperStyle === "dark" 
                    ? isVintage ? "bg-amber-200 text-amber-800" : "bg-amber-500/20 text-amber-400"
                    : isVintage ? "text-amber-400 hover:text-amber-600" : "text-neutral-600 hover:text-neutral-400"
                }`}
                title="Mode Gelap"
              >
                <div className="w-3 h-3 rounded-full bg-current" />
              </button>
            </div>
            {/* Terminal Note Button */}
            <button
              onClick={() => setShowTerminalNote(!showTerminalNote)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isVintage 
                  ? "bg-amber-100 border border-amber-300 hover:border-amber-500" 
                  : "bg-neutral-800/60 border border-neutral-700 hover:border-amber-500"
              }`}
              title="Terminal Note"
            >
              <Terminal size={14} className={isVintage ? "text-amber-600" : "text-green-400"} />
            </button>
            <button 
              onClick={toggleAudio} 
              className={`p-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                isVintage 
                  ? "bg-amber-100 border border-amber-300 hover:border-amber-500" 
                  : "bg-neutral-800/60 border border-neutral-700 hover:border-amber-500"
              }`}
            >
              {audioEnabled ? 
                <Volume2 className={`w-4 h-4 ${isVintage ? "text-amber-600" : "text-amber-400"} animate-pulse`} /> : 
                <Volume2 className={`w-4 h-4 ${isVintage ? "text-amber-400" : "text-neutral-500"}`} />
              }
            </button>
          </div>
        </div>

        {/* Terminal Note Popup */}
        {showTerminalNote && (
          <div className={`mb-6 rounded-lg font-mono text-xs overflow-hidden ${isVintage ? "bg-amber-50 border border-amber-300" : "bg-black/90 border border-green-500/30"}`}>
            <div className={`flex items-center gap-2 px-3 py-2 border-b ${isVintage ? "bg-amber-100 border-amber-300" : "bg-green-500/10 border-green-500/30"}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isVintage ? "bg-amber-500" : "bg-green-500"}`} />
              <span className={isVintage ? "text-amber-700 text-[10px]" : "text-green-400 text-[10px]"}>terminal@maria:~</span>
              <span className={`text-[10px] ml-auto ${isVintage ? "text-amber-400" : "text-neutral-500"}`}>catatan_rahasia.sh</span>
            </div>
            <div className={`p-3 space-y-1 ${isVintage ? "text-amber-800" : "text-green-300"}`}>
              <p><span className={isVintage ? "text-amber-500" : "text-green-600"}>$</span> cat --read "catatan ini"</p>
              <p><span className={isVintage ? "text-amber-500" : "text-green-600"}>&gt;</span> Setiap dialog ditandai dengan <span className={isVintage ? "text-amber-700 font-medium" : "text-sky-400"}>warna berbeda</span></p>
              <p><span className={isVintage ? "text-amber-500" : "text-green-600"}>&gt;</span> Mode kertas tua memberikan nuansa klasik</p>
              <p><span className={isVintage ? "text-amber-500" : "text-green-600"}>#</span> Baca dengan hati-hati, Rei.</p>
              <p className={`text-[9px] mt-1 ${isVintage ? "text-amber-400" : "text-green-500/50"}`}>--- Maria, 2026 ---</p>
            </div>
          </div>
        )}

        {/* Trigger Warning */}
        {showTriggerWarning && (
          <div className={`mb-6 p-4 border-l-4 rounded-r-lg backdrop-blur-sm ${isVintage ? "border-rose-600 bg-rose-50" : "border-rose-500 bg-rose-500/10"}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isVintage ? "text-rose-600" : "text-rose-400"}`} />
              <div>
                <p className={`text-sm font-medium mb-1 ${isVintage ? "text-rose-700" : "text-rose-300"}`}>⚠️ Trigger Warning</p>
                <p className={`text-xs ${isVintage ? "text-rose-600" : "text-neutral-400"}`}>
                  Cerita ini mengandung tema <span className={isVintage ? "text-rose-700 font-medium" : "text-rose-400"}>depresi, percobaan bunuh diri, dan gangguan kesehatan mental</span>. 
                  Jika kamu sedang tidak baik-baik saja, pertimbangkan untuk tidak membaca atau minta pendampingan.
                </p>
                <button 
                  onClick={() => setShowTriggerWarning(false)}
                  className={`mt-2 text-xs transition-colors ${isVintage ? "text-amber-600 hover:text-amber-800" : "text-amber-400 hover:text-amber-300"}`}
                >
                  Saya mengerti, lanjutkan →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Catatan / Kertas */}
        <div className={`relative rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm border ${styles.container}`}>
          {/* Efek lipatan kertas untuk mode vintage */}
          {isVintage && (
            <>
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-30">
                <div className="absolute -top-10 -right-10 w-20 h-20 rotate-45 bg-gradient-to-br from-transparent to-amber-400/20" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-amber-900/5 to-transparent rounded-b-2xl" />
            </>
          )}
          
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 border rounded-full text-xs font-mono ${styles.tag}`}>
                {cerpen.category}
              </span>
              <span className={`text-[10px] font-mono ${isVintage ? "text-amber-400" : "text-neutral-500"}`}>#{cerpen.id}</span>
            </div>
            
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-tight ${styles.title}`}>
              {cerpen.title}
            </h1>
            
            <div className={`flex flex-wrap items-center gap-3 text-xs ${styles.meta}`}>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-mono">{cerpen.date}</span>
              </div>
              <div className={`w-1 h-1 rounded-full ${isVintage ? "bg-amber-300" : "bg-neutral-600"}`} />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">{cerpen.readTime}</span>
              </div>
              <div className={`w-1 h-1 rounded-full ${isVintage ? "bg-amber-300" : "bg-neutral-600"}`} />
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-mono">Dibaca diam-diam</span>
              </div>
            </div>
          </div>

          {/* Quote / Excerpt */}
          <div className={`mb-8 p-4 italic border-l-2 rounded-r-lg ${styles.quote}`}>
            <Quote className={`w-4 h-4 mb-2 opacity-50 ${isVintage ? "text-amber-500" : ""}`} />
            <p className={`text-sm font-light ${isVintage ? "text-amber-700" : ""}`}>"{cerpen.excerpt}"</p>
          </div>

          {/* Konten dengan dialog styling */}
          <div 
            ref={contentRef}
            className={`prose prose-invert max-w-none ${styles.content} prose-p:text-base prose-p:font-light prose-p:leading-relaxed prose-p:mb-3`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {cerpen.content.split('\n\n').map((paragraph, idx) => (
              <div key={idx}>
                {processContent(paragraph, isVintage)}
              </div>
            ))}
          </div>

          {/* Legend / Keterangan */}
          <div className={`mt-8 pt-4 border-t ${styles.divider} flex flex-wrap gap-4 justify-center text-[10px]`}>
            <div className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded italic text-[9px] ${isVintage ? "bg-amber-100 text-amber-700" : "bg-sky-500/10 text-sky-300"}`}>"teks"</span>
              <span className={isVintage ? "text-amber-500" : "text-neutral-500"}>Dialog</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${isVintage ? "bg-amber-100 text-amber-700" : "bg-neutral-900 text-green-400"}`}>$ command</div>
              <span className={isVintage ? "text-amber-500" : "text-neutral-500"}>Catatan Terminal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-bold ${isVintage ? "text-amber-700" : "text-amber-400"}`}>**tebal**</span>
              <span className={isVintage ? "text-amber-500" : "text-neutral-500"}>Heading</span>
            </div>
          </div>

          {/* Closing message */}
          <div className={`mt-6 pt-4 text-center border-t ${styles.divider}`}>
            <p className={`text-[10px] font-mono ${styles.footer}`}>
              ~ selesai ~
            </p>
          </div>
        </div>

        {/* Related Notes */}
        {relatedCerpen.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-px bg-gradient-to-r ${isVintage ? "from-amber-400/50" : "from-amber-500/50"} to-transparent`} />
              <h2 className={`text-sm font-medium tracking-wider ${isVintage ? "text-amber-600" : "text-neutral-400"}`}>
                Catatan Lainnya
              </h2>
              <div className={`flex-1 h-px bg-gradient-to-l ${isVintage ? "from-amber-400/50" : "from-amber-500/50"} to-transparent`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedCerpen.map((cerita) => (
                <Link key={cerita.id} href={`/blog/${cerita.id}`} className="group">
                  <div className={`rounded-xl p-3 transition-all duration-300 ${
                    isVintage 
                      ? "bg-amber-50 border border-amber-200 hover:border-amber-400 hover:bg-amber-100" 
                      : "bg-neutral-900/40 border border-neutral-800 hover:border-amber-500/30 hover:bg-neutral-900/60"
                  }`}>
                    <h3 className={`font-medium mb-1 transition-colors line-clamp-2 text-sm ${
                      isVintage 
                        ? "text-amber-800 group-hover:text-amber-600" 
                        : "text-white group-hover:text-amber-400"
                    }`}>
                      {cerita.title}
                    </h3>
                    <div className={`flex items-center gap-2 text-[10px] ${isVintage ? "text-amber-400" : "text-neutral-500"}`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{cerita.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Maria's Note */}
        <div className="mt-12 text-center">
          <div className={`inline-block px-4 py-2 rounded-full backdrop-blur-sm ${
            isVintage 
              ? "bg-amber-50 border border-amber-200" 
              : "bg-neutral-900/60 border border-neutral-800"
          }`}>
            <p className={`text-xs font-mono ${isVintage ? "text-amber-600" : "text-neutral-500"}`}>
              "Setiap catatan adalah jejak. Baca dengan hati-hati."
            </p>
          </div>
          <p className={`text-[10px] mt-3 font-mono ${isVintage ? "text-amber-400" : "text-neutral-600"}`}>
            — Maria, penjaga catatan
          </p>
        </div>

        {/* Help Resources */}
        <div className={`mt-8 p-4 rounded-lg text-center ${
          isVintage 
            ? "bg-rose-50 border border-rose-200" 
            : "bg-rose-500/5 border border-rose-500/20"
        }`}>
          <p className={`text-xs font-mono mb-2 ${isVintage ? "text-rose-600" : "text-rose-400"}`}>💬 Butuh bantuan?</p>
          <p className={`text-[10px] ${isVintage ? "text-rose-500" : "text-neutral-500"}`}>
            Jika kamu atau temanmu mengalami hal serupa dalam cerita ini, jangan ragu untuk mencari bantuan profesional.
          </p>
          <p className={`text-[9px] mt-2 font-mono ${isVintage ? "text-amber-400" : "text-neutral-600"}`}>
            Kamu tidak sendirian. Ada yang peduli.
          </p>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          75% { transform: translateY(6px) translateX(-4px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
}