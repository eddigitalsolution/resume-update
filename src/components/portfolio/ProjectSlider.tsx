"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!projects || projects.length === 0) return null;

  const currentProject = projects[activeIndex] || projects[0];
  const isLight = theme === "light";
  const formattedIndex = String(activeIndex + 1).padStart(2, "0");
  const totalCount = String(projects.length).padStart(2, "0");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || isMobile) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4 sm:space-y-8 select-none">
      {/* ── Swiss Editorial Header & Controls ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 relative z-20">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-3">
            {badge && (
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full border shadow-sm backdrop-blur-md",
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
                "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-tight",
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

        {/* Swiss Style Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              3D PERSPECTIVE
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              PARALLAX ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1))}
              aria-label="Previous Project"
              className={cn(
                "p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all shadow-xl backdrop-blur-md active:scale-95 group",
                isLight
                  ? "bg-white/90 border-zinc-300 text-zinc-800 hover:text-black hover:bg-white hover:border-amber-500"
                  : "bg-zinc-900/90 border-white/15 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-zinc-800"
              )}
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0))}
              aria-label="Next Project"
              className={cn(
                "p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all shadow-xl backdrop-blur-md active:scale-95 group",
                isLight
                  ? "bg-white/90 border-zinc-300 text-zinc-800 hover:text-black hover:bg-white hover:border-amber-500"
                  : "bg-zinc-900/90 border-white/15 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-zinc-800"
              )}
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Asymmetrical 3D Image Stack Stage with Responsive Parallax ── */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-56 sm:h-135 lg:h-175 flex items-center justify-center overflow-hidden py-2 sm:py-8"
        style={{ perspective: isMobile ? "800px" : "1400px" }}
      >
        {/* Giant Watermark Swiss Index Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
          <span className="text-[25vw] sm:text-[20vw] font-black tracking-tighter text-white font-mono leading-none">
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
          
          // Asymmetrical 3D Stack Coordinates & Rotations (Responsive for Mobile)
          const stepX = isMobile ? 90 : 270;
          const stepY = isMobile ? 12 : 30;

          const targetX = isCenter
            ? mousePos.x * (isMobile ? 10 : 30)
            : (isLeft ? -stepX * absOffset : stepX * absOffset) + mousePos.x * (isMobile ? 5 : 15);
            
          const targetY = isCenter
            ? mousePos.y * (isMobile ? 6 : 18)
            : (isLeft ? stepY * absOffset : -stepY * absOffset) + mousePos.y * (isMobile ? 4 : 10);

          const targetZ = isCenter ? (isMobile ? 50 : 120) : (isMobile ? -80 * absOffset : -140 * absOffset);
          
          const targetRotateX = isCenter
            ? -mousePos.y * (isMobile ? 10 : 22)
            : (isLeft ? 6 : -6) - mousePos.y * (isMobile ? 6 : 14);

          const targetRotateY = isCenter
            ? mousePos.x * (isMobile ? 12 : 24)
            : (isLeft ? 18 : -18) + mousePos.x * (isMobile ? 8 : 16);

          const targetRotateZ = isCenter
            ? mousePos.x * -4
            : (isLeft ? -5 * absOffset : 6 * absOffset);

          const targetScale = isCenter ? 1 : (isMobile ? 0.88 - absOffset * 0.06 : 0.86 - absOffset * 0.08);
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
              className="absolute w-[88vw] max-w-[88vw] sm:w-160 lg:w-225 h-48 sm:h-125 lg:h-145 cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden group"
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

      {/* ── Swiss Footer Controls & Indicators ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 z-30 relative pt-2 border-t border-white/5">
        {currentProject && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={() => setSelectedProject(currentProject)}
              className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.35)] active:scale-95 border border-amber-300/50"
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
                "h-1.5 sm:h-2 rounded-full transition-all duration-500",
                i === activeIndex
                  ? "w-8 sm:w-10 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  : "w-2 sm:w-2.5 bg-zinc-800 hover:bg-zinc-600"
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
