import { createClient } from "@/lib/supabase-server";
import { SkillsClient } from "@/components/portfolio/SkillsClient";
import type { Skill, SkillCategory } from "@/types";
import { Cpu } from "lucide-react";

export const revalidate = 0;

export default async function SkillsPage() {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("level", { ascending: false }) as { data: Skill[] | null };

  // Group skills by category
  const groupedSkills = (skills || []).reduce((acc: Record<string, SkillCategory>, skill: Skill) => {
    const category = skill.category || "General";
    if (!acc[category]) {
      acc[category] = {
        title: category,
        skills: []
      };
    }
    acc[category].skills.push(skill);
    return acc;
  }, {});

  const skillCategories = Object.values(groupedSkills) as SkillCategory[];

  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const config = profile?.homepage_config || {};

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Hero Title Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Cpu className="h-3.5 w-3.5" />
            Capabilities & Stack
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            {config.skills_page_title || "Technical Capabilities"}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            {config.skills_page_description || "A comprehensive showcase of my technical stack, domain proficiency, and hands-on engineering capabilities."}
          </p>
        </div>

        {/* Skills Interactive Client Component */}
        <SkillsClient categories={skillCategories} />
      </div>
    </div>
  );
}
