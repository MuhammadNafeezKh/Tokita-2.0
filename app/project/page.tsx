"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Github, Star, ChevronLeft, ChevronRight, X, Loader2, FolderGit2 } from "lucide-react";
import Image from "next/image";

// ✅ Import JSON
import projectsData from "../../public/data/project.json";

gsap.registerPlugin(ScrollTrigger);

// ✅ Tipe data
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

// ✅ Status configuration
const STATUS_CONFIG = {
  live: { label: "LIVE", color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" },
  wip: { label: "WIP", color: "text-amber-400 border-amber-500/50 bg-amber-500/10" },
  archive: { label: "ARCHIVE", color: "text-gray-400 border-gray-500/50 bg-gray-500/10" },
} as const;

// ============================================================================
// MODAL COMPONENT
// ============================================================================
const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    if (modalRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.96, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative bg-[#1E1E1E] border border-[#3A3A3A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 bg-gradient-to-b from-transparent to-[#1E1E1E]">
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 z-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[project.status].color}`}>
                {STATUS_CONFIG[project.status].label}
              </span>
              {project.featured && (
                <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Featured
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{project.year}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{project.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[55vh] space-y-5">
          <p className="text-gray-300 leading-relaxed text-sm">{project.longDesc}</p>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#2A2A2A] border border-[#3A3A3A] text-gray-300 text-xs font-mono rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm font-medium rounded-xl hover:bg-[#333] hover:border-[#4A6B7F] transition-all"
            >
              <Github size={16} /> Repository
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm font-medium rounded-xl hover:bg-[#333] hover:border-[#B06C6C] transition-all"
            >
              <ExternalLink size={16} /> Live Demo
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
  const gridRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured" | "live">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const ITEMS_PER_PAGE = 3;

  // Load data
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

  // Filter + sort
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
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Pagination handler
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [totalPages]);

  // GSAP Animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".projects-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(".project-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".projects-grid", start: "top 85%" } });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, currentPage, filter]);

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center bg-[#121212]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-3 text-[#6B9FBF]" size={28} />
          <p className="text-gray-400 text-sm">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-[#121212]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <FolderGit2 size={14} className="text-[#6B9FBF]" />
            <span className="text-xs font-medium text-gray-300 tracking-wide">PORTFOLIO</span>
          </div>
          <h2 className="projects-title text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            A collection of my best work in web development
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#6B9FBF] to-transparent mx-auto mt-5 rounded-full" />
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { key: "all", label: "All Projects" },
            { key: "featured", label: "⭐ Featured" },
            { key: "live", label: "🔗 Live Only" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? "bg-white/10 border border-white/20 text-white"
                  : "bg-transparent border border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((project) => {
            const status = STATUS_CONFIG[project.status];
            return (
              <article
                key={project.id}
                className="project-card group bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#3A3A3A] hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#0D0D0D]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg text-white text-xs font-medium hover:bg-black/90 transition-colors"
                      >
                        <Github size={12} /> Code
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg text-white text-xs font-medium hover:bg-black/90 transition-colors"
                      >
                        <ExternalLink size={12} /> Demo
                      </a>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.featured && (
                      <span className="px-2 py-0.5 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full backdrop-blur-sm border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-base tracking-tight">{project.title}</h3>
                    <span className="text-[11px] text-gray-500 font-mono">{project.year}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.shortDesc}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 text-gray-300 text-[10px] font-mono rounded-md">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-500 text-[10px]">+{project.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Details Button */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-300 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                  >
                    View Details
                    <ChevronRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 mt-10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-white/10 border border-white/20 text-white"
                      : "bg-transparent border border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length} projects
            </p>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No projects found for this filter.</p>
            <button onClick={() => setFilter("all")} className="mt-3 text-sm text-[#6B9FBF] hover:text-white transition-colors">
              View all projects →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
};

export default Projects;