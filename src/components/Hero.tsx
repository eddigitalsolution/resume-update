"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Code, Zap } from "lucide-react";
import type { ResumeData } from "@/types";

type HeroProfile = Pick<ResumeData, 'full_name' | 'summary' | 'homepage_config'> | null;

export function Hero({ profile }: { profile: HeroProfile }) {
  const name = profile?.full_name || "";
  const summary = profile?.summary || "";
  const config = profile?.homepage_config || {};

  return (
    <div className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[130px] opacity-60" />
        <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[130px] opacity-60" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {config.hero_availability || "Available for Strategic Scale"}
          </span>

          <h1 className="text-5xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-white/60 leading-[1.1]">
            <span className="text-blue-500/80">{config.hero_headline_part1 || "Scale Your Business."}</span> <br />
            <span className="text-purple-500/80">{config.hero_headline_part2 || "Innovate Your Tech."}</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-gray-400 mb-12 leading-relaxed">
            I am <span className="text-white font-bold">{name}</span>. {summary}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/portfolio?type=Freelance"
              className="group relative inline-flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-8 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              {config.hero_cta_primary || "Scale My Growth"}
              <Zap className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/portfolio?type=Portfolio"
              className="group relative inline-flex h-14 items-center justify-center rounded-2xl bg-white/10 border border-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95 hover:border-purple-500/50"
            >
              {config.hero_cta_secondary || "Explore My Tech"}
              <Code className="ml-2 h-4 w-4 text-purple-400 transition-transform group-hover:translate-x-1" />
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
