"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch, Code2, ArrowRight, Layers, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";

interface ProjectShowcaseModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectShowcaseModal({ project, onClose }: ProjectShowcaseModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-hidden">
        {/* Full-screen Immersive Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        >
          {project.image_url && (
            <div className="absolute inset-0 opacity-20 pointer-events-none filter blur-3xl scale-110">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-black/60" />
        </motion.div>

        {/* Full Screen Cinema Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-6xl bg-zinc-950/90 border border-white/15 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] z-10 my-auto flex flex-col lg:flex-row max-h-[92vh] backdrop-blur-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/70 border border-white/20 text-zinc-300 hover:text-white hover:bg-black/90 transition-all shadow-xl backdrop-blur-md hover:scale-105"
          >
            <X size={20} />
          </button>

          {/* Left Media Stage (Hero Visual) */}
          <div className="relative w-full lg:w-3/5 bg-zinc-900 overflow-hidden flex items-center justify-center min-h-70 sm:min-h-90 lg:min-h-125">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain object-center p-2"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-950 p-8">
                <Code2 size={64} className="mb-3 opacity-30 text-indigo-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Full Image Showcase</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-black/20" />

            {/* Badges on Visual Stage */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-600/80 text-white border border-indigo-400/30 shadow-lg backdrop-blur-md">
                  {project.category}
                </span>
                {project.type && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 text-zinc-300 border border-white/15 backdrop-blur-md">
                    {project.type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Detail Pane */}
          <div className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 overflow-y-auto custom-scrollbar bg-zinc-950/80 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                  Project Detail & Architecture
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {project.title}
                </h2>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
                {project.description}
              </p>

              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    <Tag size={13} className="text-indigo-400" /> Technologies Used
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-white/10 text-zinc-200 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95"
                  >
                    Explore Live Site <ExternalLink size={15} />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-white/15 text-white font-bold text-xs hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <GitBranch size={15} /> Source
                  </a>
                )}
              </div>

              <Link
                href={`/project/${project.id}`}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider group"
              >
                View Full Case Study Page <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
