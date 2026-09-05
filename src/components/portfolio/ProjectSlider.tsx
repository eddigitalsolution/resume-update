"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Code2, ArrowUpRight, Sparkles, Layers } from "lucide-react";
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
  theme?: "dark" | "light";
}

export function ProjectSlider({
  projects,
  title,
  subtitle,
  badge,
  theme = "dark",
}: ProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!projects || projects.length === 0) return null;

  const currentProject = projects[activeIndex] || projects[0];
  const isLight = theme === "light";
  const formattedIndex = String(activeIndex + 1).padStart(2, "0");
  const totalCount = String(projects.length).padStart(2, "0");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-8 select-none">
      {/* ── Swiss Editorial Header & Controls ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {badge && (
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border shadow-sm backdrop-blur-md",
                  isLight
                    ? "text-amber-600 bg-amber-500/15 border-amber-500/30"
                    : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                )}
              >
                {badge}
              </span>
            )}
            <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              {formattedIndex} / {totalCount}
            </span>
          </div>

          {title && (
            <h2
              className={cn(
                "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-tight",
                isLight ? "text-zinc-900" : "text-white"
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                "max-w-xl text-xs sm:text-sm font-medium tracking-wide leading-relaxed",
                isLight ? "text-zinc-600" : "text-zinc-400"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Swiss Style Minimalist Controls */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              3D PERSPECTIVE
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              PARALLAX ACTIVE
            </span>
          </div>
          <button
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1))}
            aria-label="Previous Project"
            className={cn(
              "p-4 rounded-2xl border transition-all shadow-xl backdrop-blur-md active:scale-95 group",
              isLight
                ? "bg-white/90 border-zinc-300 text-zinc-800 hover:text-black hover:bg-white hover:border-amber-500"
                : "bg-zinc-900/90 border-white/15 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-zinc-800"
            )}
          >
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0))}
            aria-label="Next Project"
            className={cn(
              "p-4 rounded-2xl border transition-all shadow-xl backdrop-blur-md active:scale-95 group",
              isLight
                ? "bg-white/90 border-zinc-300 text-zinc-800 hover:text-black hover:bg-white hover:border-amber-500"
                : "bg-zinc-900/90 border-white/15 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-zinc-800"
            )}
          >
            <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Asymmetrical 3D Image Stack Stage with Mouse Parallax ── */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-110 sm:h-160 lg:h-195 flex items-center justify-center overflow-hidden py-10"
        style={{ perspective: "1400px" }}
      >
        {/* Giant Watermark Swiss Index Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
          <span className="text-[20vw] font-black tracking-tighter text-white font-mono leading-none">
            {formattedIndex}
          </span>
        </div>

        {projects.map((project, idx) => {
          const offset = idx - activeIndex;
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;

          // Only render up to 2 items to the left & right for clean performance
          if (absOffset > 2) return null;

          const isLeft = offset < 0;
          
          // Asymmetrical 3D Stack Coordinates & Rotations
          const targetX = isCenter
            ? mousePos.x * 30
            : (isLeft ? -270 * absOffset : 270 * absOffset) + mousePos.x * (15 + absOffset * 10);
            
          const targetY = isCenter
            ? mousePos.y * 18
            : (isLeft ? 32 * absOffset : -28 * absOffset) + mousePos.y * (10 + absOffset * 8);

          const targetZ = isCenter ? 120 : -140 * absOffset;
          
          const targetRotateX = isCenter
            ? -mousePos.y * 22
            : (isLeft ? 8 : -8) - mousePos.y * 14;

          const targetRotateY = isCenter
            ? mousePos.x * 24
            : (isLeft ? 24 : -24) + mousePos.x * 16;

          const targetRotateZ = isCenter
            ? mousePos.x * -5
            : (isLeft ? -7 * absOffset : 8 * absOffset) + mousePos.x * 4;

          const targetScale = isCenter ? 1 : 0.86 - absOffset * 0.08;
          const targetOpacity = isCenter ? 1 : 0.85 - absOffset * 0.25;

          return (
            <motion.div
              key={project.id}
              initial={false}
              animate={{
                x: targetX,
                y: targetY,
                z: targetZ,
                rotateX: targetRotateX,
                rotateY: targetRotateY,
                rotateZ: targetRotateZ,
                scale: targetScale,
                opacity: targetOpacity,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
                mass: 0.8,
              }}
              style={{
                transformStyle: "preserve-3d",
                zIndex: 30 - absOffset * 10,
              }}
              onClick={() => {
                if (isCenter) {
                  setSelectedProject(project);
                } else {
                  setActiveIndex(idx);
                }
              }}
              className="absolute w-[88vw] max-w-[88vw] sm:w-160 lg:w-225 h-72 sm:h-125 lg:h-145 cursor-pointer rounded-3xl overflow-hidden group"
            >
              {/* Card Container Panel with Subtle Glass Shadow */}
              <div
                className={cn(
                  "relative w-full h-full rounded-3xl border shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-500 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6",
                  isCenter
                    ? "border-amber-500/40 bg-zinc-950/90 hover:border-amber-400/80 shadow-[0_30px_100px_rgba(245,158,11,0.2)]"
                    : "border-white/10 bg-zinc-950/70 hover:border-white/30"
                )}
              >
                {/* Floating Media Visual Stage */}
                <div className="relative w-full h-full overflow-hidden rounded-2xl bg-zinc-900/60">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 1000px"
                      className="object-contain object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-950 p-6">
                      <Code2 size={56} className="mb-2 opacity-40 text-amber-400" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                        SHOWCASE VISUAL
                      </span>
                    </div>
                  )}

                  {/* Gradient Depth Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                  {/* Top Badges overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                    {project.category ? (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        {project.category}
                      </span>
                    ) : (
                      <div />
                    )}

                    {project.is_featured && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5">
                        <Sparkles size={11} /> SPOTLIGHT
                      </span>
                    )}
                  </div>

                  {/* Bottom Info Bar inside Card */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
                    <div className="max-w-[80%] space-y-1">
                      <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-xs text-zinc-300 line-clamp-1 font-medium">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-full bg-amber-500 text-black shadow-lg transform group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Swiss Footer Controls & Indicators ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-30 relative pt-2 border-t border-white/5">
        {currentProject && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProject(currentProject)}
              className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.35)] active:scale-95 border border-amber-300/50"
            >
              EXPLORE EDITORIAL DETAILS <ArrowUpRight size={16} />
            </button>
          </div>
        )}

        {/* Minimalist Slide Indicator Bar */}
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === activeIndex
                  ? "w-10 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  : "w-2.5 bg-zinc-800 hover:bg-zinc-600"
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
