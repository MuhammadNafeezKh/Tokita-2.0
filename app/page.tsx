"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./hero/page";
import Navbar from "../Components/Navbar";
import About from "../Components/abu";
import Skills from "@/Components/skills";
import Projects from "@/app/project/page";
import EducationTimeline from "@/Components/timeline";
import ContactSection from "@/app/contact/page";
import CustomCursor from "@/Components/cursor"
import Footer from "@/Components/footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
    if (heroRef.current) {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CustomCursor />
      <Navbar />  {/* ← PINDAHKAN KE SINI, di atas hero */}
      <div id="hero" ref={heroRef}><Hero /></div>
      <About/>
      <div id="education"><EducationTimeline /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
      <div id="contact"><ContactSection /></div>
      <Footer />
    </div>
  );
}