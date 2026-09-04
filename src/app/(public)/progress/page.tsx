import { createClient } from "@/lib/supabase-server";
import { ProgressClient } from "@/components/portfolio/ProgressClient";
import { Activity } from "lucide-react";

export const revalidate = 60;

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
    <main className="min-h-screen pt-28 pb-32 bg-black relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Activity className="h-3.5 w-3.5" />
            Live Development Stream
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            {config.progress_page_title || (
              <>
                Live <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-indigo-400">Progress</span> & Log
              </>
            )}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {config.progress_page_description || "Real-time updates on active builds, engineering milestones, and development logs."}
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
    </main>
  );
}
