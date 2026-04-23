import { Hero } from "@/components/Hero";
import { ImpactBar } from "@/components/portfolio/ImpactBar";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { Code2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const revalidate = 0; // Disable cache for real-time-ish updates

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
    .slice(0, 6);

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

  const config = profile?.homepage_config || {};

  return (
    <div className="flex flex-col gap-24 pb-20">
      <div className="flex flex-col gap-12">
        <Hero profile={profile} />
        <ImpactBar stats={profile?.stats} />
      </div>
      
      {/* Freelance Projects Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{config.freelance_label || "Client Success"}</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">{config.freelance_title || "Freelance Evolution"}</h2>
            <p className="text-gray-400 max-w-xl">
               {config.freelance_description || "Impactful solutions delivered for businesses and clients across marketing, SEO, and system audits."}
            </p>
          </div>
          <Link href="/portfolio?type=Freelance" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-2 group">
            All Projects <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {freelanceProjects?.map((project, idx) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col"
            >
              <div className="aspect-video bg-gray-800 overflow-hidden relative">
                {project.image_url ? (
                  <Image 
                    src={project.image_url} 
                    alt={project.title} 
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700"><Code2 size={48} /></div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-60" />
              </div>
              <div className="p-8">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                   {project.tech_stack?.slice(0, 3).map((t: string) => (
                     <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{t}</span>
                   ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Portfolio Innovations Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
               <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">{config.portfolio_label || "Engineering & AI"}</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">{config.portfolio_title || "Portfolio Innovations"}</h2>
            <p className="text-gray-400 max-w-xl">
               {config.portfolio_description || "Technical deep-dives into application architecture, AI creative experiments, and internal systems."}
            </p>
          </div>
          <Link href="/portfolio?type=Portfolio" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2 group">
            Technical Lab <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects?.map((project) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col"
            >
              <div className="aspect-video bg-gray-800 overflow-hidden relative">
                {project.image_url ? (
                  <Image 
                    src={project.image_url} 
                    alt={project.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700"><Code2 size={48} /></div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-60" />
              </div>
              <div className="p-8">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                   {project.tech_stack?.slice(0, 3).map((t: string) => (
                     <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{t}</span>
                   ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Skills Section Preview - Floating Miniature Design */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="rounded-[44px] bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 p-12 lg:p-16 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col items-center mb-12">
               <div className="h-12 w-px bg-linear-to-b from-transparent via-indigo-500 to-transparent mb-6 opacity-50" />
               <h2 className="text-4xl font-bold text-white mb-4">{config.skills_title || "Technical Expertise"}</h2>
               <p className="text-gray-400 max-w-xl text-center">
                 {config.skills_description || "A snapshot of the core technologies and modern frameworks I use to bring complex ideas to life."}
               </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {skills?.map((skill) => (
                <div 
                  key={skill.id} 
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-default group flex items-center gap-3 active:scale-95"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
