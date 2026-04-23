"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Briefcase, 
  Calendar, 
  Trash2, 
  Save, 
  Loader2,
  Building,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { Experience } from "@/types";

export default function ExperienceAdminPage() {
  const [expList, setExpList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: resume } = await supabase
        .from('resume')
        .select('id, experience')
        .limit(1)
        .single();

      if (resume) {
        setResumeId(resume.id);
        setExpList(resume.experience || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!resumeId) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('resume')
      .update({ experience: expList })
      .eq('id', resumeId);

    if (error) {
      console.error("Error saving experience:", error);
      alert("Failed to save changes.");
    } else {
      alert("Career history updated successfully!");
    }
    setSaving(false);
  };

  const addExperience = () => {
    setExpList([{ company: "", role: "", period: "", desc: [""] }, ...expList]);
  };

  const removeExperience = (index: number) => {
    if (!confirm("Are you sure you want to remove this experience record?")) return;
    setExpList(expList.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newList = [...expList];
    newList[index] = { ...newList[index], [field]: value };
    setExpList(newList);
  };

  const addBullet = (expIndex: number) => {
    const newList = [...expList];
    newList[expIndex].desc = [...(newList[expIndex].desc || []), ""];
    setExpList(newList);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newList = [...expList];
    newList[expIndex].desc[bulletIndex] = value;
    setExpList(newList);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const newList = [...expList];
    newList[expIndex].desc = newList[expIndex].desc.filter((_, i) => i !== bulletIndex);
    setExpList(newList);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Work Experience</h1>
          <p className="text-gray-400 text-sm">Manage your career history and professional achievements.</p>
        </div>
        <div className="flex gap-3">
           <Button 
             variant="outline"
             onClick={handleSave}
             disabled={saving}
             className="rounded-2xl border-white/10 text-white font-bold h-12 px-6 hover:bg-white/5"
           >
             {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
             Save All Changes
           </Button>
           <Button 
             onClick={addExperience}
             className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-6 shadow-lg shadow-indigo-500/20"
           >
             <Plus size={20} className="mr-2" /> Add Experience
           </Button>
        </div>
      </div>

      <div className="space-y-6">
        {expList.length === 0 ? (
           <div className="p-20 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                 <Briefcase className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No experience yet</h3>
              <p className="text-gray-500 max-w-sm mb-8">Start building your career timeline by adding your first project or job role.</p>
              <Button 
                onClick={addExperience}
                className="rounded-2xl bg-white text-black font-bold h-12 px-8"
              >
                Add Your First Experience
              </Button>
           </div>
        ) : (
          expList.map((exp, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className="group p-8 rounded-[32px] bg-zinc-900/40 border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col gap-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-6 items-center">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                    <Building className="text-indigo-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.company || "Company Name"}</h3>
                    <p className="text-sm text-indigo-400 font-medium">{exp.role || "Job Role"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeExperience(idx)}
                  className="p-3 rounded-2xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-white/10 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Organization / Company</label>
                  <input 
                    value={exp.company || ""}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Role / Designation</label>
                  <input 
                    value={exp.role || ""}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    placeholder="e.g. Senior Developer"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Time Period</label>
                  <input 
                    value={exp.period || ""}
                    onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                    placeholder="e.g. 2021 — Present"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Key Responsibilities & Achievements</label>
                <div className="space-y-3">
                  {(exp.desc || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex gap-3 items-center group/bullet">
                      <div className="h-2 w-2 rounded-full bg-indigo-500/50 group-focus-within/bullet:bg-indigo-500 shrink-0" />
                      <input 
                        value={bullet || ""}
                        onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                        placeholder="Describe a responsibility or achievement..."
                        className="flex-1 bg-transparent border-b border-white/5 py-1 text-sm text-gray-300 focus:text-white outline-none focus:border-indigo-500 transition-all"
                      />
                      <button 
                        onClick={() => removeBullet(idx, bIdx)}
                        className="p-1 px-2 text-gray-700 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addBullet(idx)}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors pl-1 pt-2"
                  >
                    <Plus size={14} /> Add Bullet Point
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {expList.length > 0 && (
         <div className="flex justify-center pt-8">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-white text-black font-bold h-14 px-12 text-lg shadow-2xl hover:scale-105 transition-transform"
            >
              {saving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
              Save All Experience
            </Button>
         </div>
      )}
    </div>
  );
}
