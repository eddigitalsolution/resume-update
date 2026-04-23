import { createClient } from "@/lib/supabase-server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const revalidate = 0;

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const config = profile?.homepage_config || {};

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{config.portfolio_page_title || "Work & Creativity"}</h1>
        <p className="text-gray-400 max-w-2xl px-1">
          {config.portfolio_page_description || (
            <>
              Explore my dual professional world: From building impactful **Freelance Projects** for clients 
              to implementing complex **Technical Skills** in apps, systems, and AI.
            </>
          )}
        </p>
      </div>

      <PortfolioGrid initialProjects={projects || []} />
    </div>
  );
}
