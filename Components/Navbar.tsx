"use client";

import { useState, useEffect, useRef } from "react";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { Menu, X, BookOpen, FolderLock } from "lucide-react"; // Tambah icon FolderLock untuk vibe arsip
import { gsap } from "gsap";

interface MenuItem {
  name: string;
  to: string;
  isPage?: boolean;
  href?: string;
  isHighlight?: boolean; // Properti baru untuk highlight
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Menu Items
  const menuItems: MenuItem[] = [
    { name: "Education", to: "education" },
    { name: "Skills", to: "skills" },
    { name: "Projects", to: "projects" },
    { name: "Contact", to: "contact" },
    // Highlighted Item
    { 
      name: "ARCHIVES", 
      to: "blog", 
      isPage: true, 
      href: "/blog", 
      isHighlight: true 
    },
  ];

  // Entrance animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }, [isOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none`}
    >
      {/* Container dengan pointer-events-auto agar bisa diklik */}
      <div className="mx-auto flex h-12 max-w-fit items-center justify-center gap-2 px-4 sm:px-6 mt-3 rounded-full shadow-md border border-gray-200 bg-white/90 backdrop-blur-md pointer-events-auto">
        
        {/* Logo */}
        <ScrollLink
          to="hero"
          smooth
          duration={500}
          className="flex items-center gap-1 text-lg text-gray-700 cursor-pointer shrink-0 hover:text-sky-500 transition-colors px-2"
        >
          <svg
            className="size-5 text-sky-500"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 9l3 3l-3 3" />
            <path d="M13 15l3 0" />
            <path d="M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -12" />
          </svg>
          <span className="font-semibold">Nafeez</span>
        </ScrollLink>

        {/* Separator */}
        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <nav aria-label="Global">
            <ul className="flex items-center justify-center gap-1 text-sm">
              {menuItems.map((item) =>
                item.isPage ? (
                  <li key={item.to}>
                    <Link
                      href={item.href || "#"}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-medium
                        ${item.isHighlight 
                          ? "bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 hover:border-sky-300 hover:shadow-sm" 
                          : "text-gray-600 hover:text-sky-500 hover:bg-gray-50"
                        }
                      `}
                    >
                      {item.isHighlight ? (
                        <FolderLock size={14} className="text-sky-500" />
                      ) : (
                        item.name === "ARCHIVES" && <BookOpen size={14} className="text-sky-500" />
                      )}
                      {item.name}
                    </Link>
                  </li>
                ) : (
                  <li key={item.to}>
                    <ScrollLink
                      to={item.to}
                      smooth
                      duration={500}
                      spy
                      offset={-80}
                      activeClass="text-sky-500 font-medium"
                      className="cursor-pointer px-2 py-1.5 text-gray-600 transition hover:text-sky-500 rounded-lg hover:bg-gray-50"
                    >
                      {item.name}
                    </ScrollLink>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 bg-gray-300 mx-1"></div>

        {/* Avatar / Profile Trigger */}
        <div className="hidden md:flex items-center gap-3">
          <div className="shrink-0 cursor-pointer group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-sky-200 transition-all">
              N
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden rounded-full bg-gray-100 p-1.5 text-gray-600 transition hover:bg-gray-200"
        >
          <span className="sr-only">Toggle menu</span>
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl z-40 overflow-hidden"
        >
          <div className="flex flex-col space-y-1 px-4 py-4">
            {menuItems.map((item) =>
              item.isPage ? (
                <Link
                  key={item.to}
                  href={item.href || "#"}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium
                    ${item.isHighlight
                      ? "bg-sky-50 text-sky-600 border border-sky-100"
                      : "text-gray-700 hover:text-sky-500 hover:bg-gray-50"
                    }
                  `}
                >
                  {item.isHighlight ? (
                    <FolderLock size={18} className="text-sky-500" />
                  ) : (
                    item.name === "ARCHIVES" && <BookOpen size={18} className="text-sky-500" />
                  )}
                  {item.name}
                </Link>
              ) : (
                <ScrollLink
                  key={item.to}
                  to={item.to}
                  smooth
                  duration={500}
                  spy
                  offset={-80}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-sky-500 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {item.name}
                </ScrollLink>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;