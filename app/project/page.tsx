"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Github, Star, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import Image from "next/image";

// ✅ Import JSON - path sesuai request
import projectsData from "../../public/data/project.json";

gsap.registerPlugin(ScrollTrigger);

// ✅ Tipe data untuk project
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

// ✅ Modal Component - OMORI style
const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  const statusConfig = {
    live: { label: "🟢 Live", color: "text-green-400" },
    wip: { label: "🟡 WIP", color: "text-amber-400" },
    archive: { label: "⚪ Archive", color: "text-gray-400" },
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="relative bg-[#232323] border-2 border-[#4A6B7F] shadow-[8px_8px_0px_#1E2C36] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-60">
          <Image src={project.image} alt={project.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#2C2C2C] border border-[#4A6B7F] rounded-full hover:bg-[#3A3A3A] transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={20} className="text-white" />
          </button>
          
          <div className="absolute bottom-4 left-5 right-5 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold ${statusConfig[project.status].color} drop-shadow-[1px_1px_0px_#000000]`}>
                {statusConfig[project.status].label}
              </span>
              {project.featured && (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 drop-shadow-[1px_1px_0px_#000000]">
                  <Star size={10} fill="currentColor" /> Featured
                </span>
              )}
              <span className="text-xs text-white/90 ml-auto drop-shadow-[1px_1px_0px_#000000]">{project.year}</span>
            </div>
            <h3 id="modal-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0px_#000000]">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-[#F0F0F0] mb-6 leading-relaxed drop-shadow-[1px_1px_0px_#000000]">{project.longDesc}</p>

          {/* Tech Stack */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3 drop-shadow-[2px_2px_0px_#000000]">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#2C2C2C] border border-[#4A6B7F] text-white text-xs font-medium rounded-lg shadow-[2px_2px_0px_#1E2C36]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions - OMORI style */}
          <div className="flex gap-3 pt-4 border-t border-[#4A6B7F]/30">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2C2C2C] border-2 border-[#4A6B7F] text-white font-semibold rounded-xl hover:bg-[#3A3A3A] hover:border-[#6B9FBF] transition-colors shadow-[4px_4px_0px_#1E2C36] hover:shadow-[6px_6px_0px_#1E2C36] hover:translate-y-[-2px]"
            >
              <Github size={18} className="text-[#8FC5F0]" />
              View Code
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2C2C2C] border-2 border-[#B06C6C] text-white font-semibold rounded-xl hover:bg-[#3A3A3A] hover:border-[#F08B8B] transition-colors shadow-[4px_4px_0px_#5C3A3A] hover:shadow-[6px_6px_0px_#5C3A3A] hover:translate-y-[-2px]"
            >
              <ExternalLink size={18} className="text-[#F08B8B]" />
              Live Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "live" | "featured">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const ITEMS_PER_PAGE = 3;

  // Load projects dari JSON
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/data/project.json");
        const data: Project[] = await response.json();
        setProjects(data);
      } catch {
        setProjects(projectsData as Project[]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );

      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", scrollTrigger: { trigger: ".projects-grid", start: "top 85%" } }
      );

      // Animasi saat ganti halaman
      gsap.fromTo(
        ".project-card",
        { opacity: 0.7, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, currentPage, filter]);

  // Filter + Pagination logic
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    if (filter === "featured") result = result.filter(p => p.featured);
    if (filter === "live") result = result.filter(p => p.status === "live");
    return result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    });
  }, [projects, filter]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.querySelector(".projects-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const statusConfig = {
    live: { label: "Live", color: "bg-[#1E2C36] text-[#8FC5F0] border-[#8FC5F0]" },
    wip: { label: "WIP", color: "bg-[#2C2C2C] text-[#F08B8B] border-[#F08B8B]" },
    archive: { label: "Archive", color: "bg-[#2C2C2C] text-gray-400 border-gray-600" },
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-[#1A1A1A]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-3 text-[#8FC5F0]" size={32} />
          <p className="text-white text-sm drop-shadow-[1px_1px_0px_#000000]">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-6 md:px-16 bg-[#1A1A1A] overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(74, 107, 127, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 76, 76, 0.08) 0%, transparent 40%),
          repeating-linear-gradient(45deg, rgba(44, 44, 44, 0.15) 0px, rgba(44, 44, 44, 0.15) 2px, transparent 2px, transparent 6px)
        `
      }}
    >
      {/* Overlay gelap lembut */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header - OMORI style */}
        <div className="text-center mb-10">
          <h2 className="projects-title text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[4px_4px_0px_#000000]">
            Projects
          </h2>
          <p className="text-[#F0F0F0] text-sm mt-2 max-w-xl mx-auto drop-shadow-[2px_2px_0px_#000000]">
            Selected work showcasing front-end development and problem-solving.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#6B9FBF]/50 via-[#B06C6C]/50 to-[#6B9FBF]/50 mx-auto mt-4 rounded-full" />
        </div>

        {/* Filters - OMORI style */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { key: "all", label: "All" },
            { key: "featured", label: "⭐ Featured" },
            { key: "live", label: "🚀 Live" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-[2px_2px_0px_#1E2C36] ${
                filter === f.key
                  ? "bg-[#2C2C2C] border-2 border-[#6B9FBF] text-white"
                  : "bg-[#232323] border-2 border-[#3A3A3A] text-[#F0F0F0] hover:bg-[#2C2C2C] hover:border-[#4A6B7F]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {paginatedProjects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <article
                key={project.id}
                className="project-card group bg-[#232323]/90 border border-[#3A3A3A] shadow-[6px_6px_0px_#1E2C36] rounded-2xl overflow-hidden hover:shadow-[8px_8px_0px_#1E2C36] hover:translate-y-[-2px] transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Hover overlay - OMORI style */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#2C2C2C] border border-[#4A6B7F] py-2.5 rounded-xl text-white text-sm font-semibold hover:bg-[#3A3A3A] transition-colors shadow-[2px_2px_0px_#1E2C36]"
                      >
                        <Github size={16} className="text-[#8FC5F0]" />
                        Code
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#2C2C2C] border border-[#B06C6C] py-2.5 rounded-xl text-white text-sm font-semibold hover:bg-[#3A3A3A] transition-colors shadow-[2px_2px_0px_#5C3A3A]"
                      >
                        <ExternalLink size={16} className="text-[#F08B8B]" />
                        Demo
                      </a>
                    </div>
                  </div>

                  {/* Badges - OMORI style */}
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {project.featured && (
                      <span className="px-2.5 py-1 bg-[#2C2C2C] border border-amber-500 text-amber-400 text-xs font-bold rounded-full flex items-center gap-1 shadow-[2px_2px_0px_#000000]">
                        <Star size={10} fill="currentColor" />
                      </span>
                    )}
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${status.color} bg-[#232323] shadow-[2px_2px_0px_#000000]`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white text-base leading-tight drop-shadow-[2px_2px_0px_#000000]">
                      {project.title}
                    </h3>
                    <span className="text-xs text-[#C0C0C0] font-medium drop-shadow-[1px_1px_0px_#000000]">{project.year}</span>
                  </div>
                  
                  <p className="text-[#F0F0F0] text-sm mb-4 line-clamp-2 min-h-[40px] drop-shadow-[1px_1px_0px_#000000]">
                    {project.shortDesc}
                  </p>
                  
                  {/* Tags - OMORI style */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-[#2C2C2C] border border-[#4A6B7F] text-white text-xs font-medium rounded-lg shadow-[2px_2px_0px_#1E2C36]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Details - OMORI style */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-[#2C2C2C] border border-[#4A6B7F] rounded-xl hover:bg-[#3A3A3A] hover:border-[#6B9FBF] transition-colors shadow-[2px_2px_0px_#1E2C36]"
                  >
                    View details
                    <ChevronRight size={14} className="text-[#8FC5F0]" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination Controls - OMORI style */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-[#232323] border border-[#3A3A3A] text-white hover:bg-[#2C2C2C] hover:border-[#4A6B7F] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0px_#1E2C36]"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all shadow-[2px_2px_0px_#1E2C36] ${
                    currentPage === page
                      ? "bg-[#2C2C2C] border-2 border-[#6B9FBF] text-white"
                      : "bg-[#232323] border border-[#3A3A3A] text-[#F0F0F0] hover:bg-[#2C2C2C] hover:border-[#4A6B7F]"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-[#232323] border border-[#3A3A3A] text-white hover:bg-[#2C2C2C] hover:border-[#4A6B7F] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0px_#1E2C36]"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Page indicator - OMORI style */}
        {totalPages > 1 && (
          <p className="text-center text-[#C0C0C0] text-xs mt-4 drop-shadow-[1px_1px_0px_#000000]">
            Page {currentPage} of {totalPages} • {filteredProjects.length} projects
          </p>
        )}

        {/* Empty state - OMORI style */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#F0F0F0]/80 text-sm drop-shadow-[1px_1px_0px_#000000]">No projects match this filter.</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-4 text-white text-sm font-semibold hover:text-[#8FC5F0] transition-colors drop-shadow-[2px_2px_0px_#000000]"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      {/* Garis pemisah bawah - OMORI style */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9FBF]/30 via-[#B06C6C]/30 to-[#6B9FBF]/30"></div>

      {/* Utilities CSS */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Projects;