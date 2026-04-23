import { createClient } from "@/lib/supabase-server";
import { ProgressClient } from "@/components/portfolio/ProgressClient";

export const revalidate = 0;

export default async function ProgressPage() {
  const supabase = await createClient();

  // Fetch active projects (not drafted)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .neq("status", "Draft")
    .order("updated_at", { ascending: false });

  // Fetch recent updates
  const { data: updates } = await supabase
    .from("updates")
    .select("*, projects(title)")
    .order("created_at", { ascending: false })
    .limit(10);

  // Stats
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: skillCount } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true });

  const { data: profile } = await supabase
    .from("resume")
    .select("homepage_config")
    .limit(1)
    .maybeSingle();

  const config = profile?.homepage_config || {};

  const stats = [
    { label: "Active Projects", value: projects?.length.toString() || "0" },
    { label: "Total Projects", value: projectCount?.toString() || "0" },
    { label: "Skills Listed", value: skillCount?.toString() || "0" },
    { label: "Coffee Consumed", value: "∞" },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
      <div className="mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{config.progress_page_title || "Live Progress"}</h1>
        <p className="text-gray-400 max-w-2xl">
          {config.progress_page_description || "Real-time updates on what I'm currently building, including development logs, active project statistics, and historical milestones."}
        </p>
      </div>

      <ProgressClient 
        initialProjects={projects || []} 
        recentUpdates={updates || []} 
        stats={stats}
        whatsappBusiness={config.whatsapp_business}
        contactOptions={config.contact_options}
      />
    </div>
  );
}
