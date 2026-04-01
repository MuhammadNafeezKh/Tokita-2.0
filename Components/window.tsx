"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Window = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cursor1Ref = useRef<HTMLSpanElement>(null);
  const cursor2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 0%",
          scrub: 2.5,
          toggleActions: "play play reverse reverse",
        },
      });

      tl.fromTo(
        ".window-1",
        { opacity: 0, x: -20, y: 30, scale: 0.98 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }
      )
      .fromTo(
        ".window-1 .code-line",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        "-=1"
      )
      .to(
        cursor1Ref.current,
        { opacity: 1, duration: 0.7, repeat: -1, yoyo: true, ease: "steps(1)" },
        "-=0.5"
      )

      .fromTo(
        ".window-2",
        { opacity: 0, x: 20, y: -30, scale: 0.98 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        ".window-2 .code-line",
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        "-=1"
      )
      .to(
        cursor2Ref.current,
        { opacity: 1, duration: 0.7, repeat: -1, yoyo: true, ease: "steps(1)" },
        "-=0.5"
      );

      gsap.to(".window-1", {
        y: -4,
        x: -2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".window-2", {
        y: 5,
        x: 3,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 0%",
        end: "bottom bottom",
        onLeave: () => {
          gsap.to(".window-1, .window-2", {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: "power2.in",
          });
        },
        onEnterBack: () => {
          gsap.to(".window-1, .window-2", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 px-3 overflow-visible"
      aria-hidden="true"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e6f0fa]/30 to-transparent pointer-events-none" />
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,30,30,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,30,30,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* WINDOW 1: Malam Putih - MOBILE FIRST */}
      <div className="window-1 absolute left-1/2 -translate-x-1/2 top-[5%] w-[95vw] max-w-[400px] sm:max-w-[450px] md:w-[480px] md:left-[10%] md:-translate-x-0 lg:left-[12%] xl:left-[15%] md:top-[15%] z-10">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-lg shadow-gray-200/50 w-full">
          {/* Header - Mobile compact */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-[#f3f3f3] border-b border-[#e0e0e0]">
            <div className="flex gap-1">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-gray-500 font-mono truncate">Malam Putih</span>
            <div className="ml-auto">
              <span className="text-[8px] sm:text-[10px] text-gray-400">Dostoevsky</span>
            </div>
          </div>

          {/* Code Content - Mobile friendly */}
          <pre className="p-3 sm:p-4 md:p-5 font-mono text-[9px] sm:text-xs md:text-sm text-gray-800 leading-relaxed overflow-x-auto whitespace-pre bg-white">
            <code className="block min-w-[280px] sm:min-w-0">
              <span className="code-line block text-[#008000]">
                <span className="text-[#0000ff]">//</span> pertama kali diperlakukan seperti itu oleh N.
              </span>

              <span className="code-line block mt-2">
                <span className="text-[#0000ff]">const</span>{" "}
                <span className="text-[#001080] font-semibold">pemimpi</span>{" "}
                <span className="text-gray-800">=</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-[#001080] font-semibold">rasa</span>
                <span className="text-gray-800">:</span>{" "}
                <span className="text-[#a31515]">&quot;cinta&quot;</span>
                <span className="text-gray-800">,</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-[#001080] font-semibold">alasan</span>
                <span className="text-gray-800">:</span>{" "}
                <span className="text-[#a31515]">&quot;haus koneksi&quot;</span>
              </span>
              <span className="code-line block">
                <span className="text-gray-800">{"}"};</span>
              </span>

              <span className="code-line block mt-2">
                <span className="text-[#0000ff]">const</span>{" "}
                <span className="text-[#001080] font-semibold">n</span>{" "}
                <span className="text-gray-800">=</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-[#001080] font-semibold">rasa</span>
                <span className="text-gray-800">:</span>{" "}
                <span className="text-[#a31515]">&quot;senang&quot;</span>
                <span className="text-gray-800">,</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-[#001080] font-semibold">batas</span>
                <span className="text-gray-800">:</span>{" "}
                <span className="text-[#a31515]">&quot;teman&quot;</span>
              </span>
              <span className="code-line block">
                <span className="text-gray-800">{"}"};</span>
              </span>

              <span className="code-line block mt-2 text-[#008000] hidden xs:block">
                <span className="text-[#0000ff]">//</span> ketimpangan harapan
              </span>

              <span className="code-line block mt-1">
                <span className="text-[#0000ff]">if</span>{" "}
                <span className="text-gray-800">(</span>
                <span className="text-[#001080] font-semibold">pemimpi</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">rasa</span>{" "}
                <span className="text-gray-800">!==</span>{" "}
                <span className="text-[#001080] font-semibold">n</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">rasa</span>
                <span className="text-gray-800">)</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-3">
                <span className="text-[#001080] font-semibold">pemimpi</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">memberi</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#a31515]">&quot;seluruh hati&quot;</span>
                <span className="text-gray-800">);</span>
              </span>
              <span className="code-line block pl-3">
                <span className="text-[#001080] font-semibold">n</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">menerima</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#a31515]">&quot;teman curhat&quot;</span>
                <span className="text-gray-800">);</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-gray-800">{"}"}</span>
              </span>

              <span className="code-line block mt-2 text-[#008000] hidden sm:block">
                <span className="text-[#0000ff]">//</span> &quot;Satu momen kebahagiaan penuh cukup untuk seumur hidup&quot;
              </span>
              <span className="code-line block mt-2 text-[#008000] sm:hidden">
                <span className="text-[#0000ff]">//</span> &quot;Satu momen cukup&quot;
              </span>

              <span
                ref={cursor1Ref}
                className="inline-block w-[2px] h-3 sm:h-4 bg-[#0000ff] align-middle opacity-0 ml-[2px] animate-pulse"
              />
            </code>
          </pre>
        </div>
      </div>

      {/* WINDOW 2: Metamorfosis - MOBILE FIRST */}
      <div className="window-2 absolute left-1/2 -translate-x-1/2 bottom-[5%] w-[95vw] max-w-[400px] sm:max-w-[450px] md:w-[480px] md:right-[10%] md:left-auto md:-translate-x-0 lg:right-[12%] xl:right-[15%] md:bottom-[15%] z-10">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-lg shadow-gray-200/50 w-full">
          {/* Header - Mobile compact */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-[#f3f3f3] border-b border-[#e0e0e0]">
            <div className="flex gap-1">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-gray-500 font-mono truncate">Metamorfosis</span>
            <div className="ml-auto">
              <span className="text-[8px] sm:text-[10px] text-gray-400">Kafka</span>
            </div>
          </div>

          {/* Code Content - Mobile friendly */}
          <pre className="p-3 sm:p-4 md:p-5 font-mono text-[9px] sm:text-xs md:text-sm text-gray-800 leading-relaxed overflow-x-auto whitespace-pre bg-white">
            <code className="block min-w-[280px] sm:min-w-0">
              <span className="code-line block text-[#008000]">
                <span className="text-[#0000ff]">//</span> Ketika G. terbangun, ia bukan lagi manusia
              </span>

              <span className="code-line block mt-2">
                <span className="text-[#0000ff]">class</span>{" "}
                <span className="text-[#001080] font-semibold">Manusia</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>

              <span className="code-line block pl-2">
                <span className="text-[#001080] font-semibold">constructor</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#001080] font-semibold">fungsi</span>
                <span className="text-gray-800">)</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-4">
                <span className="text-[#0000ff]">this</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">nilai</span>{" "}
                <span className="text-gray-800">=</span>{" "}
                <span className="text-[#001080] font-semibold">fungsi</span>
                <span className="text-gray-800">;</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-gray-800">{"}"}</span>
              </span>
              <span className="code-line block">
                <span className="text-gray-800">{"}"}</span>
              </span>

              <span className="code-line block mt-2">
                <span className="text-[#0000ff]">const</span>{" "}
                <span className="text-[#001080] font-semibold">g</span>{" "}
                <span className="text-gray-800">=</span>{" "}
                <span className="text-[#0000ff]">new</span>{" "}
                <span className="text-[#001080] font-semibold">Manusia</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#a31515]">&quot;tulangPunggung&quot;</span>
                <span className="text-gray-800">);</span>
              </span>

              <span className="code-line block mt-2 text-[#008000] hidden xs:block">
                <span className="text-[#0000ff]">//</span> Suatu pagi, ia berubah menjadi serangga
              </span>

              <span className="code-line block mt-1">
                <span className="text-[#0000ff]">if</span>{" "}
                <span className="text-gray-800">(</span>
                <span className="text-[#001080] font-semibold">g</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">bentuk</span>{" "}
                <span className="text-gray-800">!==</span>{" "}
                <span className="text-[#a31515]">&quot;manusia&quot;</span>
                <span className="text-gray-800">)</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-3">
                <span className="text-[#001080] font-semibold">keluarga</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">jijik</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#001080] font-semibold">g</span>
                <span className="text-gray-800">);</span>
              </span>
              <span className="code-line block pl-3">
                <span className="text-[#001080] font-semibold">kasihSayang</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">replace</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#a31515]">&quot;beban&quot;</span>
                <span className="text-gray-800">);</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-gray-800">{"}"}</span>
              </span>

              <span className="code-line block mt-2">
                <span className="text-[#0000ff]">while</span>{" "}
                <span className="text-gray-800">(</span>
                <span className="text-[#001080] font-semibold">terisolasi</span>
                <span className="text-gray-800">)</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-3">
                <span className="text-[#001080] font-semibold">g</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">kehilangan</span>
                <span className="text-gray-800">(</span>
                <span className="text-[#a31515]">&quot;identitas&quot;</span>
                <span className="text-gray-800">);</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-gray-800">{"}"}</span>
              </span>

              <span className="code-line block mt-2 text-[#008000] hidden sm:block">
                <span className="text-[#0000ff]">//</span> Pada akhirnya, yang mati bukan hanya tubuh
              </span>

              <span className="code-line block mt-1">
                <span className="text-[#0000ff]">if</span>{" "}
                <span className="text-gray-800">(</span>
                <span className="text-[#001080] font-semibold">dibutuhkan</span>{" "}
                <span className="text-gray-800">===</span>{" "}
                <span className="text-[#0000ff]">false</span>
                <span className="text-gray-800">)</span>{" "}
                <span className="text-gray-800">{"{"}</span>
              </span>
              <span className="code-line block pl-3">
                <span className="text-[#001080] font-semibold">g</span>
                <span className="text-gray-800">.</span>
                <span className="text-[#001080] font-semibold">menyerah</span>
                <span className="text-gray-800">();</span>
              </span>
              <span className="code-line block pl-2">
                <span className="text-gray-800">{"}"}</span>
              </span>

              <span className="code-line block mt-2 text-[#008000]">
                <span className="text-[#0000ff]">//</span> &quot;Aku tidak bisa bertahan&quot;
              </span>

              <span
                ref={cursor2Ref}
                className="inline-block w-[2px] h-3 sm:h-4 bg-[#0000ff] align-middle opacity-0 ml-[2px] animate-pulse"
              />
            </code>
          </pre>
        </div>
      </div>

      {/* Floating particles - minimal di mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gray-400/20 floating-particle"
            style={{
              top: `${15 + i * 20}%`,
              left: i % 2 === 0 ? '3%' : '97%',
            }}
          />
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-8px) translateX(2px); opacity: 0.4; }
        }
        
        .floating-particle {
          animation: floatParticle 4s ease-in-out infinite;
        }
        
        .floating-particle:nth-child(1) { animation-delay: 0s; }
        .floating-particle:nth-child(2) { animation-delay: 0.5s; }
        .floating-particle:nth-child(3) { animation-delay: 1s; }
        .floating-particle:nth-child(4) { animation-delay: 1.5s; }
      `}</style>
    </section>
  );
};

export default Window;