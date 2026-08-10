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
import { ImpactBar } from "./ImpactBar";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  tech_stack?: string[];
  is_featured?: boolean;
}

interface Skill {
  id: string;
  name: string;
}

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
      gsap.fromTo(
        section.querySelector(".section-header"),
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
    gsap.fromTo(
      ".skill-bubble",
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
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-32 pb-32">
      <div className="flex flex-col gap-12">
        <Hero profile={profile} />
        <ScrollSequence />
        <ImpactBar stats={profile?.stats} />
      </div>

      {/* Freelance Projects Section */}
      <section className="scroll-section container mx-auto px-4 lg:px-8">
        <div className="section-header opacity-0 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                {config.freelance_label || "Client Success"}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
              {config.freelance_title || "Freelance Evolution"}
            </h2>
            <p className="text-zinc-400 max-w-xl text-sm md:text-base">
              {config.freelance_description || "Impactful solutions delivered for businesses and clients across marketing, SEO, and system audits."}
            </p>
          </div>
          <Link
            href="/portfolio?type=Freelance"
            className="text-xs font-black uppercase tracking-wider text-white hover:text-zinc-300 transition-all flex items-center gap-2 group w-fit border-b border-white pb-1"
          >
            All Client Projects <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {freelanceProjects?.map((project, idx) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="project-card opacity-0 group relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-750 hover:bg-zinc-900/80 transition-all flex flex-col"
            >
              <div className="aspect-video bg-zinc-950 overflow-hidden relative">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <Code2 size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-6">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900">
                  {project.tech_stack?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Portfolio Innovations Section */}
      <section className="scroll-section container mx-auto px-4 lg:px-8">
        <div className="section-header opacity-0 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                {config.portfolio_label || "Engineering & AI"}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
              {config.portfolio_title || "Portfolio Innovations"}
            </h2>
            <p className="text-zinc-400 max-w-xl text-sm md:text-base">
              {config.portfolio_description || "Technical deep-dives into application architecture, AI creative experiments, and internal systems."}
            </p>
          </div>
          <Link
            href="/portfolio?type=Portfolio"
            className="text-xs font-black uppercase tracking-wider text-white hover:text-zinc-300 transition-all flex items-center gap-2 group w-fit border-b border-white pb-1"
          >
            Technical Lab <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects?.map((project) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="project-card opacity-0 group relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-750 hover:bg-zinc-900/80 transition-all flex flex-col"
            >
              <div className="aspect-video bg-zinc-950 overflow-hidden relative">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <Code2 size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-6">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900">
                  {project.tech_stack?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
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
