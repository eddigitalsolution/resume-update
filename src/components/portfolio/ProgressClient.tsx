"use client";

import { motion } from "framer-motion";
import { Terminal, GitCommit, ChevronRight, MessageSquareCode, Layers, Sparkles } from "lucide-react";
import type { Project, Update } from "@/types";

export function ProgressClient({ 
  initialProjects, 
  recentUpdates, 
  stats, 
  whatsappBusiness,
  contactOptions 
}: { 
  initialProjects: Project[], 
  recentUpdates: (Update & { projects?: { title: string } })[],
  stats: { label: string, value: string }[],
  whatsappBusiness?: string,
  contactOptions?: Array<{ label: string; message: string; }>
}) {
  const defaultOptions = [
    { label: "Create Website / Web App", message: "Hi! I'm interested in building a new custom web app or website with you." },
    { label: "AI & Automation Solution", message: "Hi! I'm looking to implement custom AI automation for my business." },
    { label: "Digital Ads & Growth", message: "Hi! I need expert help with optimizing my digital campaign ads and growth." },
    { label: "Consultation & Tech Audit", message: "Hi! I'd like to book a direct consultation to discuss a technical project." }
  ];

  const displayOptions = contactOptions && contactOptions.length > 0 ? contactOptions : defaultOptions;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left Column: Direct Consultation Panel */}
      <div className="space-y-8">
        <div className="p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1.5">
              <MessageSquareCode size={12} /> Direct Channel
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Build or Collaborate</h3>
          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            Direct priority channel for custom web development, AI automation, and high-impact technical advisory.
          </p>
          
          <div className="space-y-6">
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block pl-1">
                Select Consultation Topic
              </span>
              <div className="grid grid-cols-1 gap-2">
                {displayOptions.map((item, i) => (
                  <a
                    key={i}
                    id={`quick-ask-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    href={whatsappBusiness ? `https://wa.me/${whatsappBusiness.replace(/\D/g, '').replace(/^0/, '60').replace(/^(?!60)/, '60')}?text=${encodeURIComponent(item.message)}` : '#'}
                    target="_blank"
                    className={`flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-zinc-900/60 hover:bg-zinc-900 hover:border-indigo-500/40 transition-all group ${!whatsappBusiness && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                    <ChevronRight size={14} className="text-zinc-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>

            {whatsappBusiness ? (
              <a 
                href={`https://wa.me/${whatsappBusiness.replace(/\D/g, '').replace(/^0/, '60')}`} 
                target="_blank" 
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-98"
              >
                Initiate Direct Inquiry <Sparkles size={13} />
              </a>
            ) : (
              <button disabled className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-zinc-600 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl border border-white/5 cursor-not-allowed">
                Contact Currently Offline
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Stats, Active Projects & Logs */}
      <div className="lg:col-span-2 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-5 rounded-3xl bg-zinc-950 border border-white/10 text-center shadow-xl hover:border-white/20 transition-all">
              <span className="block text-2xl font-black text-white mb-1 tracking-tight">{stat.value}</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Active Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal size={18} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Active Builds & Pipelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialProjects.map((project) => (
              <div key={project.id} className="p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-white line-clamp-1">{project.title}</h3>
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-2">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{project.description}</p>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Completion Status</span>
                    <span className="text-white font-mono font-bold text-xs">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full p-0.5 border border-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Logs Timeline */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GitCommit size={18} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Development Logs</h2>
          </div>

          <div className="space-y-3">
            {recentUpdates.map((update, i) => (
              <div key={i} className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-purple-500/30 transition-all shadow-md flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  {i !== recentUpdates.length - 1 && <div className="w-px h-full bg-white/10 mt-2" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-500">
                      {new Date(update.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {update.projects?.title || 'System Core'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{update.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
