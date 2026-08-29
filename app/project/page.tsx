"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, X, Github, ExternalLink, Code2, Layers } from "lucide-react";
import Image from "next/image";
import projectsData from "../../public/data/project.json";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  tags: string[];
  status: "live" | "wip" | "archive";
  featured: boolean;
  image: string;
  github: string;
  demo: string;
  year: number;
}

// ============================================================================
// DIALOG COMPONENT (WITH ANIMATION)
// ============================================================================
const ProjectDialog = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    // Complex Animation for Modal Entry
    const tl = gsap.timeline();
    
    // 1. Fade in Backdrop
    tl.fromTo(backdropRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    
    // 2. Slide Up & Scale Content
    if (modalRef.current) {
      tl.fromTo(modalRef.current, 
        { opacity: 0, scale: 0.95, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }, 
        "-=0.2" // Overlap with backdrop animation
      );
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
      tl.kill(); // Clean up timeline
    };
  }, [onClose]);

  // Animation for Closing (Optional but smooth)
  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    if (modalRef.current) {
      tl.to(modalRef.current, { opacity: 0, scale: 0.95, y: 10, duration: 0.2, ease: "power2.in" });
    }
    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-[#1a1a1a]/80 backdrop-blur-sm" 
        onClick={handleClose} 
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-3xl bg-[#2D2D2D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-[#252525]">
          <Image src={project.image} alt={project.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D] to-transparent md:hidden" />
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-[#6B9FBF]">{project.year}</span>
            <span className="w-px h-3 bg-white/10" />
            <span className={`text-[10px] uppercase font-bold tracking-wider ${
              project.status === 'live' ? 'text-emerald-400' : 'text-gray-400'
            }`}>
              {project.status}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
          
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            {project.longDesc || project.shortDesc}
          </p>

          <div className="mb-8">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Code2 size={12} /> Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded text-xs text-gray-300 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            <a href={project.demo} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#6B9FBF] hover:bg-[#5a8fae] text-white text-sm font-medium rounded-lg transition-colors">
              <ExternalLink size={16} /> Live Demo
            </a>
            <a href={project.github} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-colors">
              <Github size={16} /> Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/data/project.json");
        const data = await res.json();
        setProjects(data);
      } catch {
        setProjects(projectsData as Project[]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // GSAP Animation for List Items
  useEffect(() => {
    if (loading || !listRef.current) return;
    
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".project-row") as HTMLElement[];
      
      gsap.fromTo(items, 
        { opacity: 0, x: -20 }, 
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.1, // Diperlambat agar terlihat jelas satu per satu
          ease: "power3.out", 
          scrollTrigger: { 
            trigger: listRef.current, 
            start: "top 80%", // Trigger lebih awal sedikit
            toggleActions: "play none none reverse" 
          } 
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, projects]); // Depend on projects so it re-runs when data loads

  if (loading) return <div className="h-64 flex items-center justify-center text-gray-500 font-mono text-sm">Loading Archive...</div>;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-16 px-4 md:px-8 bg-[#2A2A2A]"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER COMPACT */}
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-[#6B9FBF]">
              <Layers size={14} />
              <span className="text-[10px] font-mono tracking-widest uppercase">Archive</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Selected Works</h2>
          </div>
          <span className="text-xs text-gray-500 font-mono">{projects.length} PROJECTS</span>
        </div>

        {/* COMPACT LIST VIEW */}
        <div ref={listRef} className="projects-list space-y-1">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="project-row group flex items-center justify-between py-4 px-3 -mx-3 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-all duration-200 border border-transparent hover:border-white/5"
            >
              
              {/* Left: Info */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-medium text-white group-hover:text-[#6B9FBF] transition-colors truncate">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B9FBF]" title="Featured" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate max-w-md">
                  {project.shortDesc}
                </p>
              </div>

              {/* Right: Meta & Arrow */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="hidden sm:flex gap-2">
                  {project.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-gray-600">{project.year}</span>
                  {/* Arrow with Hover Animation via CSS/GSAP */}
                  <ArrowRight 
                    size={16} 
                    className="text-gray-600 group-hover:text-[#6B9FBF] group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Dialog Modal */}
      {selectedProject && (
        <ProjectDialog 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* OMORI Divider */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8FC5F0] via-[#F08B8B] to-[#8FC5F0] opacity-80"></div>
    </section>
  );
};

export default Projects;