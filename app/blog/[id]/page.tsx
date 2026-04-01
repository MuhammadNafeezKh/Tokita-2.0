"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, Volume2, VolumeX } from "lucide-react";
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
  
  // State untuk audio
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedAutoPlay = useRef(false);

  // Play Background Music Blog
  const playBGM = () => {
    try {
      if (!bgmAudioRef.current) {
        bgmAudioRef.current = new Audio('/audio/blog.mp3');
        bgmAudioRef.current.loop = true;
        bgmAudioRef.current.volume = 0.15;
      }
      
      // Reset error state
      setAudioError(false);
      
      // Play audio
      const playPromise = bgmAudioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioEnabled(true);
            console.log("Blog BGM started");
            
            // Simpan status ke sessionStorage
            sessionStorage.setItem('blogAudioEnabled', 'true');
            sessionStorage.setItem('blogAudioTimestamp', Date.now().toString());
          })
          .catch(e => {
            console.log("BGM Play Error:", e);
            setAudioError(true);
            setAudioEnabled(false);
            
            // Fallback: coba play lagi setelah interaksi user
            const handleFirstInteraction = () => {
              if (bgmAudioRef.current) {
                bgmAudioRef.current.play()
                  .then(() => {
                    setAudioEnabled(true);
                    setAudioError(false);
                    sessionStorage.setItem('blogAudioEnabled', 'true');
                    sessionStorage.setItem('blogAudioTimestamp', Date.now().toString());
                  })
                  .catch(console.log);
              }
              document.removeEventListener('click', handleFirstInteraction);
              document.removeEventListener('touchstart', handleFirstInteraction);
            };
            
            document.addEventListener('click', handleFirstInteraction, { once: true });
            document.addEventListener('touchstart', handleFirstInteraction, { once: true });
          });
      }
        
    } catch (e) {
      console.log("BGM Error:", e);
      setAudioError(true);
      setAudioEnabled(false);
    }
  };

  // Stop Background Music
  const stopBGM = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
      // Tidak set currentTime ke 0 agar bisa lanjut dari posisi terakhir
    }
    setAudioEnabled(false);
    sessionStorage.setItem('blogAudioEnabled', 'false');
  };

  // Toggle audio
  const toggleAudio = () => {
    if (audioEnabled) {
      stopBGM();
    } else {
      playBGM();
    }
  };

  // Check audio status dari sessionStorage saat mount
  useEffect(() => {
    const audioStatus = sessionStorage.getItem('blogAudioEnabled');
    const audioTimestamp = sessionStorage.getItem('blogAudioTimestamp');
    
    // Cek apakah audio seharusnya menyala (dari halaman sebelumnya)
    if (audioStatus === 'true' && !hasAttemptedAutoPlay.current) {
      hasAttemptedAutoPlay.current = true;
      
      // Cek apakah timestamp masih relevan (kurang dari 1 detik yang lalu)
      // Ini untuk menghindari audio nyala di halaman yang di-refresh setelah lama
      if (audioTimestamp) {
        const timeDiff = Date.now() - parseInt(audioTimestamp);
        if (timeDiff < 1000) { // Kurang dari 1 detik
          playBGM();
        } else {
          // Terlalu lama, reset status
          sessionStorage.setItem('blogAudioEnabled', 'false');
        }
      } else {
        playBGM();
      }
    }
    
    // Cleanup saat komponen unmount
    return () => {
      console.log("Cerpen detail page unmounting...");
      // Jangan stop BGM di sini karena kita ingin audio lanjut ke halaman lain
      // Hanya cleanup referensi
    };
  }, []);

  // Efek untuk menangani saat user pindah halaman (popstate)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Simpan timestamp saat user akan meninggalkan halaman
      if (audioEnabled) {
        sessionStorage.setItem('blogAudioTimestamp', Date.now().toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [audioEnabled]);

  useEffect(() => {
    const fetchCerpen = async () => {
      try {
        const res = await fetch('/data/cerpen.json');
        const data = await res.json();
        
        const found = data.cerpen.find((c: Cerpen) => c.id === Number(params.id));
        setCerpen(found);
        
        if (found) {
          const related = data.cerpen
            .filter((c: Cerpen) => c.category === found.category && c.id !== found.id)
            .slice(0, 3);
          setRelatedCerpen(related);
        }
      } catch (error) {
        console.error("Gagal ambil data cerpen:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCerpen();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#5f3a4a] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5f3a4a] font-mono text-sm">Membaca cerita...</p>
        </div>
      </div>
    );
  }

  if (!cerpen) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#5f3a4a]/30 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Cerita tidak ditemukan</p>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[#5f3a4a] hover:text-[#5f3a4a]/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-y-auto">
      <CustomCursor />
      <NavbarBlog />
      
      {/* Background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-[#120a12] to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        {/* Header with audio control */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[#5f3a4a] hover:text-[#7f4a5a] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-mono">Kembali ke Blog</span>
          </Link>
          
          {/* Audio Control Button */}
          <button
            onClick={toggleAudio}
            className={`p-2 bg-black/60 border rounded-full transition-all duration-300 backdrop-blur-sm ${
              audioError 
                ? 'border-red-500/30 hover:border-red-500' 
                : 'border-[#5f3a4a]/30 hover:border-[#5f3a4a]'
            }`}
            title={
              audioError 
                ? "Klik untuk mencoba lagi" 
                : (audioEnabled ? "Matikan Musik" : "Nyalakan Musik")
            }
          >
            {audioError ? (
              <span className="text-red-500/50 text-xs font-mono px-1">!</span>
            ) : audioEnabled ? (
              <Volume2 className="w-4 h-4 text-[#5f3a4a]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#5f3a4a]/50" />
            )}
          </button>
        </div>

        {/* Article */}
        <article className="bg-[#0a050a] border border-[#3a2a2a] rounded-xl p-6 sm:p-8 md:p-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="px-2 sm:px-3 py-1 bg-black/60 border border-[#5f3a4a]/30 rounded-full text-[8px] sm:text-[10px] text-[#5f3a4a] font-mono">
                {cerpen.category}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              {cerpen.title}
            </h1>
            
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{cerpen.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{cerpen.readTime}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {cerpen.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4 font-light">
                {paragraph.split('\n').map((line, lineIdx) => (
                  <span key={lineIdx}>
                    {line}
                    {lineIdx < paragraph.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-[#5f3a4a]/20">
            <p className="text-[#5f3a4a]/60 text-xs sm:text-sm italic text-center">
              &quot;{cerpen.excerpt}&quot;
            </p>
          </div>
        </article>

        {/* Related stories */}
        {relatedCerpen.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Cerita Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {relatedCerpen.map((cerita) => (
                <Link
                  key={cerita.id}
                  href={`/blog/${cerita.id}`}
                  className="group"
                >
                  <div className="bg-[#0a050a] border border-[#3a2a2a] rounded-lg p-3 sm:p-4 hover:border-[#5f3a4a] transition-colors">
                    <h3 className="text-sm sm:text-base text-white font-bold mb-1 sm:mb-2 group-hover:text-[#5f3a4a] transition-colors line-clamp-2">
                      {cerita.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {cerita.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}