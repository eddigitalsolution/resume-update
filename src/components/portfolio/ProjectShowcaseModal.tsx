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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white hover:bg-black/90 transition-all shadow-lg backdrop-blur-md"
          >
            <X size={18} />
          </button>

          {/* Media Header */}
          <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden shrink-0 border-b border-white/10">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1000px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-950">
                <Code2 size={56} className="mb-2 opacity-40" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-600">No Image Showcase</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

            {/* Floating Category Badge */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                {project.category}
              </span>
              {project.type && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/10 backdrop-blur-md">
                  {project.type}
                </span>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                {project.title}
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Pills */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
                  <Tag size={12} /> Tech Stack & Tools
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-zinc-900 border border-white/10 text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
                  >
                    Live Preview <ExternalLink size={14} />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-bold text-xs hover:bg-zinc-800 transition-all"
                  >
                    <GitBranch size={14} /> Source Code
                  </a>
                )}
              </div>

              <Link
                href={`/project/${project.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider group"
              >
                Full Case Study <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
