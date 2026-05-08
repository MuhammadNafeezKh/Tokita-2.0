"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import timelineData from "../public/data/timeline.json";

type TimelineItem = {
  date: string;
  title: string;
  role?: string;
  description: string;
  details?: string[];
};

const ExperienceTimeline = () => {
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);

  // =============================
  // SCROLL ANIMATION (MASUK SAAT TERLIHAT)
  // =============================
  useEffect(() => {
    setVisible(new Array(timelineData.length).fill(false));

    const observers: IntersectionObserver[] = [];

    itemsRef.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const newArr = [...prev];
              newArr[index] = true;
              return newArr;
            });

            gsap.fromTo(
              el,
              {
                opacity: 0,
                y: 80,
                scale: 0.9,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power3.out",
              }
            );
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="journey"
      className="relative min-h-screen bg-[#1A1A1A] py-32 overflow-hidden"
    >
      {/* Background tetap */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Pendidikan & Perjalanan
          </h2>
        </div>

        {/* LINE TENGAH */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-[#4A6B7F]/30" />

        {/* =============================
            TIMELINE
        ============================= */}
        <ul className="flex flex-col gap-32">
          {(timelineData as TimelineItem[]).map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <li
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`relative flex w-full ${
                  isLeft ? "justify-start" : "justify-end"
                }`}
              >
                {/* DOT */}
                <span className="absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-[#6B9FBF] border-4 border-[#1A1A1A]" />

                {/* CARD */}
                <div
                  className={`w-[320px] md:w-[420px] ${
                    isLeft ? "mr-auto" : "ml-auto"
                  }`}
                >
                  <div
                    className="bg-[#232323] border-2 border-[#4A6B7F] 
                    shadow-[8px_8px_0px_#1E2C36] 
                    rounded-2xl p-6
                    transition-all duration-300"
                  >
                    <time className="inline-block px-3 py-1 text-xs font-bold 
                      rounded-full bg-[#2C2C2C] border border-[#6B9FBF] text-[#6B9FBF] mb-3">
                      {item.date}
                    </time>

                    <h3 className="text-lg font-bold text-white mb-1">
                      {item.title}
                    </h3>

                    {item.role && (
                      <p className="text-xs text-[#8FC5F0] mb-3">
                        {item.role}
                      </p>
                    )}

                    <p className="text-sm text-[#F0F0F0] mb-4">
                      {item.description}
                    </p>

                    {item.details && (
                      <ul className="space-y-2">
                        {item.details.map((detail, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-[#C0C0C0]"
                          >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6B9FBF]" />
                            <span>{detail}</span>
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
    </section>
  );
};

export default ExperienceTimeline;