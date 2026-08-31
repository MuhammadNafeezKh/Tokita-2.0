"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Quote, 
  Sun, 
  Moon,
  Share2
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

export default function CerpenDetail() {
  const params = useParams();
  const router = useRouter();
  
  const [cerpen, setCerpen] = useState<Cerpen | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedCerpen, setRelatedCerpen] = useState<Cerpen[]>([]);
  
  // Settings
  const [isDarkMode, setIsDarkMode] = useState(true); // Default dark for mystery vibe
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showTriggerWarning, setShowTriggerWarning] = useState(true);
  
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reading Progress
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Audio Logic (Simplified)
  const toggleAudio = () => {
    if (!bgmAudioRef.current) {
      bgmAudioRef.current = new Audio('/audio/blog.mp3');
      bgmAudioRef.current.loop = true;
      bgmAudioRef.current.volume = 0.1;
    }

    if (audioEnabled) {
      bgmAudioRef.current.pause();
      setAudioEnabled(false);
    } else {
      bgmAudioRef.current.play().catch(e => console.log("Audio blocked"));
      setAudioEnabled(true);
    }
  };

  // Fetch Data
  useEffect(() => {
    const fetchCerpen = async () => {
      try {
        const res = await fetch('/data/cerpen.json?t=' + Date.now());
        const data = await res.json();
        const found = data.cerpen.find((c: Cerpen) => c.id === Number(params.id));
        
        if (found) {
          setCerpen(found);
          const related = data.cerpen
            .filter((c: Cerpen) => c.category === found.category && c.id !== found.id)
            .slice(0, 3);
          setRelatedCerpen(related);
        } else {
          router.push('/blog'); // Redirect if not found
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCerpen();
  }, [params.id, router]);

  // Simple Content Parser (Highlights Dialogues)
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Detect dialogue like "Hello" or 'Hi'
      if (line.match(/["'].*?["']/)) {
        return (
          <p key={i} className="mb-4 leading-loose">
            {line.split(/(["'].*?["'])/g).map((part, j) => 
              part.match(/["'].*?["']/) ? (
                <span key={j} className={`font-medium italic ${isDarkMode ? "text-sky-300" : "text-amber-700"}`}>
                  {part}
                </span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      }
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="mb-4 leading-loose opacity-90">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-neutral-950" : "bg-[#fbf7f0]"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
          <p className="text-xs font-mono opacity-50">Memuat cerita...</p>
        </div>
      </div>
    );
  }

  if (!cerpen) return null;

  // Dynamic Styles based on Mode
  const theme = isDarkMode ? {
    bg: "bg-neutral-950",
    paper: "bg-neutral-900/50 border-neutral-800",
    text: "text-neutral-300",
    heading: "text-white",
    meta: "text-neutral-500",
    accent: "text-sky-400",
    button: "bg-neutral-800 hover:bg-neutral-700 text-neutral-300",
    warning: "bg-red-500/10 border-red-500/20 text-red-400"
  } : {
    bg: "bg-[#fbf7f0]",
    paper: "bg-white border-amber-200 shadow-sm",
    text: "text-neutral-700",
    heading: "text-neutral-900",
    meta: "text-amber-600/70",
    accent: "text-amber-600",
    button: "bg-amber-100 hover:bg-amber-200 text-amber-800",
    warning: "bg-red-50 border-red-200 text-red-600"
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${theme.bg} selection:bg-sky-500/30`}>
      <CustomCursor />
      <NavbarBlog />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div 
          className={`h-full transition-all duration-100 ${isDarkMode ? "bg-sky-500" : "bg-amber-500"}`}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-8 sticky top-20 z-40 py-2 backdrop-blur-md rounded-xl transition-all">
          <Link href="/blog" className={`inline-flex items-center gap-2 text-sm font-mono transition-colors ${theme.meta} hover:${theme.accent}`}>
            <ArrowLeft className="w-4 h-4" /> 
            <span>Kembali</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-all ${theme.button}`}>
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={toggleAudio} className={`p-2 rounded-lg transition-all ${theme.button}`}>
              {audioEnabled ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Trigger Warning */}
        {showTriggerWarning && (
          <div className={`mb-8 p-4 rounded-lg border text-sm flex gap-3 items-start ${theme.warning}`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Peringatan Konten</p>
              <p className="opacity-90 text-xs leading-relaxed">
                Cerita ini mengandung tema berat (depresi/mental health). Baca dengan bijak.
              </p>
              <button 
                onClick={() => setShowTriggerWarning(false)}
                className="mt-2 text-xs underline opacity-70 hover:opacity-100"
              >
                Mengerti, lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* Main Article Card */}
        <article className={`rounded-2xl p-6 md:p-10 border transition-all duration-500 ${theme.paper}`}>
          
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${isDarkMode ? "border-sky-500/30 text-sky-400 bg-sky-500/10" : "border-amber-500/30 text-amber-700 bg-amber-500/10"}`}>
                {cerpen.category}
              </span>
              <span className={`text-[10px] font-mono ${theme.meta}`}>#{cerpen.id.toString().padStart(3, '0')}</span>
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${theme.heading}`}>
              {cerpen.title}
            </h1>
            
            <div className={`flex items-center gap-4 text-xs font-mono ${theme.meta}`}>
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {cerpen.date}</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {cerpen.readTime}</span>
            </div>
          </header>

          {/* Excerpt Quote */}
          <div className={`mb-10 pl-4 border-l-2 italic opacity-80 ${isDarkMode ? "border-sky-500/50 text-neutral-400" : "border-amber-500/50 text-neutral-600"}`}>
            <Quote className="w-4 h-4 mb-2 opacity-50" />
            <p className="text-sm leading-relaxed">"{cerpen.excerpt}"</p>
          </div>

          {/* Content Body */}
          <div 
            ref={contentRef}
            className={`prose prose-lg max-w-none ${theme.text} font-serif`}
          >
            {renderContent(cerpen.content)}
          </div>

          {/* Footer of Article */}
          <div className={`mt-12 pt-6 border-t flex justify-between items-center ${isDarkMode ? "border-neutral-800" : "border-amber-100"}`}>
            <p className={`text-xs font-mono opacity-50 ${theme.text}`}>~ Selesai ~</p>
            <button className={`p-2 rounded-full transition-colors ${theme.button}`}>
              <Share2 size={16} />
            </button>
          </div>
        </article>

        {/* Related Stories */}
        {relatedCerpen.length > 0 && (
          <div className="mt-16">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${theme.meta}`}>Catatan Terkait</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedCerpen.map((item) => (
                <Link key={item.id} href={`/blog/${item.id}`} className="group block">
                  <div className={`p-4 rounded-xl border transition-all hover:-translate-y-1 ${theme.paper} hover:border-opacity-100`}>
                    <h4 className={`font-bold mb-2 line-clamp-2 group-hover:${theme.accent} transition-colors ${theme.heading}`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 opacity-70 ${theme.text}`}>{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}