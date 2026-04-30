"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { 
  BarChart3, 
  Save, 
  Loader2, 
  Plus,
  Trash2,
  ArrowLeft,
  GripHorizontal,
  Palette,
  Type
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { ResumeData } from "@/types";
import { cn } from "@/lib/utils";

export default function MetricsPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: resume } = await supabase
        .from("resume")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (resume) {
        setData({
          id: resume.id,
          full_name: resume.full_name || "",
          role: resume.role || "",
          email: resume.email || "",
          phone: resume.phone || "",
          location: resume.location || "",
          summary: resume.summary || "",
          experience: resume.experience || [],
          skills: resume.skills || [],
          education: resume.education || [],
          projects: resume.projects || [],
          photo_url: resume.photo_url || "",
          stats: resume.stats || [],
          homepage_config: resume.homepage_config || {}
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!data || !data.id) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("resume")
      .update({
        stats: data.stats
      })
      .eq("id", data.id);

    if (error) {
      console.error("Error saving metrics:", error.message);
      alert("Failed to save metrics: " + error.message);
    } else {
      alert("Metrics updated successfully!");
    }
    setSaving(false);
  };

  const addStat = () => {
    if (!data) return;
    const newStat = { label: "New Metric", value: "0", icon: "Activity", color: "blue" };
    setData({ ...data, stats: [...(data.stats || []), newStat] });
  };

  const updateStat = (idx: number, field: string, value: string) => {
    if (!data) return;
    const newStats = [...(data.stats || [])];
    newStats[idx] = { ...newStats[idx], [field]: value };
    setData({ ...data, stats: newStats });
  };

  const removeStat = (idx: number) => {
    if (!data) return;
    const newStats = [...(data.stats || [])];
    newStats.splice(idx, 1);
    setData({ ...data, stats: newStats });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Key Impact Metrics</h1>
            <p className="text-gray-400 text-sm">Quantify your professional success and display it on your homepage.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            className="rounded-xl border-white/10 hover:bg-white/5 font-bold"
            onClick={addStat}
          >
            <Plus size={18} className="mr-2" /> Add Metric
          </Button>
          <Button 
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold px-8 shadow-lg shadow-indigo-500/20"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Reorder.Group axis="y" values={data.stats || []} onReorder={(newOrder) => setData({...data, stats: newOrder})} className="space-y-4">
          {(data.stats || []).map((stat, idx) => (
            <Reorder.Item 
              key={idx + (stat.label || "")} 
              value={stat}
              className="p-6 rounded-[32px] bg-zinc-900/50 border border-white/10 flex items-center gap-6 group hover:border-indigo-500/30 transition-all shadow-xl"
            >
              <div className="cursor-grab active:cursor-grabbing text-gray-600 group-hover:text-gray-400 transition-colors">
                <GripHorizontal size={20} />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Type size={12} className="text-gray-500" />
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Label</label>
                  </div>
                  <input 
                    value={stat.label}
                    placeholder="e.g. ROI Increase"
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                    onChange={(e) => updateStat(idx, 'label', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 size={12} className="text-gray-500" />
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Value (Use +/%)</label>
                  </div>
                  <input 
                    value={stat.value}
                    placeholder="e.g. 150%"
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                    onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Palette size={12} className="text-gray-500" />
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Visual Color</label>
                  </div>
                  <select 
                    value={stat.color}
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner appearance-none" 
                    onChange={(e) => updateStat(idx, 'color', e.target.value)}
                  >
                    <option value="blue">Strategic Blue</option>
                    <option value="purple">Innovation Purple</option>
                    <option value="indigo">Global Indigo</option>
                    <option value="emerald">Growth Emerald</option>
                    <option value="rose">Impact Rose</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  onClick={() => removeStat(idx)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {(data.stats || []).length === 0 && (
           <div className="p-20 rounded-[40px] border border-dashed border-white/10 text-center space-y-4">
              <BarChart3 className="mx-auto text-gray-700" size={48} />
              <p className="text-gray-500 font-medium">No metrics added yet. Add your first impact metric above.</p>
           </div>
        )}
      </div>
    </div>
  );
}
