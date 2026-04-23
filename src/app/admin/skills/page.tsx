"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Code2, 
  CheckCircle2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('level', { ascending: false });

    if (data) setSkills(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkill?.name || !currentSkill?.category) return;
    setSaving(true);

    const skillData = {
      name: currentSkill.name,
      category: currentSkill.category,
      level: currentSkill.level || 80,
    };

    let error;
    if (currentSkill.id) {
      const { error: updateError } = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', currentSkill.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('skills')
        .insert([skillData]);
      error = insertError;
    }

    if (!error) {
      setIsModalOpen(false);
      fetchSkills();
    } else {
      console.error("Error saving skill:", error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (!error) {
      setSkills(skills.filter(s => s.id !== id));
    }
  };

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Technical Skills</h1>
          <p className="text-gray-400 text-sm">Manage your expertise and proficiency levels.</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentSkill({ name: "", category: "Frontend", level: 80 });
            setIsModalOpen(true);
          }}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-6"
        >
          <Plus size={20} className="mr-2" /> Add New Skill
        </Button>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills or categories..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
          />
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl border border-white/10 text-gray-400">
              <Filter size={18} />
           </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={skill.id}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 group hover:border-indigo-500/30 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{skill.category}</span>
                  <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setCurrentSkill(skill);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 rounded-lg bg-white/5 text-red-500/50 hover:text-red-400 hover:bg-white/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Proficiency</span>
                  <span className="text-xs font-bold text-white">{skill.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg p-8 rounded-[32px] bg-zinc-950 border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {currentSkill?.id ? "Edit Skill" : "Add New Skill"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Skill Name</label>
                  <input 
                    required
                    value={currentSkill?.name || ""}
                    onChange={(e) => setCurrentSkill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Next.js"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                    <select 
                      value={currentSkill?.category || "Frontend"}
                      onChange={(e) => setCurrentSkill(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option className="bg-zinc-900" value="Frontend">Frontend</option>
                      <option className="bg-zinc-900" value="Backend">Backend</option>
                      <option className="bg-zinc-900" value="Mobile">Mobile</option>
                      <option className="bg-zinc-900" value="Database">Database</option>
                      <option className="bg-zinc-900" value="Design">Design</option>
                      <option className="bg-zinc-900" value="Tools">Tools</option>
                      <option className="bg-zinc-900" value="Payment">Payment</option>
                      <option className="bg-zinc-900" value="Development">Development</option>
                      <option className="bg-zinc-900" value="Creative">Creative</option>
                      <option className="bg-zinc-900" value="Server">Server</option>
                      <option className="bg-zinc-900" value="Marketing">Marketing</option>
                      <option className="bg-zinc-900" value="Data Analysis">Data Analysis</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Level (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={currentSkill?.level || 80}
                      onChange={(e) => setCurrentSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost"
                    className="flex-1 rounded-2xl border border-white/10 text-white font-bold h-12"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-2xl bg-white text-black hover:bg-gray-200 font-bold h-12"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : (currentSkill?.id ? "Check In" : "Confirm")}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
