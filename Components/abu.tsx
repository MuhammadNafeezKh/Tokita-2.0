"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutModern = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-16 md:py-20 px-6 md:px-16 bg-[#1A1A1A] overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 30% 50%, rgba(74, 107, 127, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 70% 50%, rgba(176, 108, 108, 0.08) 0%, transparent 50%)
        `
      }}
    >
      {/* Decorative lines - OMORI style */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6B9FBF]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B06C6C]/30 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <p
          ref={textRef}
          className="text-base md:text-lg text-[#E0E0E0] leading-relaxed text-center drop-shadow-[1px_1px_0px_#000000]"
        >
          Halo! Saya <span className="text-[#6B9FBF] font-semibold">Muhammad Dzurunnafis khairuddin(Nafis)</span>, seorang 
          {' '}<span className="text-[#6B9FBF] font-semibold">Front End Developer</span> dan 
          {' '}<span className="text-[#B06C6C] font-semibold">UI/UX Design Enthusiast</span> yang 
          tinggal di <span className="text-[#F0F0F0]">Indonesia</span>. Saya memiliki passion dalam 
          membangun antarmuka yang tidak hanya fungsional, tetapi juga estetis dan nyaman digunakan.
          Saat ini saya mendalami <span className="text-[#6B9FBF]">Flutter</span>,{' '}
          <span className="text-[#6B9FBF]">Next.js</span>, dan berbagai teknologi front-end modern 
          lainnya. Saya Buat porto dini saja. Di luar coding, saya menikmati eksplorasi bahasa asing, bermain game, 
          dan mendengarkan musik.
        </p>
      </div>
    </section>
  );
};

export default AboutModern;