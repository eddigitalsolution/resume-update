"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Wrench, 
  Activity, 
  ArrowUpRight,
  Plus,
  Loader2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    { name: "Total Projects", value: "0", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/projects" },
    { name: "Active Skills", value: "0", icon: Wrench, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/skills" },
    { name: "Resume Updates", value: "1", icon: FileText, color: "text-green-500", bg: "bg-green-500/10", href: "/admin/resume" },
  ]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      
      const [projectsCount, skillsCount] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
      ]);

      setStats([
        { name: "Total Projects", value: (projectsCount.count || 0).toString(), icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/projects" },
        { name: "Active Skills", value: (skillsCount.count || 0).toString(), icon: Wrench, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/skills" },
        { name: "Resume Builder", value: "Ready", icon: FileText, color: "text-green-500", bg: "bg-green-500/10", href: "/admin/resume" },
      ]);
      
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Your portfolio is live and synchronized with the cloud.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/projects">
             <Button className="rounded-xl bg-white text-black hover:bg-gray-200 font-bold">
               <Plus size={18} className="mr-2" /> New Project
             </Button>
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.href} key={stat.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-indigo-500/30 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.name}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          </Link>
        ))}
        <Link href="/admin/branding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/50 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Brand Identity</h3>
            <p className="text-2xl font-bold text-white">Homepage Config</p>
          </motion.div>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white px-2">Portfolio Overview</h2>
          <div className="p-10 rounded-[40px] bg-zinc-900/50 border border-white/10 min-h-[300px] flex items-center justify-center text-gray-500">
            <div className="text-center max-w-sm">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                 <Activity size={32} className="opacity-20" />
              </div>
              <p className="text-sm leading-relaxed">System status: <span className="text-green-500 font-bold">Online</span>. <br /> Your <b>Dynamic Homepage Config</b> is active and can be edited via the Branding tab.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white px-2">Quick Access</h2>
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 space-y-3">
             {[
               { name: "Homepage Branding", href: "/admin/branding" },
               { name: "Key Success Metrics", href: "/admin/metrics" },
               { name: "Update Resume", href: "/admin/resume" },
               { name: "Personal Info", href: "/admin/personal" },
               { name: "Edit Skills", href: "/admin/skills" }
             ].map((action) => (
               <Link 
                 key={action.name} 
                 href={action.href}
                 className="block w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all text-sm font-medium text-gray-300"
               >
                 {action.name}
               </Link>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
