"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Code, ArrowRight } from "lucide-react";
import type { ResumeData } from "@/types";

type HeroProfile = Pick<ResumeData, 'full_name' | 'summary' | 'homepage_config'> | null;

export function Hero({ profile }: { profile: HeroProfile }) {
  const name = profile?.full_name || "";
  const summary = profile?.summary || "";
  const config = profile?.homepage_config || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      setMouse({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    )
    .fromTo(".hero-btn",
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1 },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-black"
      style={{ perspective: "1200px" }}
    >
      {/* ── Full-screen background image & SVG eyes layer (static frame) ── */}
      <div className="hero-image-wrap absolute inset-0 opacity-0">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 1024 1024"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Clip paths matching inner glasses lenses to contain pupils */}
            <clipPath id="leftEyeClip">
              <ellipse cx="460" cy="298" rx="16" ry="8" />
            </clipPath>
            <clipPath id="rightEyeClip">
              <ellipse cx="572" cy="298" rx="16" ry="8" />
            </clipPath>
          </defs>

          {/* Base character image */}
          <image
            href="/herosection/hero_avatar.png?v=11"
            x="0"
            y="0"
            width="1024"
            height="1024"
          />

          {/* Left pupil */}
          <g clipPath="url(#leftEyeClip)">
            <ellipse
              cx={460 + mouse.x * 5}
              cy={298 + mouse.y * 2}
              rx="8"
              ry="8"
              fill="#0f0f0f"
            />
            {/* Pupil Glint */}
            <circle
              cx={456 + mouse.x * 5}
              cy={294 + mouse.y * 2}
              r="2.2"
              fill="white"
            />
          </g>

          {/* Right pupil */}
          <g clipPath="url(#rightEyeClip)">
            <ellipse
              cx={572 + mouse.x * 5}
              cy={298 + mouse.y * 2}
              rx="8"
              ry="8"
              fill="#0f0f0f"
            />
            {/* Pupil Glint */}
            <circle
              cx={568 + mouse.x * 5}
              cy={294 + mouse.y * 2}
              r="2.2"
              fill="white"
            />
          </g>
        </svg>
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
          <p className="hero-description opacity-0 max-w-xl text-base md:text-lg text-zinc-300 mb-10 leading-relaxed">
            I am <span className="text-white font-bold">{name}</span>. {summary}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/portfolio?type=Freelance"
              className="hero-btn opacity-0 group inline-flex h-14 items-center justify-center rounded-xl bg-white text-black px-8 text-sm font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-2xl"
            >
              {config.hero_cta_primary || "View Selected Projects"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/portfolio?type=Portfolio"
              className="hero-btn opacity-0 group inline-flex h-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 text-sm font-bold transition-all hover:bg-white/20 active:scale-95"
            >
              {config.hero_cta_secondary || "Technical Lab"}
              <Code className="ml-2 h-4 w-4 text-zinc-300 transition-transform group-hover:rotate-6" />
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom fade line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-700/60 to-transparent" />
    </div>
  );
}
