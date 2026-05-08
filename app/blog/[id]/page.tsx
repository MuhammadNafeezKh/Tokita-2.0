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
  const [audioEnabled, setAudioEnabled] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  const playBGM = () => {
    try {
      if (!bgmAudioRef.current) {
        bgmAudioRef.current = new Audio('/audio/blog.mp3');
        bgmAudioRef.current.loop = true;
        bgmAudioRef.current.volume = 0.15;
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
        const res = await fetch('/data/cerpen.json');
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

  if (loading) {
    return (
      <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-teal-400 font-mono text-sm">Membaca cerita...</p>
        </div>
      </div>
    );
  }

  if (!cerpen) {
    return (
      <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-400 mb-4">Cerita tidak ditemukan</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span>Kembali ke Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-y-auto overflow-x-hidden">
      <CustomCursor />
      <NavbarBlog />
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-400 hover:text-teal-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono">Kembali ke Blog</span>
          </Link>
          <button onClick={toggleAudio} className="p-2 bg-neutral-800/60 border border-neutral-700 rounded-full hover:border-teal-500 transition-all duration-300 backdrop-blur-sm">
            {audioEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>
        </div>

        <article className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm">
          <div className="mb-6">
            <div className="mb-3">
              <span className="px-2.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded-full text-xs text-teal-400 font-mono">{cerpen.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">{cerpen.title}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{cerpen.date}</span></div>
              <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{cerpen.readTime}</span></div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-white prose-a:text-teal-400">
            {cerpen.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-base font-light">
                {paragraph.split('\n').map((line, lineIdx) => (
                  <span key={lineIdx}>{line}{lineIdx < paragraph.split('\n').length - 1 && <br />}</span>
                ))}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-800">
            <p className="text-neutral-500 text-sm italic text-center">"{cerpen.excerpt}"</p>
          </div>
        </article>

        {relatedCerpen.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Cerita Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedCerpen.map((cerita) => (
                <Link key={cerita.id} href={`/blog/${cerita.id}`} className="group">
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 hover:border-teal-500 transition-all duration-300">
                    <h3 className="text-white font-bold mb-1 group-hover:text-teal-400 transition-colors line-clamp-2">{cerita.title}</h3>
                    <p className="text-neutral-400 text-xs line-clamp-2">{cerita.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block px-5 py-2 bg-neutral-900/60 border border-neutral-800 rounded-full">
            <p className="text-neutral-400 text-sm font-mono">"Setiap cerita adalah bagian dari kita. Pilih dengan hati-hati."</p>
          </div>
          <p className="text-neutral-600 text-xs mt-3 font-mono">— Maria, teman yang tak pernah pergi</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}