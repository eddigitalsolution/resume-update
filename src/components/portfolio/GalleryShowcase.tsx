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
          className="max-w-3xl mx-auto rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center gap-3 justify-center text-center"
        >
          <AlertCircle className="text-amber-400 shrink-0" size={16} />
          <p className="text-xs text-amber-300 font-medium">
             Displaying curated showcase assets. To manage your own gallery items, execute the database migration and visit `/admin/gallery`.
          </p>
        </motion.div>
      )}

      {/* Category Filter Menu with layoutId Active Pill */}
      <div className="flex justify-center">
        <div className="relative flex p-1.5 bg-zinc-950/80 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "relative px-6 py-2 rounded-full text-xs font-bold transition-colors z-10",
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="galleryCategoryPill"
                    className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full z-[-1] shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-2xl hover:shadow-[0_0_35px_rgba(168,85,247,0.15)]"
            >
              {/* Media Container */}
              <div className="aspect-video bg-zinc-900 overflow-hidden relative border-b border-white/5">
                {item.image_url ? (
                  <Image 
                    src={item.image_url} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800"><FolderOpen size={44} /></div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
                
                {/* Zoom icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                  <div className="h-10 w-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                     <Maximize2 size={16} />
                  </div>
                </div>

                {/* Category Badge */}
                <span className={cn(
                  "absolute top-3 left-3 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/10",
                  item.type === 'AI Image' ? "bg-purple-500/80 text-white" : 
                  item.type === 'Design' ? "bg-blue-500/80 text-white" :
                  "bg-emerald-500/80 text-white"
                )}>
                  {item.type}
                </span>
              </div>

              {/* Description Card Footer */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                </div>

                {/* Prompt block integration */}
                {item.prompt && (
                  <div 
                    onClick={(e) => handleCopyPrompt(e, item.id, item.prompt || "")}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-white/15 transition-all group/prompt relative active:scale-98"
                    title="Click to copy prompt"
                  >
                    <p className="text-[10px] font-mono text-zinc-500 group-hover/prompt:text-zinc-300 transition-colors line-clamp-1 pr-2 leading-relaxed select-all">
                       {(item.prompt || "").trim()}
                    </p>
                    <div className="h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5 shrink-0">
                      {copiedId === item.id ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <Clipboard size={11} />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightbox(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:h-145"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white transition-colors z-20 backdrop-blur-sm"
              >
                <X size={18} />
              </button>

              {/* Left Column: Image preview */}
              <div className="flex-1 bg-black/60 relative flex items-center justify-center h-64 md:h-full border-r border-white/5">
                <Image 
                  src={activeLightbox.image_url} 
                  alt={activeLightbox.title}
                  fill
                  className="object-contain" 
                />
              </div>

              {/* Right Column: Detail View */}
              <div className="w-full md:w-95 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-auto md:h-full gap-6 bg-zinc-950">
                <div className="space-y-5">
                  <div>
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border mb-3 inline-block shadow-sm",
                      activeLightbox.type === 'AI Image' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : 
                      activeLightbox.type === 'Design' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                      {activeLightbox.type}
                    </span>
                    <h2 className="text-xl font-bold text-white leading-snug mb-2">
                       {activeLightbox.title}
                    </h2>
                    {activeLightbox.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                         {activeLightbox.description}
                      </p>
                    )}
                  </div>

                  {activeLightbox.prompt && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">Generation Prompt</label>
                      <div className="relative rounded-2xl border border-white/10 bg-zinc-900/80 p-3.5 font-mono text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto">
                        <pre className="whitespace-pre-wrap select-all font-mono text-[11px]">{(activeLightbox.prompt || "").trim()}</pre>
                      </div>
                    </div>
                  )}
                </div>

                {activeLightbox.prompt && (
                  <button 
                    onClick={(e) => handleCopyPrompt(e, activeLightbox.id, activeLightbox.prompt || "")}
                    className={cn(
                      "w-full h-11 rounded-2xl font-bold text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 active:scale-98",
                      copiedId === activeLightbox.id 
                         ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                         : "bg-white text-black hover:bg-zinc-200 border-transparent shadow-xl"
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
