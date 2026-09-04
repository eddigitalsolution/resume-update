"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Search, Sparkles, ArrowUpRight, Code2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Project, Skill } from "@/types";
import { cn } from "@/lib/utils";
import { ProjectShowcaseModal } from "./ProjectShowcaseModal";

export function PortfolioGrid({ 
  initialProjects, 
}: { 
  initialProjects: Project[]; 
  initialSkills?: Skill[];
}) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [activeType, setActiveType] = useState<'Freelance' | 'Portfolio'>(() => {
    if (typeParam && typeParam.toLowerCase() === 'portfolio') return 'Portfolio';
    return 'Freelance';
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShowcaseProject, setSelectedShowcaseProject] = useState<Project | null>(null);

  // Sync activeType with URL query parameter changes
  useEffect(() => {
    if (typeParam) {
      if (typeParam.toLowerCase() === 'portfolio') {
        setActiveType('Portfolio');
      } else if (typeParam.toLowerCase() === 'freelance') {
        setActiveType('Freelance');
      }
    }
  }, [typeParam]);

  // Dynamically extract categories strictly from actual projects in database for the active tab
  const currentCategories = useMemo(() => {
    const categoriesSet = new Set<string>();

    initialProjects.forEach(p => {
      const pType = p.type || 'Freelance';
      if (pType.toLowerCase() === activeType.toLowerCase() && p.category && p.category.trim()) {
        categoriesSet.add(p.category.trim());
      }
    });

    return ["All", ...Array.from(categoriesSet)];
  }, [initialProjects, activeType]);

  // Automatically reset activeCategory to "All" if current category is no longer present in tab
  useEffect(() => {
    if (activeCategory !== "All" && !currentCategories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeType, currentCategories, activeCategory]);

  // Filter projects based on type, category, and search query
  const filteredProjects = useMemo(() => {
    return initialProjects.filter(p => {
      const pType = p.type || 'Freelance';
      const matchesType = pType.toLowerCase() === activeType.toLowerCase();

      const matchesCategory = activeCategory === "All" || 
        (p.category && p.category.trim().toLowerCase() === activeCategory.trim().toLowerCase());
      
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.tech_stack && p.tech_stack.some(t => t.toLowerCase().includes(query)));

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeType, activeCategory, searchTerm]);

  return (
    <>
      {/* Top Main Type Switcher (Freelance vs Skill Portfolio) */}
      <div className="flex justify-center mb-12">
        <div className="relative flex p-1.5 bg-zinc-950/80 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => {
              setActiveType('Freelance');
              setActiveCategory('All');
            }}
            className={cn(
              "relative px-7 py-2.5 rounded-full text-xs font-bold transition-colors z-10",
              activeType === 'Freelance' ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            {activeType === 'Freelance' && (
              <motion.div
                layoutId="typePill"
                className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full z-[-1] shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            Freelance Projects
          </button>
          <button
            onClick={() => {
              setActiveType('Portfolio');
              setActiveCategory('All');
            }}
            className={cn(
              "relative px-7 py-2.5 rounded-full text-xs font-bold transition-colors z-10",
              activeType === 'Portfolio' ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            {activeType === 'Portfolio' && (
              <motion.div
                layoutId="typePill"
                className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-full z-[-1] shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            Skill Portfolio
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-wrap gap-2">
          {currentCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  isActive 
                    ? (activeType === 'Freelance'
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        : "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]")
                    : "bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
        
        {/* Search Field */}
        <div className="relative group shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 group-focus-within:text-white transition-colors" />
          <input 
            id="portfolio-search"
            name="search"
            type="text" 
            placeholder={`Search ${activeType.toLowerCase()}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-zinc-950 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/60 transition-all text-white placeholder:text-zinc-500" 
          />
        </div>
      </div>

      {/* Grid of Interactive Project Cards */}
      {filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              key={project.id}
              onClick={() => setSelectedShowcaseProject(project)}
              className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xl hover:shadow-[0_0_35px_rgba(99,102,241,0.15)]"
            >
              {/* Project Image */}
              <div className="overflow-hidden aspect-video bg-zinc-900 relative">
                {project.image_url ? (
                  <Image 
                    src={project.image_url} 
                    alt={project.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index < 3}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <Code2 size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-85" />

                {/* Category Pill */}
                {project.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/70 text-zinc-300 border border-white/10 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                )}

                {/* Corner Expand Indicator */}
                <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <ArrowUpRight size={13} />
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {project.status && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        project.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        project.status === 'Past Job' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Card Footer Tech Stack & Showcase link */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
                    {project.tech_stack?.slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                        {t}
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
        </motion.div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-950/40">
          <Code2 className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm font-medium">
            No {activeType.toLowerCase()} projects found.
          </p>
        </div>
      )}

      {/* Interactive Modal */}
      <ProjectShowcaseModal
        project={selectedShowcaseProject}
        onClose={() => setSelectedShowcaseProject(null)}
      />
    </>
  );
}
