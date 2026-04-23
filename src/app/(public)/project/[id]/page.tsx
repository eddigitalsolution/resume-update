import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ExternalLink, 
  Code2, 
  Calendar, 
  BarChart2, 
  Layers
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectDetailClient } from "@/components/portfolio/ProjectDetailClient";

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  // Fetch updates
  const { data: updates } = await supabase
    .from("updates")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
      <Link 
        href="/portfolio"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group w-fit"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        Back to portfolio
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Content */}
        <div className="lg:col-span-2">
          <ProjectDetailClient project={project} />
        </div>

        {/* Right Column: Metadata & Details */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 sticky top-24">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Project Status</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Completion</span>
                  <span className="text-sm font-bold text-indigo-400">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all duration-1000" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar size={18} />
                  <span className="text-sm">Published on {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <BarChart2 size={18} />
                  <span className="text-sm">{project.status} Development</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                {project.live_url && (
                  <Button className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold" asChild>
                    <a href={project.live_url} target="_blank">
                      Live Preview <ExternalLink size={16} className="ml-2" />
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold" asChild>
                    <a href={project.github_url} target="_blank">
                      Source Code <Code2 size={16} className="ml-2" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Updates Timeline */}
              {updates && updates.length > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Latest Updates</h3>
                  <div className="space-y-6">
                    {updates.map((update: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l border-white/10">
                        <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-indigo-500" />
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(update.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-300 leading-tight">{update.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
