"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

export function PortfolioGrid({ initialProjects }: { initialProjects: Project[] }) {
  const [activeType, setActiveType] = useState<'Freelance' | 'Portfolio'>('Freelance');
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Dynamically extract unique categories for the active type
  const currentCategories = [
    "All",
    ...Array.from(new Set(
      initialProjects
        .filter(p => p.type === activeType)
        .map(p => p.category)
        .filter(Boolean)
    ))
  ];

   const filteredProjects = initialProjects.filter(p => {
    const matchesType = p.type === activeType;
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const accentColor = activeType === 'Freelance' ? 'blue' : 'purple';
  const themeClass = activeType === 'Freelance' ? 'text-blue-400' : 'text-purple-400';
  const bgAccentClass = activeType === 'Freelance' ? 'bg-blue-500/10' : 'bg-purple-500/10';
  const borderAccentClass = activeType === 'Freelance' ? 'border-blue-500/20' : 'border-purple-500/20';

  return (
    <>
       {/* Top Switcher */}
      <div className="flex justify-center mb-16">
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
          <button
            onClick={() => {
              setActiveType('Freelance');
              setActiveCategory('All');
            }}
            className={cn(
              "px-8 py-3 rounded-[20px] text-sm font-bold transition-all",
              activeType === 'Freelance' 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            Freelance Projects
          </button>
          <button
            onClick={() => {
              setActiveType('Portfolio');
              setActiveCategory('All');
            }}
            className={cn(
              "px-8 py-3 rounded-[20px] text-sm font-bold transition-all",
              activeType === 'Portfolio' 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            Skill Portfolio
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {currentCategories.map((cat) => (
            <button
              key={cat}
              id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                activeCategory === cat 
                  ? (activeType === 'Freelance' ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-purple-600 border-purple-500 text-white shadow-lg")
                  : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input 
            id="portfolio-search"
            name="search"
            type="text" 
            placeholder={`Search ${activeType.toLowerCase()}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors" 
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.map((project) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            key={project.id}
            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col"
          >
            <Link href={`/project/${project.id}`} className="block overflow-hidden aspect-video bg-gray-800">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">
                  <Code2 size={48} />
                </div>
              )}
            </Link>
            
             <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                   "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                   bgAccentClass,
                   themeClass
                )}>
                  {project.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  project.status === 'Live' ? 'bg-green-500/10 text-green-400' : 
                  project.status === 'Past Job' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-orange-500/10 text-orange-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
               <h3 className={cn(
                "text-xl font-bold text-white mb-2 transition-colors",
                activeType === 'Freelance' ? "group-hover:text-blue-400" : "group-hover:text-purple-400"
              )}>
                <Link href={`/project/${project.id}`}>
                  {project.title}
                </Link>
              </h3>
              
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {project.tech_stack?.slice(0, 4).map(t => (
                  <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className={cn(
                "p-2 rounded-full backdrop-blur-md border text-white transition-colors",
                activeType === 'Freelance' ? "bg-blue-600/50 border-blue-500/30 hover:bg-blue-600" : "bg-purple-600/50 border-purple-500/30 hover:bg-purple-600"
              )}>
                <Code2 size={16} />
              </button>
              {project.live_url && (
                <a 
                  href={project.live_url}
                  target="_blank"
                  className={cn(
                    "p-2 rounded-full backdrop-blur-md border text-white transition-colors",
                    activeType === 'Freelance' ? "bg-blue-600/50 border-blue-500/30 hover:bg-blue-600" : "bg-purple-600/50 border-purple-500/30 hover:bg-purple-600"
                  )}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
