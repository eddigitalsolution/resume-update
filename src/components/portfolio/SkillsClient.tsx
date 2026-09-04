"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Layout, 
  Server, 
  Smartphone, 
  Database, 
  Cpu,
  Search,
  Zap,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Layers
} from "lucide-react";
import type { Skill, SkillCategory } from "@/types";

// Helper to map category names to rich icons and gradient colors
const getCategoryStyle = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes("frontend") || c.includes("web") || c.includes("ui")) {
    return {
      icon: <Layout className="h-5 w-5 text-indigo-400" />,
      gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
      accentColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
      barGradient: "from-indigo-500 via-blue-500 to-cyan-400",
    };
  }
  if (c.includes("backend") || c.includes("server") || c.includes("api")) {
    return {
      icon: <Server className="h-5 w-5 text-purple-400" />,
      gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
      accentColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      barGradient: "from-purple-500 via-fuchsia-500 to-pink-400",
    };
  }
  if (c.includes("mobile") || c.includes("app")) {
    return {
      icon: <Smartphone className="h-5 w-5 text-sky-400" />,
      gradient: "from-sky-500/20 via-teal-500/10 to-transparent",
      accentColor: "border-sky-500/30 text-sky-400 bg-sky-500/10",
      barGradient: "from-sky-500 via-cyan-500 to-emerald-400",
    };
  }
  if (c.includes("database") || c.includes("data") || c.includes("cloud")) {
    return {
      icon: <Database className="h-5 w-5 text-emerald-400" />,
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      accentColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      barGradient: "from-emerald-500 via-teal-500 to-green-400",
    };
  }
  if (c.includes("design") || c.includes("ai") || c.includes("tool")) {
    return {
      icon: <Cpu className="h-5 w-5 text-pink-400" />,
      gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
      accentColor: "border-pink-500/30 text-pink-400 bg-pink-500/10",
      barGradient: "from-pink-500 via-rose-500 to-amber-400",
    };
  }
  return {
    icon: <Code2 className="h-5 w-5 text-indigo-400" />,
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    accentColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    barGradient: "from-indigo-500 via-purple-500 to-pink-500",
  };
};

// Helper for skill proficiency tier label
const getLevelTier = (level: number) => {
  if (level >= 90) return { label: "Mastery", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  if (level >= 80) return { label: "Expert", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
  if (level >= 70) return { label: "Advanced", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
  return { label: "Proficient", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
};

export function SkillsClient({ categories }: { categories: SkillCategory[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Statistics calculation
  const stats = useMemo(() => {
    let totalSkills = 0;
    let totalProficiency = 0;
    categories.forEach(cat => {
      cat.skills.forEach(s => {
        totalSkills++;
        totalProficiency += s.level;
      });
    });
    const avgProficiency = totalSkills > 0 ? Math.round(totalProficiency / totalSkills) : 0;
    return {
      totalCategories: categories.length,
      totalSkills,
      avgProficiency,
    };
  }, [categories]);

  // Filter categories and skills based on search & tab selection
  const filteredCategories = useMemo(() => {
    return categories
      .map(category => {
        if (selectedCategory !== "All" && category.title !== selectedCategory) {
          return null;
        }
        const matchingSkills = category.skills.filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingSkills.length === 0) return null;
        return {
          ...category,
          skills: matchingSkills
        };
      })
      .filter((c): c is SkillCategory => c !== null);
  }, [categories, selectedCategory, searchQuery]);

  if (categories.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-950/40">
        <Layers className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400 font-medium">No technical skills added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-linear-to-br from-zinc-900/90 to-zinc-950 border border-white/10 flex items-center gap-5 shadow-xl">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">Total Expertise</span>
            <div className="text-3xl font-black text-white">{stats.totalSkills} <span className="text-sm font-semibold text-zinc-400">Skills</span></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-br from-zinc-900/90 to-zinc-950 border border-white/10 flex items-center gap-5 shadow-xl">
          <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">Core Domains</span>
            <div className="text-3xl font-black text-white">{stats.totalCategories} <span className="text-sm font-semibold text-zinc-400">Categories</span></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-br from-zinc-900/90 to-zinc-950 border border-white/10 flex items-center gap-5 shadow-xl">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">Average Level</span>
            <div className="text-3xl font-black text-white">{stats.avgProficiency}% <span className="text-sm font-semibold text-zinc-400">Proficiency</span></div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-md">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === "All"
                ? "bg-white text-black shadow-lg shadow-white/10 scale-[1.02]"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            All ({stats.totalSkills})
          </button>
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.title
                  ? "bg-white text-black shadow-lg shadow-white/10 scale-[1.02]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Real-time Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technology..."
            className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Grid of Skill Category Cards */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category: SkillCategory, idx: number) => {
              const style = getCategoryStyle(category.title);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  key={category.title}
                  className="relative rounded-3xl bg-zinc-950 border border-white/10 hover:border-indigo-500/40 transition-all duration-500 group overflow-hidden flex flex-col justify-between shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.12)]"
                >
                  {/* Subtle Gradient Backlight */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-bl ${style.gradient} pointer-events-none rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="p-8 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-3 rounded-2xl ${style.accentColor} border group-hover:scale-110 transition-transform duration-300`}>
                          {style.icon}
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-white tracking-tight">{category.title}</h2>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                            {category.skills.length} {category.skills.length === 1 ? "Technology" : "Technologies"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Bars */}
                    <div className="space-y-6">
                      {category.skills.map((skill: Skill) => {
                        const tier = getLevelTier(skill.level);
                        return (
                          <div key={skill.id} className="space-y-2 group/skill">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-zinc-600 group-hover/skill:text-indigo-400 transition-colors" />
                                <span className="font-bold text-zinc-200 group-hover/skill:text-white transition-colors">
                                  {skill.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${tier.color}`}>
                                  {tier.label}
                                </span>
                                <span className="font-mono font-black text-zinc-400 group-hover/skill:text-indigo-300">
                                  {skill.level}%
                                </span>
                              </div>
                            </div>

                            {/* Animated Glowing Bar */}
                            <div className="h-2 w-full bg-zinc-900 rounded-full p-0.5 border border-white/5 overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 + idx * 0.05 }}
                                className={`h-full bg-linear-to-r ${style.barGradient} rounded-full relative`}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                              </motion.div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl bg-zinc-950/40">
          <Search className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No skills match &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
}
