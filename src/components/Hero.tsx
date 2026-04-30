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
    <div className="relative min-h-[70vh] flex items-center justify-center pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-visible">
      {/* Immersive Background System */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-10 glow-border"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              {config.hero_availability || "Available for Strategic Scale"}
            </motion.div>

            <h1 className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tight mb-8 md:mb-10 leading-none md:leading-[0.9] text-gradient-primary">
              <span className="block mb-2">{config.hero_headline_part1 || "Scale Your Business."}</span>
              <span className="block text-gradient-accent">{config.hero_headline_part2 || "Innovate Your Tech."}</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 md:mb-14 leading-relaxed font-medium px-4"
            >
              I am <span className="text-white font-bold border-b-2 border-indigo-500/50">{name}</span>. {summary}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <Link
                href="/portfolio?type=Freelance"
                className="group relative inline-flex h-16 items-center justify-center rounded-2xl bg-white text-black px-10 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                {config.hero_cta_primary || "Scale My Growth"}
                <Zap className="ml-3 h-4 w-4 fill-black transition-transform group-hover:rotate-12" />
              </Link>
              
              <Link
                href="/portfolio?type=Portfolio"
                className="group relative inline-flex h-16 items-center justify-center rounded-2xl glass-panel px-10 text-sm font-black text-white transition-all hover:scale-105 active:scale-95 glow-border"
              >
                {config.hero_cta_secondary || "Explore My Tech"}
                <Code className="ml-3 h-4 w-4 text-purple-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
