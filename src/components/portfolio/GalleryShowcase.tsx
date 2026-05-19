"use client";

import { useState } from "react";
import { GalleryItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clipboard, 
  Check, 
  X, 
  Maximize2,
  AlertCircle,
  FolderOpen
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryShowcaseProps {
  initialItems: GalleryItem[];
  isMock: boolean;
}

const CATEGORIES = ["All", "AI Image", "Design", "Video SS"] as const;

export function GalleryShowcase({ initialItems, isMock }: GalleryShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const filteredItems = initialItems.filter((item) => {
    if (activeCategory === "All") return true;
    return item.type === activeCategory;
  });

  const handleCopyPrompt = (e: React.MouseEvent, id: string, prompt: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Resilient Mock Warning Banner */}
      {isMock && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-[24px] border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row items-center gap-3 justify-center text-center sm:text-left"
        >
          <AlertCircle className="text-amber-400 shrink-0" size={18} />
          <p className="text-xs text-amber-400 font-medium">
             Showing template showcase assets. To upload, edit, and manage your own, execute the SQL migration script in your Supabase SQL editor and access `/admin/gallery`.
          </p>
        </motion.div>
      )}

      {/* Modern Glassmorphic Category Filter Menu */}
      <div className="flex justify-center">
        <div className="glass-panel rounded-full p-1.5 flex gap-1 border border-white/5 shadow-2xl">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all",
                  isActive ? "text-black" : "text-gray-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryHighlight"
                    className="absolute inset-0 bg-white rounded-full z-[-1]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Gallery Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group relative rounded-[32px] overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between cursor-pointer"
            >
              {/* Media Container */}
              <div className="aspect-video bg-zinc-950 overflow-hidden relative border-b border-white/5">
                {item.image_url ? (
                  <Image 
                    src={item.image_url} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700"><FolderOpen size={48} /></div>
                )}
                
                {/* Overlay Ambient Shader */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Hot Zoom indicator on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-xs">
                  <div className="h-12 w-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                     <Maximize2 size={18} />
                  </div>
                </div>

                {/* Category Badge */}
                <span className={cn(
                  "absolute top-4 left-4 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/10",
                  item.type === 'AI Image' ? "bg-purple-500/80 text-white" : 
                  item.type === 'Design' ? "bg-blue-500/80 text-white" :
                  "bg-emerald-500/80 text-white"
                )}>
                  {item.type}
                </span>
              </div>

              {/* Description Card Footer */}
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors leading-tight mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                </div>

                {/* Prompt block integration */}
                {item.prompt && (
                  <div 
                    onClick={(e) => handleCopyPrompt(e, item.id, item.prompt || "")}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all group/prompt relative active:scale-98"
                    title="Click to copy prompt"
                  >
                    <p className="text-[10px] font-mono text-gray-500 group-hover/prompt:text-gray-400 transition-colors line-clamp-2 pr-6 leading-relaxed select-all">
                       {(item.prompt || "").trim()}
                    </p>
                    <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5 shrink-0">
                      {copiedId === item.id ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <Clipboard size={12} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* IMMERSIVE ZOOM LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Dark blurred background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightbox(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Lightbox Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-[44px] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:h-[600px]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveLightbox(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/40 border border-white/10 text-gray-400 hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Left Column: Full Image preview */}
              <div className="flex-1 bg-black/60 relative flex items-center justify-center h-64 md:h-full border-r border-white/5">
                <Image 
                  src={activeLightbox.image_url} 
                  alt={activeLightbox.title}
                  fill
                  className="object-contain" 
                  priority
                />
              </div>

              {/* Right Column: Metadata Detail view */}
              <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col justify-between overflow-y-auto h-auto md:h-full gap-8 bg-zinc-950">
                <div className="space-y-6">
                  <div>
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border mb-4 inline-block shadow-sm",
                      activeLightbox.type === 'AI Image' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : 
                      activeLightbox.type === 'Design' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                      {activeLightbox.type}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight mb-3">
                       {activeLightbox.title}
                    </h2>
                    {activeLightbox.description && (
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                         {activeLightbox.description}
                      </p>
                    )}
                  </div>

                  {activeLightbox.prompt && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Generation Prompt</label>
                      <div className="relative rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-gray-300 leading-relaxed max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap select-all">{(activeLightbox.prompt || "").trim()}</pre>
                      </div>
                    </div>
                  )}
                </div>

                {activeLightbox.prompt && (
                  <button 
                    onClick={(e) => handleCopyPrompt(e, activeLightbox.id, activeLightbox.prompt || "")}
                    className={cn(
                      "w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-3 active:scale-95",
                      copiedId === activeLightbox.id 
                         ? "bg-green-500/10 border-green-500/20 text-green-400" 
                         : "bg-white text-black hover:bg-gray-200 border-transparent shadow-xl shadow-white/5"
                    )}
                  >
                    {copiedId === activeLightbox.id ? (
                      <>
                        <Check size={14} /> Prompt Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard size={14} /> Copy Prompt
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
