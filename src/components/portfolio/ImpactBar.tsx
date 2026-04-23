"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
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
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative grid grid-cols-2 md:grid-cols-4 items-center gap-6 lg:gap-8 p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
          {stats.map((stat, i) => {
            // Find the Lucide icon component by name
            const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.HelpCircle;
            const colorClass = getColorClass(stat.color);
            
            return (
              <div key={`${stat.label}-${i}`} className="flex items-center gap-3 lg:gap-4">
                <div className={cn(
                  "p-2.5 lg:p-3 rounded-2xl border shrink-0 transition-transform group-hover/item:scale-110",
                  colorClass
                )}>
                  <IconComponent size={18} className="lg:w-5 lg:h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xl lg:text-2xl font-bold text-white tracking-tight leading-tight">{stat.value}</span>
                  <span className="text-[9px] lg:text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none truncate">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
