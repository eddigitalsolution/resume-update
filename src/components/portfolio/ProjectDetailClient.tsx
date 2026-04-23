"use client";

import { motion } from "framer-motion";
import { Layers, Code2 } from "lucide-react";
import { Project } from "@/types";

export function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold border border-indigo-500/20">
          {project.category}
        </span>
        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold border border-green-500/20">
          {project.status}
        </span>
      </div>

      <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
        {project.title}
      </h1>

      <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 mb-12 bg-gray-900">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-800">
            <Code2 size={120} />
          </div>
        )}
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          {project.description}
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-3 mb-12">
          {project.tech_stack?.map(t => (
            <div key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <Layers size={14} className="text-indigo-400" />
              <span className="text-sm font-medium text-white">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
