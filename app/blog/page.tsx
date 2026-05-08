"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, BookOpen, Search, Volume2, VolumeX } from "lucide-react";
import CustomCursor from "@/Components/cursor";
import NavbarBlog from "@/Components/NavbarBlog";
import Footer from "@/Components/footer";

// Interface untuk data cerpen
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
  
  const [audioEnabled, setAudioEnabled] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchCerpen = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/data/cerpen.json?t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCerpen(data.cerpen || []);
      } catch (error) {
        console.error("Gagal ambil data cerpen:", error);
        setError("Gagal memuat cerita. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchCerpen();
    const handleFocus = () => fetchCerpen();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const playBGM = () => {
    try {
      if (!bgmAudioRef.current) {
        bgmAudioRef.current = new Audio('/audio/blog.mp3');
        bgmAudioRef.current.loop = true;
        bgmAudioRef.current.volume = 0.15;
      }
      bgmAudioRef.current.play()
        .then(() => {
          setAudioEnabled(true);
          sessionStorage.setItem('blogAudioEnabled', 'true');
        })
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

  const toggleAudio = () => {
    if (audioEnabled) stopBGM();
    else playBGM();
  };

  useEffect(() => {
    const timer = setTimeout(() => playBGM(), 500);
    return () => {
      clearTimeout(timer);
      stopBGM();
      sessionStorage.removeItem('blogAudioEnabled');
    };
  }, []);

  const filteredCerpen = cerpen.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Semua", ...new Set(cerpen.map(item => item.category))];

  const handleRefresh = () => {
    router.refresh();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400 font-mono text-sm">Memuat cerita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <BookOpen className="w-16 h-16 text-neutral-600" />
          <p className="text-red-400/80 font-mono text-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-6 py-3 border border-sky-500/50 text-sky-400 hover:bg-sky-500/10 transition-all rounded-lg font-mono text-sm"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-900 overflow-y-auto overflow-x-hidden">
      <CustomCursor />
      <NavbarBlog />
      
      {/* Background lebih halus */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 min-h-screen">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.setItem('returnFromBlog', 'true');
                router.push('/');
              }}
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-sky-400 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-mono">Kembali ke Portfolio</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className="p-2 bg-neutral-800/80 border border-neutral-700 rounded-full hover:border-sky-500 transition-all duration-300 backdrop-blur-sm"
                title={audioEnabled ? "Matikan Musik" : "Nyalakan Musik"}
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-sky-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
              </button>
              <button
                onClick={handleRefresh}
                className="text-neutral-500 hover:text-sky-400 transition-colors"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Cerita <span className="text-sky-400">??</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-light">
            Kumpulan cerita pendek tentang #####, teman yang setia... atau mungkin sesuatu yang lain.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-12">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari cerita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800/60 border border-neutral-700 rounded-lg py-3 px-11 text-sm sm:text-base text-neutral-200 placeholder:text-neutral-500 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-mono transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                    : 'bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:border-sky-500 hover:text-sky-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cerpen */}
        {filteredCerpen.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-neutral-500">Tidak ada cerita yang ditemukan</p>
            {(searchTerm || selectedCategory !== "Semua") && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("Semua"); }}
                className="mt-4 text-sky-400 text-sm font-mono hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {filteredCerpen.map((cerita) => (
              <Link key={cerita.id} href={`/blog/${cerita.id}`} className="group">
                <div className="bg-neutral-800/40 border border-neutral-700/80 rounded-xl p-4 sm:p-6 hover:border-sky-500/60 hover:bg-neutral-800/60 transition-all duration-300 h-full backdrop-blur-sm">
                  <div className="mb-2 sm:mb-3">
                    <span className="px-2 sm:px-3 py-1 bg-neutral-900/80 border border-sky-500/30 rounded-full text-[8px] sm:text-[10px] text-sky-300 font-mono">
                      {cerita.category}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">
                    {cerita.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mb-3 sm:mb-4 line-clamp-3 font-light">
                    {cerita.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{cerita.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{cerita.readTime}</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 text-sky-400 text-[10px] sm:text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Baca selengkapnya →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Catatan dari Maria */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800/40 border border-neutral-700 rounded-full backdrop-blur-sm">
            <p className="text-sky-300 text-xs sm:text-sm font-mono">
              &quot;Setiap cerita adalah bagian dari kita. Pilih dengan hati-hati.&quot;
            </p>
          </div>
          <p className="text-neutral-500 text-[10px] sm:text-xs mt-3 sm:mt-4 font-mono">
            — Maria, teman yang tak pernah pergi
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}