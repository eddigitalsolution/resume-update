"use client";

import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export function ImpactBar({ stats }: { stats?: StatItem[] }) {
  if (!stats || stats.length === 0) return null;

  const colorMap: Record<string, string> = {
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    rose: "text-rose-400 border-rose-500/20 bg-rose-500/5",
  };

  // Helper to normalize color values (handles "blue" or "text-blue-400")
  const getColorClass = (color: string) => {
    const key = color.replace('text-', '').split('-')[0];
    return colorMap[key] || colorMap.blue;
  };

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative group"
      >
        {/* Immersive glow */}
        <div className="absolute -inset-2 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative glass-panel rounded-[32px] md:rounded-[40px] p-6 md:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-6 md:gap-10 shadow-2xl glow-border">
          {stats.map((stat, i) => {
            const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[stat.icon] || HelpCircle;
            const colorClass = getColorClass(stat.color);
            
            return (
              <motion.div 
                key={`${stat.label}-${i}`} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 md:gap-5 group/item"
              >
                <div className={cn(
                  "h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 group-hover/item:rotate-12 group-hover/item:scale-110",
                  colorClass
                )}>
                  <IconComponent size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <motion.span 
                    className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter leading-none"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1 md:mt-2 truncate">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
