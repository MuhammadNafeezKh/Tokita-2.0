"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  BookOpen, 
  Search, 
  Volume2, 
  VolumeX, 
  Eye, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Feather
} from "lucide-react";
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
}

export default function BlogPage() {
  const router = useRouter();
  const [cerpen, setCerpen] = useState<Cerpen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [error, setError] = useState<string | null>(null);
  
  // Hint State
  const [showHint, setShowHint] = useState(false);
  const [typedHint, setTypedHint] = useState("");
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio State
  const [audioEnabled, setAudioEnabled] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const mysteriousMessages = [
    "...ada yang mengawasi?",
    "Mari kita baca bersama...",
    "Setiap kata menyimpan rahasia",
    "Jangan terlalu dalam menyelam...",
    "Ingatan itu rapuh...",
    "???"
  ];

  // Cleanup hint timeout
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  // Hint Logic
  const handleHintHover = useCallback(() => {
    setShowHint(true);
    const msg = mysteriousMessages[Math.floor(Math.random() * mysteriousMessages.length)];
    
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    
    setTypedHint(msg);
    hintTimeoutRef.current = setTimeout(() => {
      setTypedHint("");
      setShowHint(false);
    }, 2500);
  }, []);

  // Fetch Data
  const fetchCerpen = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/data/cerpen.json?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCerpen(data.cerpen || []);
    } catch (err) {
      console.error("Gagal ambil data cerpen:", err);
      setError("Gagal memuat cerita. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCerpen();
    window.addEventListener('focus', fetchCerpen);
    return () => window.removeEventListener('focus', fetchCerpen);
  }, [fetchCerpen]);

  // Audio Logic
  const toggleAudio = useCallback(() => {
    if (!bgmAudioRef.current) {
      bgmAudioRef.current = new Audio('/audio/blog.mp3');
      bgmAudioRef.current.loop = true;
      bgmAudioRef.current.volume = 0.15;
    }

    if (audioEnabled) {
      bgmAudioRef.current.pause();
      setAudioEnabled(false);
    } else {
      bgmAudioRef.current.play()
        .then(() => setAudioEnabled(true))
        .catch(e => console.warn("Audio play blocked:", e));
    }
  }, [audioEnabled]);

  // Cleanup Audio on Unmount
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current.src = "";
      }
    };
  }, []);

  const filteredCerpen = cerpen.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Semua", ...new Set(cerpen.map(item => item.category))];

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-sky-500/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-t-2 border-sky-400 rounded-full animate-spin" />
            <Feather className="absolute inset-0 m-auto w-6 h-6 text-sky-500/50 animate-pulse" />
          </div>
          <p className="text-slate-400 font-mono text-xs tracking-[0.2em] uppercase animate-pulse">
            Membuka lembaran cerita...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl shadow-red-900/10">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">Terjadi Kesalahan</h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all text-sm font-medium flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200">
      <CustomCursor />
      <NavbarBlog />
      
      {/* Background Ambience - More Soft & Atmospheric */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        
        {/* Radial Glow at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/5 rounded-full blur-[100px]" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Floating Particles - Subtle */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sky-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 min-h-screen">
        
        {/* Header Section */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.setItem('returnFromBlog', 'true');
                router.push('/');
              }}
              className="group inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm font-mono"
            >
              <div className="p-1.5 rounded-full bg-slate-900 border border-slate-800 group-hover:border-sky-500/50 transition-all">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span>Kembali ke Portfolio</span>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* Mystery Eye Button */}
              <div className="relative">
                <button
                  onMouseEnter={handleHintHover}
                  className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-full hover:border-sky-500/50 hover:bg-slate-800 transition-all duration-300 group"
                  aria-label="Petunjuk Misterius"
                >
                  <Eye className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </button>
                
                {/* Floating Hint Tooltip */}
                {showHint && typedHint && (
                  <div className="absolute top-full right-0 mt-3 px-3 py-1.5 bg-slate-900 border border-sky-500/30 rounded-md text-[10px] text-sky-300 font-mono whitespace-nowrap shadow-xl shadow-sky-900/20 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 border-l border-t border-sky-500/30 rotate-45" />
                    {typedHint}
                  </div>
                )}
              </div>

              {/* Audio Toggle */}
              <button
                onClick={toggleAudio}
                className={`p-2.5 rounded-full border transition-all duration-300 ${
                  audioEnabled 
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                aria-label={audioEnabled ? "Matikan Musik" : "Nyalakan Musik"}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="relative pl-6 border-l-2 border-sky-500/30">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Cerita <span className="text-sky-400 inline-block animate-pulse">??</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light italic max-w-xl leading-relaxed">
              &quot;{mysteriousMessages[Math.floor(Math.random() * mysteriousMessages.length)]}&quot;
            </p>
          </div>
        </header>

        {/* Search & Filter Bar - Sticky & Glassy */}
        <div className="sticky top-20 z-30 bg-slate-950/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-white/5 mb-10 transition-all">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari judul atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20 transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide mask-linear-fade">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap border ${
                    selectedCategory === category
                      ? 'bg-sky-500 text-slate-950 border-sky-500 font-bold'
                      : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {filteredCerpen.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-400 font-medium">Tidak ada cerita ditemukan</p>
              <p className="text-slate-600 text-sm mt-1">Mungkin ceritanya masih bersembunyi?</p>
              {(searchTerm || selectedCategory !== "Semua") && (
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("Semua"); }}
                  className="mt-6 text-sky-400 text-sm hover:underline underline-offset-4"
                >
                  Reset pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCerpen.map((cerita) => (
                <Link 
                  key={cerita.id} 
                  href={`/blog/${cerita.id}`} 
                  className="group relative block h-full"
                >
                  <article className="h-full bg-slate-900/40 border border-slate-800 rounded-xl p-6 transition-all duration-500 hover:bg-slate-900 hover:border-sky-500/30 hover:shadow-[0_0_30px_-10px_rgba(56,189,248,0.1)] overflow-hidden flex flex-col">
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          {cerita.category.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cerita.readTime}</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                        {cerita.title}
                      </h2>
                      
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                        {cerita.excerpt}
                      </p>

                      <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{cerita.date}</span>
                        </div>
                        <span className="text-xs font-medium text-sky-500 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                          Baca Cerita <ArrowLeft className="w-3 h-3 rotate-180" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer Quote / Maria's Note */}
        <div className="mt-24 text-center relative py-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-slate-800 to-transparent" />
          
          <div className="inline-block max-w-md mx-auto px-6 py-4 bg-slate-900/30 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-sky-500/50 mx-auto mb-3" />
            <p className="text-slate-400 text-sm italic leading-relaxed">
              &quot;Setiap cerita adalah potongan ingatan yang mencoba bertahan. Pilih dengan hati-hati, karena beberapa pintu tidak boleh dibuka.&quot;
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
              <span className="w-8 h-px bg-slate-800" />
              Maria
              <span className="w-8 h-px bg-slate-800" />
            </div>
          </div>
        </div>

      </main>
      
      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}