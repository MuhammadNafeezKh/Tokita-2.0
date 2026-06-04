"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import timelineData from "../public/data/timeline.json";

gsap.registerPlugin(ScrollTrigger);

type TimelineItem = {
  date: string;
  title: string;
  role?: string;
  description: string;
  details?: string[];
  location?: string;
  type?: "education" | "work" | "certification";
};

const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // =============================
  // SCROLL ANIMATION
  // =============================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );

      // Timeline items animation
      itemsRef.current.forEach((el, index) => {
        if (!el) return;

        const isLeft = index % 2 === 0;
        
        gsap.fromTo(
          el,
          { opacity: 0, x: isLeft ? -50 : 50, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "work":
        return <Briefcase size={16} />;
      case "education":
        return <GraduationCap size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "work":
        return "text-[#6B9FBF] border-[#6B9FBF]/30";
      case "education":
        return "text-[#B06C6C] border-[#B06C6C]/30";
      default:
        return "text-gray-400 border-gray-500/30";
    }
  };

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-[#2A2A2A] overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B9FBF]/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ========== HEADER ========== */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B9FBF] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6B9FBF]" />
            </span>
            <span className="text-[11px] font-mono text-gray-400 tracking-wide">MY JOURNEY</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Education & Experience
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            A timeline of my learning journey and professional growth
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#6B9FBF] to-transparent mx-auto mt-5 rounded-full" />
        </div>

        {/* ========== TIMELINE CONTAINER ========== */}
        <div className="relative">
          {/* Vertical line - center */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#6B9FBF]/30 via-[#6B9FBF]/10 to-transparent" />

          {/* Timeline items */}
          <ul className="flex flex-col gap-16">
            {(timelineData as TimelineItem[]).map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <li
                  key={index}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  className={`relative flex w-full ${isLeft ? "justify-start" : "justify-end"}`}
                >
                  {/* Center dot */}
                  <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-[#6B9FBF] ring-4 ring-[#2D2D2D] ring-offset-0" />
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#6B9FBF] animate-ping opacity-40" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`w-[calc(100%-3rem)] sm:w-[380px] md:w-[420px] ${isLeft ? "mr-auto pr-8 sm:pr-0" : "ml-auto pl-8 sm:pl-0"}`}>
                    <div className="group bg-[#2D2D2D] border border-white/10 rounded-2xl p-5 hover:border-[#6B9FBF]/30 hover:shadow-xl transition-all duration-300">
                      {/* Date badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={12} className="text-[#6B9FBF]" />
                        <time className="text-[11px] font-mono text-gray-400 tracking-wide">
                          {item.date}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white tracking-tight mb-1">
                        {item.title}
                      </h3>

                      {/* Role */}
                      {item.role && (
                        <div className="flex items-center gap-1.5 mb-3">
                          {getTypeIcon(item.type)}
                          <p className="text-xs font-medium text-[#6B9FBF]">
                            {item.role}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Details list */}
                      {item.details && item.details.length > 0 && (
                        <ul className="space-y-2 pt-2 border-t border-white/5">
                          {item.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#6B9FBF] flex-shrink-0" />
                              <span className="text-xs text-gray-500 leading-relaxed">
                                {detail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* End of timeline indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2 text-[11px] text-gray-600">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-gray-700" />
            <span>CONTINUOUS GROWTH</span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-gray-700" />
          </div>
        </div>
      </div>

      {/* GARIS PEMISAH - OMORI style di bagian bawah */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0]"></div>
    </section>
  );
};

export default ExperienceTimeline;