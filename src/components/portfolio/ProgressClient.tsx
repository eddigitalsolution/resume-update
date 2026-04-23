"use client";

import { motion } from "framer-motion";
import { Terminal, Clock, GitCommit, ChevronRight } from "lucide-react";

export function ProgressClient({ 
  initialProjects, 
  recentUpdates, 
  stats, 
  whatsappBusiness,
  contactOptions 
}: { 
  initialProjects: any[], 
  recentUpdates: any[],
  stats: any[],
  whatsappBusiness?: string,
  contactOptions?: Array<{ label: string; message: string; }>
}) {
  const defaultOptions = [
    { label: "Create Website", message: "Hi! I'm interested in building a new website with you." },
    { label: "Need Help Run Ads", message: "Hi! I need expert help with running and optimizing my digital ads." },
    { label: "Need AI Automation", message: "Hi! I'm looking to implement AI automation in my business." },
    { label: "Business Consultation", message: "Hi! I'd like to book a consultation to discuss a project." }
  ];

  const displayOptions = contactOptions && contactOptions.length > 0 ? contactOptions : defaultOptions;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="space-y-8">
        <div className="p-8 rounded-4xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Want specialized help?</h3>
          <p className="text-gray-400 text-sm mb-8">Direct line for high-priority projects and consultation.</p>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">What can I help you with?</p>
              <div className="grid grid-cols-1 gap-2">
                {displayOptions.map((item, i) => (
                  <a
                    key={i}
                    id={`quick-ask-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    href={whatsappBusiness ? `https://wa.me/${whatsappBusiness.replace(/\D/g, '').replace(/^0/, '60').replace(/^(?!60)/, '60')}?text=${encodeURIComponent(item.message)}` : '#'}
                    target="_blank"
                    className={`flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-all group ${!whatsappBusiness && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">{item.label}</span>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>

            {whatsappBusiness ? (
              <a 
                href={`https://wa.me/${whatsappBusiness.replace(/\D/g, '').replace(/^0/, '60').replace(/^(?!60)/, '60')}`} 
                target="_blank" 
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/10"
              >
                General Inquiry
              </a>
            ) : (
              <button disabled className="w-full flex items-center justify-center gap-2 bg-white/10 text-gray-500 font-bold py-4 px-6 rounded-2xl">
                Contact Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-2xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Active Projects */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Terminal size={20} className="text-indigo-500" />
            <h2 className="text-2xl font-bold text-white">Active Projects</h2>
          </div>

          <div className="space-y-6">
            {initialProjects.map((project) => (
              <div key={project.id} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-bold">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Logs */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <GitCommit size={20} className="text-purple-500" />
            <h2 className="text-2xl font-bold text-white">Development Logs</h2>
          </div>

          <div className="space-y-4">
            {recentUpdates.map((update, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="p-1 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  </div>
                  <div className="flex-1 w-px bg-white/10 my-2" />
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500">
                      {new Date(update.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-bold text-indigo-400">
                      in {update.projects?.title || 'Unknown Project'}
                    </span>
                  </div>
                  <p className="text-gray-300">{update.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
