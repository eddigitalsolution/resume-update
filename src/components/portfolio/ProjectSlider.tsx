"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code2, ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types";
import { ProjectShowcaseModal } from "./ProjectShowcaseModal";

interface ProjectSliderProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
  badge?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function ProjectSlider({
  projects,
  title,
  subtitle,
  badge,
}: ProjectSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {badge && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                {badge}
              </span>
            </div>
          )}
          {title && (
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-zinc-400 max-w-xl text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous Project"
            className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Next Project"
            className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Track Wrapper */}
      <div className="relative">
        {/* Left & Right Edge Fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, rgb(0,0,0) 0%, transparent 100%)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, rgb(0,0,0) 0%, transparent 100%)" }}
        />

        {/* Horizontal Scroll Container */}
        <div
          ref={sliderRef}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1.5rem",
            overflowX: "scroll",
            overflowY: "visible",
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",      /* Firefox */
            msOverflowStyle: "none",     /* IE/Edge */
          }}
        >
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              whileHover={{ y: -10, scale: 1.03 }}
              style={{
                minWidth: "320px",
                width: "360px",
                flexShrink: 0,
                scrollSnapAlign: "start",
                cursor: "pointer",
                perspective: "800px",
              }}
              className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-indigo-500/50 transition-colors duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.18)] flex flex-col justify-between"
            >
              {/* Media Area */}
              <div className="relative overflow-hidden bg-zinc-900" style={{ aspectRatio: "16/9" }}>
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    priority={idx < 2}
                    sizes="360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800 bg-zinc-950">
                    <Code2 size={40} />
                  </div>
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgb(9,9,11) 0%, rgba(9,9,11,0.15) 60%, transparent 100%)", opacity: 0.85 }}
                />

                {/* Category Label */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/70 text-zinc-300 border border-white/10 backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                {/* Expand Arrow */}
                <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <ArrowUpRight size={13} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                    Showcase <Sparkles size={10} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hide WebKit scrollbar via inline style trick */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
      </div>

      {/* Showcase Modal */}
      <ProjectShowcaseModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
