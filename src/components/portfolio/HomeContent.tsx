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

    // Special animation for skills bubble cloud
    const skillBubbles = containerRef.current?.querySelectorAll(".skill-bubble");
    if (skillBubbles && skillBubbles.length > 0) {
      gsap.fromTo(
        skillBubbles,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.03,
          scrollTrigger: {
            trigger: ".skills-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-32 pb-32">
      <div className="flex flex-col gap-12">
        <Hero profile={profile} />
        <ScrollSequence />
      </div>

      {/* Freelance Projects Section */}
      <section className="scroll-section container mx-auto px-4 lg:px-8">
        <ProjectSlider
          badge={config.freelance_label || "Client Success"}
          title={config.freelance_title || "Freelance Evolution"}
          subtitle={config.freelance_description || "Impactful solutions delivered for businesses and clients across marketing, SEO, and system audits."}
          projects={freelanceProjects}
          viewAllHref="/portfolio?type=Freelance"
          viewAllLabel="All Client Projects"
        />
      </section>

      {/* Portfolio Innovations Section */}
      <section className="scroll-section container mx-auto px-4 lg:px-8">
        <ProjectSlider
          badge={config.portfolio_label || "Engineering & AI"}
          title={config.portfolio_title || "Portfolio Innovations"}
          subtitle={config.portfolio_description || "Technical deep-dives into application architecture, AI creative experiments, and internal systems."}
          projects={portfolioProjects}
          viewAllHref="/portfolio?type=Portfolio"
          viewAllLabel="Technical Lab"
        />
      </section>

      {/* Skills Section Preview */}
      <section className="skills-section container mx-auto px-4 lg:px-8">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-12 lg:p-16 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                {config.skills_title || "Technical Expertise"}
              </h2>
              <p className="text-zinc-400 max-w-xl text-sm md:text-base">
                {config.skills_description || "A snapshot of the core technologies and modern frameworks I use to bring complex ideas to life."}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {skills?.map((skill) => (
                <div
                  key={skill.id}
                  className="skill-bubble opacity-0 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all cursor-default group flex items-center gap-3"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
