"use client";

import { motion } from "framer-motion";
import { 
  Code2, 
  Layout, 
  Server, 
  Smartphone, 
  Database, 
  Cpu
} from "lucide-react";
import type { Skill, SkillCategory } from "@/types";

// Helper to map category names to icons
const getIcon = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes("frontend") || c.includes("web")) return <Layout className="h-6 w-6 text-indigo-500" />;
  if (c.includes("backend") || c.includes("server")) return <Server className="h-6 w-6 text-purple-500" />;
  if (c.includes("mobile")) return <Smartphone className="h-6 w-6 text-blue-500" />;
  if (c.includes("database") || c.includes("data")) return <Database className="h-6 w-6 text-green-500" />;
  if (c.includes("design")) return <Cpu className="h-6 w-6 text-pink-500" />;
  return <Code2 className="h-6 w-6 text-gray-500" />;
};

export function SkillsClient({ categories }: { categories: SkillCategory[] }) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
        <p className="text-gray-500">No skills found. Add them in the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {categories.map((category: SkillCategory, idx: number) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          key={category.title}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
              {getIcon(category.title)}
            </div>
            <h2 className="text-xl font-bold text-white">{category.title}</h2>
          </div>

          <div className="space-y-6">
            {category.skills.map((skill: Skill) => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                  <span className="text-xs font-bold text-indigo-400">{skill.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
