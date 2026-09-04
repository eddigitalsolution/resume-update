import { createClient } from "@/lib/supabase-server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import type { Skill } from "@/types";

export const revalidate = 60;

export default async function PortfolioPage() {
  const supabase = await createClient();

  // Fetch all published/active projects from database (excluding Drafts)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .neq("status", "Draft")
    .order("created_at", { ascending: false });

  // Fetch all skills from database to populate Skill Portfolio categories
  const { data: skills } = await supabase
    .from("skills")
    .select("*") as { data: Skill[] | null };

  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const config = profile?.homepage_config || {};

  return (
    <main className="min-h-screen pt-28 pb-32 bg-black relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Hero Title Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            Selected Work & Lab
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            {config.portfolio_page_title || (
              <>
                Work & <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">Creativity</span>
              </>
            )}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {config.portfolio_page_description || (
              <>
                Explore my dual professional world: From building high-impact client systems to crafting innovative software engineering labs.
              </>
            )}
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-zinc-500 font-medium">Loading portfolio projects...</div>}>
          <PortfolioGrid initialProjects={projects || []} initialSkills={skills || []} />
        </Suspense>
      </div>
    </main>
  );
}
