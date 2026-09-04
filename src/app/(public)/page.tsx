import { createClient } from "@/lib/supabase-server";
import { HomeContent } from "@/components/portfolio/HomeContent";

export const revalidate = 60; // 60 seconds ISR cache for instant responses

export default async function Home() {
  const supabase = await createClient();

  // Fetch projects and sort by featured status
  const { data: allFreelance } = await supabase
    .from("projects")
    .select("*")
    .in("status", ["Live", "Past Job"])
    .eq("type", "Freelance")
    .order("created_at", { ascending: false });

  const { data: allPortfolio } = await supabase
    .from("projects")
    .select("*")
    .in("status", ["Live", "Past Job"])
    .eq("type", "Portfolio")
    .order("created_at", { ascending: false });

  const freelanceProjects = (allFreelance || [])
    .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    .slice(0, 9);

  const portfolioProjects = (allPortfolio || [])
    .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    .slice(0, 9);

  // Fetch all skills
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("level", { ascending: false });

  // Fetch profile/resume data
  const { data: profile } = await supabase
    .from("resume")
    .select("full_name, role, summary, stats, homepage_config, whatsapp_personal")
    .limit(1)
    .maybeSingle();

  return (
    <HomeContent
      freelanceProjects={freelanceProjects}
      portfolioProjects={portfolioProjects}
      skills={skills || []}
      profile={profile}
    />
  );
}
