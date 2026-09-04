"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import type { ResumeData } from "@/types";

type HeroProfile = Pick<ResumeData, 'full_name' | 'summary' | 'homepage_config'> | null;

export function Hero({ profile }: { profile: HeroProfile }) {
  const name = profile?.full_name || "";
  const summary = profile?.summary || "";
  const config = profile?.homepage_config || {};

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".hero-image-wrap",
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 1.6, ease: "power3.out" }
    )
    .fromTo(".hero-badge",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.8"
    )
    .fromTo(".hero-title-line",
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.1, stagger: 0.15 },
      "-=0.6"
    )
    .fromTo(".hero-description",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.8"
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-black"
      style={{ perspective: "1200px" }}
    >
      {/* ── Full-screen background avatar image ── */}
      <div className="hero-image-wrap absolute inset-0 opacity-0">
        <Image
          src="/herosection/hero_avatar2.png"
          alt={name || "Hero Avatar"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
        />
      </div>

      {/* ── Multi-layer dark gradient vignette for text readability ── */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* ── Content anchored to bottom-left ── */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-20 lg:pb-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl">

          {/* Availability Badge */}
          <div className="hero-badge opacity-0 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {config.hero_availability || "Available for Select Collaborations"}
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95] select-none text-white drop-shadow-2xl">
            <span className="block overflow-hidden pb-2">
              <span className="hero-title-line inline-block">
                {config.hero_headline_part1 || "High-Craft Engineering."}
              </span>
            </span>
            <span className="block overflow-hidden pb-2 text-zinc-400">
              <span className="hero-title-line inline-block">
                {config.hero_headline_part2 || "Creative Code."}
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="hero-description opacity-0 max-w-xl text-base md:text-lg text-zinc-300 mb-2 leading-relaxed">
            I am <span className="text-white font-bold">{name}</span>. {summary}
          </p>

        </div>
      </div>

      {/* ── Bottom fade line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-700/60 to-transparent" />
    </div>
  );
}
