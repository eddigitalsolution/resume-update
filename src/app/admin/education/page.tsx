"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  GraduationCap, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Calendar,
  University,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { Education } from "@/types";

export default function EducationAdminPage() {
  const [eduList, setEduList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdu, setCurrentEdu] = useState< Education | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchEducation();
  }, []);

  async function fetchEducation() {
    setLoading(true);
    const { data, error } = await supabase
      .from('resume')
      .select('id, education')
      .limit(1)
      .single();

    if (data) {
      setResumeId(data.id);
      setEduList(data.education || []);
    }
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdu?.school || !currentEdu?.degree || !resumeId) return;
    setSaving(true);

    let newList = [...eduList];
    if (editIndex !== null) {
      newList[editIndex] = currentEdu;
    } else {
      newList = [...newList, currentEdu];
    }

    const { error } = await supabase
      .from('resume')
      .update({ education: newList })
      .eq('id', resumeId);

    if (!error) {
      setEduList(newList);
      setIsModalOpen(false);
      setEditIndex(null);
    } else {
      console.error("Error saving education:", error);
    }
    setSaving(false);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Remove this education record?") || !resumeId) return;

    const newList = eduList.filter((_, i) => i !== index);
    
    const { error } = await supabase
      .from('resume')
      .update({ education: newList })
      .eq('id', resumeId);

    if (!error) {
      setEduList(newList);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Education History</h1>
          <p className="text-gray-400 text-sm">Manage your academic credentials and certifications.</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentEdu({ school: "", degree: "", period: "" });
            setEditIndex(null);
            setIsModalOpen(true);
          }}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-6 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} className="mr-2" /> Add Institution
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {eduList.length === 0 ? (
            <div className="p-12 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
               <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <GraduationCap className="text-gray-500" size={32} />
               </div>
               <h3 className="text-white font-bold text-lg mb-1">No education records</h3>
               <p className="text-gray-500 text-sm max-w-xs">Start by adding your first university or certification.</p>
            </div>
          ) : (
            eduList.map((edu, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="group relative p-6 rounded-[28px] bg-zinc-900/40 border border-white/10 hover:border-indigo-500/30 transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setCurrentEdu(edu);
                      setEditIndex(i);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(i)}
                    className="p-2 rounded-xl bg-white/5 text-red-500/50 hover:text-red-400 hover:bg-white/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <University className="text-indigo-400" size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{edu.school}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <GraduationCap size={16} className="text-indigo-500/50" />
                        {edu.degree}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Calendar size={16} className="text-indigo-500/50" />
                        {edu.period}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
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
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl p-10 rounded-[40px] bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {editIndex !== null ? "Edit Institution" : "Add Institution"}
                  </h2>
                  <p className="text-sm text-gray-500">Provide details about your academic background.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">University / School Name</label>
                  <input 
                    required
                    value={currentEdu?.school || ""}
                    onChange={(e) => setCurrentEdu(prev => ({ ...prev!, school: e.target.value }))}
                    placeholder="e.g. Stanford University"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Degree / Certification</label>
                    <input 
                      required
                      value={currentEdu?.degree || ""}
                      onChange={(e) => setCurrentEdu(prev => ({ ...prev!, degree: e.target.value }))}
                      placeholder="e.g. B.S. Computer Science"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Time Period</label>
                    <input 
                      required
                      value={currentEdu?.period || ""}
                      onChange={(e) => setCurrentEdu(prev => ({ ...prev!, period: e.target.value }))}
                      placeholder="e.g. 2018 — 2022"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost"
                    className="flex-1 rounded-[22px] border border-white/10 text-white font-bold h-14 hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-[22px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 shadow-lg shadow-indigo-500/20"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : (editIndex !== null ? "Save Changes" : "Confirm Addition")}
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
