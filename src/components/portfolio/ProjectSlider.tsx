"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Code2, ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types";
import { ProjectShowcaseModal } from "./ProjectShowcaseModal";
import { cn } from "@/lib/utils";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!projects || projects.length === 0) return null;

  const currentProject = projects[activeIndex] || projects[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {badge && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
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

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1))}
            aria-label="Previous Project"
            className="p-3.5 rounded-full bg-zinc-900/80 border border-white/15 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-zinc-800 transition-all shadow-lg backdrop-blur-md active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0))}
            aria-label="Next Project"
            className="p-3.5 rounded-full bg-zinc-900/80 border border-white/15 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-zinc-800 transition-all shadow-lg backdrop-blur-md active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── Floating Overlapping Cards Stage ── */}
      <div className="relative w-full h-96 sm:h-145 lg:h-180 flex items-center justify-center overflow-hidden">
        {projects.map((project, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            // Only render up to 2 items to the left & right for visual clarity
            if (absOffset > 2) return null;

            return (
              <motion.div
                key={project.id}
                initial={false}
                animate={{
                  x: offset * 220,
                  y: isCenter ? 0 : absOffset * 18,
                  scale: isCenter ? 1 : 0.82 - absOffset * 0.08,
                  zIndex: 30 - absOffset * 10,
                  rotate: offset * 3,
                  opacity: 1 - absOffset * 0.3,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                onClick={() => {
                  if (isCenter) {
                    setSelectedProject(project);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={cn(
                  "absolute w-[92vw] max-w-[92vw] sm:w-160 lg:w-225 h-72 sm:h-135 overflow-hidden cursor-pointer select-none transition-all duration-300 group flex items-center justify-center"
                )}
              >
                {/* Pure Floating Image without container or frame */}
                <div className="relative w-full h-full">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 1000px"
                      className="object-contain object-top transition-all duration-300 pointer-events-none drop-shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Code2 size={48} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Dedicated Unblocked Floating CTA Button & Slide Indicators */}
      <div className="mt-4 flex flex-col items-center justify-center gap-4 z-30 relative">
        {currentProject && (
          <button
            onClick={() => setSelectedProject(currentProject)}
            className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xl shadow-amber-500/40 active:scale-95 border border-amber-300/40"
          >
            EXPLORE DETAILS <Sparkles size={14} />
          </button>
        )}

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-8 bg-amber-400"
                  : "w-2 bg-zinc-700 hover:bg-zinc-500"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Full Screen Showcase Modal */}
      <ProjectShowcaseModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
