"use client";

import React, { useState } from 'react';
import { 
  Mail, 
  Github, 
  Instagram, 
  Linkedin, 
  Copy, 
  Check, 
  ArrowUpRight, 
  MessageCircle,
  QrCode,
  ExternalLink
} from 'lucide-react';

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  
  // Link Tree yang mengarah ke GitHub
  const embedUrl = "https://tree.icqr.com/s/MDNodHRwczovL2dpdGh1Yi5jb20vVG9raXRha3Vu";

  // Handle copy email
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("nafismuhammad277@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section id="contact" className="bg-[#2A2A2A] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Bagian Kiri: Kontak & Info */}
          <div className="space-y-6 md:space-y-8 order-2 md:order-1">
            <div>
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#6B9FBF]/10 text-[#6B9FBF] text-xs font-bold uppercase tracking-wider mb-4 border border-[#6B9FBF]/20">
                <Mail size={12} />
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4 md:mb-6">
                Let's Start a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B9FBF] to-emerald-400">
                  Conversation
                </span>
              </h2>
              
              <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6 md:mb-8">
                Terbuka untuk kolaborasi proyek, freelance, atau sekadar diskusi teknologi. Jangan ragu untuk menghubungi saya melalui kanal di bawah ini.
              </p>

              {/* Email Box */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="break-all">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Primary Email</p>
                  <p className="text-sm md:text-base font-medium text-white font-mono">
                    nafismuhammad277@gmail.com
                  </p>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6B9FBF] hover:bg-[#5a8fae] text-white text-xs font-bold rounded-lg transition-all active:scale-95 w-full sm:w-auto"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Address"}
                </button>
              </div>

              {/* Social Links List */}
              <div className="space-y-3">
                {[
                  { icon: Github, label: "GitHub", value: "@Tokitakun", url: "https://github.com/Tokitakun" },
                  { icon: Linkedin, label: "LinkedIn", value: "Muhammad Nafis", url: "https://www.linkedin.com/in/muhammad-dzurunnafis-khairuddin/" },
                  { icon: Instagram, label: "Instagram", value: "@_nafietzsche", url: "https://www.instagram.com/_nafietzsche/" },
                  { icon: MessageCircle, label: "WhatsApp", value: "+62 856-1470-816", url: "https://wa.me/628561470816" },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-md bg-white/5 text-gray-300 group-hover:text-[#6B9FBF] group-hover:bg-[#6B9FBF]/10 transition-colors">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-[#6B9FBF] transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">{item.value}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Iframe Window (Digital Identity) */}
          {/* Hidden on mobile for performance, shown on md+ */}
          <div className="relative order-1 md:order-2 hidden md:block">
            {/* Decorative Blur Behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#6B9FBF] to-emerald-500 rounded-2xl opacity-20 blur-2xl -z-10"></div>

            <div className="relative bg-[#1a1a1a] rounded-2xl p-2 shadow-2xl ring-1 ring-white/10 overflow-hidden">
              
              {/* Browser Header Mini */}
              <div className="bg-[#252525] px-4 py-2.5 flex items-center justify-between rounded-t-xl border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-[10px] text-gray-400 font-mono bg-black/30 px-3 py-1 rounded border border-white/5 flex items-center gap-2">
                  <QrCode size={10} />
                  github.com/Tokitakun
                </div>
                <div className="w-8"></div>
              </div>

              {/* Iframe Area with Scaling */}
              <div className="relative w-full h-[400px] lg:h-[500px] bg-[#2A2A2A] rounded-b-xl overflow-hidden flex items-start justify-center">
                <div 
                  className="origin-top transition-transform duration-300"
                  style={{ 
                    width: '1280px', 
                    height: '800px', 
                    transform: 'scale(0.6)' 
                  }}
                >
                  <iframe 
                    src={embedUrl}
                    title="Nafis Digital Tree Desktop"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Alternative: Simple Card with Link */}
          <div className="block md:hidden order-1">
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-[#6B9FBF]/20 rounded-full flex items-center justify-center mx-auto text-[#6B9FBF]">
                  <QrCode size={24} />
                </div>
                <h3 className="text-white font-bold">Digital Portfolio</h3>
                <p className="text-sm text-gray-400">
                  Lihat portofolio lengkap dan koneksi GitHub saya melalui tautan di bawah ini.
                </p>
                <a 
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                >
                  Open Portfolio Tree
                  <ExternalLink size={16} />
                </a>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;