"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Code2, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "@/components/Hero";
import { ScrollSequence } from "@/components/ScrollSequence";
import { ProjectSlider } from "./ProjectSlider";

gsap.registerPlugin(ScrollTrigger);

import type { Project, Skill } from "@/types";

interface HomeContentProps {
  freelanceProjects: Project[];
  portfolioProjects: Project[];
  skills: Skill[];
  profile: any;
}

export function HomeContent({
  freelanceProjects,
  portfolioProjects,
  skills,
  profile,
}: HomeContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = profile?.homepage_config || {};

  useGSAP(() => {
    const sections = gsap.utils.toArray(".scroll-section");
    
    sections.forEach((section: any) => {
      // Fade in section title and header
      const header = section.querySelector(".section-header");
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Stagger reveal card elements
      const cards = section.querySelectorAll(".project-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-6 md:gap-12 pb-12">
      <div className="flex flex-col gap-0">
        <Hero profile={profile} />
        <ScrollSequence />
      </div>

      {/* Freelance Projects Section */}
      <section className="scroll-section container mx-auto px-4 lg:px-8 max-w-full overflow-x-hidden">
        <div className="relative rounded-3xl bg-linear-to-br from-zinc-100 via-white to-zinc-200 border border-zinc-300/60 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />
          <ProjectSlider
            badge={config.freelance_label || "Client Success"}
            title={config.freelance_title || "Freelance Evolution"}
            subtitle={config.freelance_description || "Impactful solutions delivered for businesses and clients across marketing, SEO, and system audits."}
            projects={freelanceProjects}
            viewAllHref="/portfolio?type=Freelance"
            viewAllLabel="All Client Projects"
            theme="light"
          />
        </div>
      </section>

      {/* Portfolio Innovations Section */}
      <section className="scroll-section container mx-auto px-4 lg:px-8 max-w-full overflow-x-hidden">
        <div className="relative rounded-3xl bg-linear-to-br from-zinc-100 via-white to-zinc-200 border border-zinc-300/60 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <ProjectSlider
            badge={config.portfolio_label || "Engineering & AI"}
            title={config.portfolio_title || "Portfolio Innovations"}
            subtitle={config.portfolio_description || "Technical deep-dives into application architecture, AI creative experiments, and internal systems."}
            projects={portfolioProjects}
            viewAllHref="/portfolio?type=Portfolio"
            viewAllLabel="Technical Lab"
            theme="light"
          />
        </div>
      </section>
    </div>
  );
}
