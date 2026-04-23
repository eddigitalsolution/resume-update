"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Download, 
  Plus, 
  Minus,
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  Layout,
  FileText,
  Save,
  Printer,
  Loader2,
  CheckCircle2,
  Rocket,
  BarChart3,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";
import { Experience, Education, ResumeData, Project } from "@/types";

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "info";
  
  const [data, setData] = useState<ResumeData | null>(null);
  const [dbSkills, setDbSkills] = useState<{id: string, name: string}[]>([]);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch skills from the skills table
      const { data: skillsTable } = await supabase
        .from('skills')
        .select('id, name')
        .order('name');
      
      if (skillsTable) setDbSkills(skillsTable);

      // Fetch active and past projects from the projects table
      const { data: projectsTable } = await supabase
        .from('projects')
        .select('*')
        .in('status', ['Live', 'Past Job'])
        .order('created_at', { ascending: false });

      if (projectsTable) setDbProjects(projectsTable);

      // Fetch THE latest resume record (or any record if only one)
      const { data: resume } = await supabase
        .from('resume')
        .select('*')
        .order('id', { ascending: true }) // Stable sort
        .limit(1)
        .maybeSingle(); // Better than .single() as it won't throw if empty

      if (resume) {
        setResumeId(resume.id);
        setData({
          id: resume.id,
          fullName: resume.full_name || "",
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

  useEffect(() => {
    const updateConstraints = () => {
      if (tabsRef.current && scrollRef.current) {
        const scrollWidth = tabsRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        const scrollable = scrollWidth - clientWidth;
        setConstraints({ left: scrollable > 0 ? -scrollable : 0, right: 0 });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    // Extra check after short delay to ensure DOM is settled
    const timer = setTimeout(updateConstraints, 500);
    
    return () => {
      window.removeEventListener("resize", updateConstraints);
      clearTimeout(timer);
    };
  }, [data, activeTab]); // Recalculate if tab changes too

  const updateData = (field: keyof ResumeData, value: any) => {
    if (!data) return;
    setData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSave = async () => {
    if (!data || !resumeId) return;
    setSaving(true);
    
    const updatePayload: any = {
      full_name: data.fullName,
      role: data.role,
      email: data.email,
      phone: data.phone,
      location: data.location,
      summary: data.summary,
      experience: data.experience,
      skills: data.skills,
      education: data.education,
      projects: (data.projects || []).filter(item => typeof item === 'string'),
      stats: data.stats || [],
      homepage_config: data.homepage_config || {}
    };

    // Use UPSERT to ensure it either updates the existing record or creates it
    // We include the ID to ensure we're targeting the right row
    const { data: result, error } = await supabase
      .from('resume')
      .upsert({
        id: resumeId,
        ...updatePayload,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error saving resume:', error.message);
      alert(`Error: ${error.message}`);
    } else {
      alert('Your resume has been officially updated in the database! 🚀');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (!data) return <div className="text-white">No resume found. Seed the database first.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] overflow-x-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ATS Resume Builder</h1>
          <p className="text-gray-400 text-sm">Create a professional, ATS-optimized resume.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-white/10 hover:bg-white/5 font-bold"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link
            href="/resume/print"
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl bg-white text-black hover:bg-gray-200 font-bold px-6 py-2 transition-colors"
          >
            <Printer size={18} className="mr-2" /> Download PDF
          </Link>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Left: Editor Form */}
        <div className="w-1/2 overflow-y-auto pr-4 space-y-8 pb-10 min-w-0">
          <div 
            ref={scrollRef}
            className="bg-white/5 border border-white/10 rounded-2xl sticky top-0 z-10 backdrop-blur-md overflow-hidden group cursor-grab active:cursor-grabbing"
          >
            <motion.div 
              ref={tabsRef}
              drag="x"
              dragConstraints={constraints}
              dragElastic={0.1}
              className="flex gap-1 p-1 w-max"
            >
              {[
                { id: "info", icon: User, label: "Personal" },
                { id: "exp", icon: Briefcase, label: "Experience" },
                { id: "freelance", icon: Rocket, label: "Freelance" },
                { id: "portfolio", icon: Code, label: "Portfolio" },
                { id: "skills", icon: CheckCircle2, label: "Skills" },
                { id: "edu", icon: GraduationCap, label: "Education" },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={cn(
                    "flex-none flex items-center justify-center gap-2 py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap select-none",
                    activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg h-10" : "text-gray-500 hover:text-white h-10"
                  )}
                  onPointerDown={(e) => e.stopPropagation()} 
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </motion.div>
          </div>

          <div className="space-y-6">
            {activeTab === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                       <input 
                        value={data.fullName}
                        onChange={(e) => updateData('fullName', e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Role</label>
                       <input 
                        value={data.role}
                        onChange={(e) => updateData('role', e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-white" 
                      />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
                       <input 
                        value={data.email}
                        onChange={(e) => updateData('email', e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone</label>
                       <input 
                        value={data.phone}
                        onChange={(e) => updateData('phone', e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors text-white" 
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Summary</label>
                    <textarea 
                      rows={6}
                      value={data.summary}
                      onChange={(e) => updateData('summary', e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-colors resize-none text-white" 
                    />
                 </div>
              </motion.div>
            )}

            {activeTab === 'exp' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="p-6 pt-10 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                    <button 
                      className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Delete Experience"
                      onClick={() => {
                        const newExp = [...data.experience];
                        newExp.splice(idx, 1);
                        updateData('experience', newExp);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Company</label>
                        <input 
                          placeholder="Company"
                          value={exp.company}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none text-white" 
                          onChange={(e) => {
                            const newExp = [...data.experience];
                            newExp[idx].company = e.target.value;
                            updateData('experience', newExp);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Period</label>
                        <input 
                          placeholder="Period (e.g. 2020 - 2022)"
                          value={exp.period}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none text-white" 
                          onChange={(e) => {
                            const newExp = [...data.experience];
                            newExp[idx].period = e.target.value;
                            updateData('experience', newExp);
                          }}
                        />
                      </div>
                    </div>
                    <input 
                      placeholder="Role"
                      value={exp.role}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none text-white" 
                      onChange={(e) => {
                        const newExp = [...data.experience];
                        newExp[idx].role = e.target.value;
                        updateData('experience', newExp);
                      }}
                    />

                    {/* Bullet Points Editor */}
                    <div className="space-y-3 pt-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Key Responsibilities</label>
                       <div className="space-y-2">
                          {(exp.desc || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-2 items-center">
                               <input 
                                 value={bullet}
                                 className="flex-1 bg-black/30 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                                 onChange={(e) => {
                                    const newExp = [...data.experience];
                                    newExp[idx].desc[bIdx] = e.target.value;
                                    updateData('experience', newExp);
                                 }}
                               />
                               <button 
                                 onClick={() => {
                                    const newExp = [...data.experience];
                                    newExp[idx].desc.splice(bIdx, 1);
                                    updateData('experience', newExp);
                                 }}
                                 className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
                               >
                                  <Minus size={14} />
                               </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                               const newExp = [...data.experience];
                               if (!newExp[idx].desc) newExp[idx].desc = [];
                               newExp[idx].desc.push("");
                               updateData('experience', newExp);
                            }}
                            className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors pl-1"
                          >
                             <Plus size={12} /> Add Point
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full border border-dashed border-white/10 rounded-xl py-8 hover:bg-white/5 text-gray-400 shadow-none h-auto"
                  onClick={() => {
                    updateData('experience', [...data.experience, { company: '', role: '', period: '', desc: [] }]);
                  }}
                >
                  <Plus size={18} className="mr-2" /> Add Experience
                </Button>
              </motion.div>
            )}

            {(activeTab === 'freelance' || activeTab === 'portfolio') && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* ... specific content ... */}
                  {(() => {
                     const type = activeTab === 'freelance' ? 'Freelance' : 'Portfolio';
                     const typeProjects = dbProjects.filter(p => p.type === type);
                     
                     return (
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                 {type === 'Freelance' ? 'Select Client Jobs' : 'Select Technical Lab Entries'}
                              </label>
                              <Link 
                                href={`/admin/projects?type=${type}`} 
                                className={cn("text-[10px] font-bold hover:underline", type === 'Freelance' ? "text-blue-400" : "text-purple-400")}
                              >
                                 Manage Master List &rarr;
                              </Link>
                           </div>

                           <div className="grid grid-cols-1 gap-3">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                   const projectIds = typeProjects.map(p => p.id);
                                   // Add these IDs to existing selected projects if not already there
                                   const currentOnes = [...(data.projects || [])];
                                   const filteredCurrent = currentOnes.filter(id => !projectIds.includes(id));
                                   updateData('projects', [...filteredCurrent, ...projectIds]);
                                }}
                                className={cn(
                                   "border-dashed h-10 text-[10px] uppercase tracking-widest font-bold",
                                   type === 'Freelance' ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/5" : "border-purple-500/30 text-purple-400 hover:bg-purple-500/5"
                                )}
                              >
                                 <Plus size={14} className="mr-2" /> Select All {type} Content
                              </Button>

                              {typeProjects.length === 0 ? (
                                <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center">
                                   <p className="text-xs text-gray-500">No {type} projects found in your database.</p>
                                </div>
                              ) : (
                                typeProjects.map((project) => {
                                   const isSelected = data.projects?.includes(project.id);
                                   return (
                                      <button
                                        key={project.id}
                                        onClick={() => {
                                           const newProjects = isSelected 
                                              ? (data.projects || []).filter(id => id !== project.id)
                                              : [...(data.projects || []), project.id];
                                           updateData('projects', newProjects);
                                        }}
                                        className={cn(
                                          "flex items-center justify-between w-full px-6 py-4 rounded-2xl border text-sm font-bold transition-all text-left",
                                          isSelected 
                                             ? (type === 'Freelance' ? "bg-blue-600/10 border-blue-500 text-white" : "bg-purple-600/10 border-purple-500 text-white")
                                             : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                                        )}
                                      >
                                         <div className="flex flex-col gap-1">
                                            <span>{project.title}</span>
                                            <span className="text-[10px] font-normal opacity-50">{project.category}</span>
                                         </div>
                                         {isSelected && <CheckCircle2 size={18} className={type === 'Freelance' ? "text-blue-400" : "text-purple-400"} />}
                                      </button>
                                   );
                                })
                              )}
                           </div>
                           
                           <div className={cn(
                              "p-4 rounded-2xl border text-[10px] leading-relaxed italic",
                              type === 'Freelance' ? "bg-blue-500/5 border-blue-500/10 text-blue-300" : "bg-purple-500/5 border-purple-500/10 text-purple-300"
                           )}>
                              {type === 'Freelance' 
                                 ? "Synchronized with your Client Jobs history. Select projects that prove your business impact and professional reliability." 
                                 : "Synchronized with your Technical Lab. Select projects that demonstrate your engineering depth, AI expertise, and architectural skills."
                              }
                           </div>
                        </div>
                     );
                  })()}
               </motion.div>
            )}

            {activeTab === 'skills' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Included Skills</label>
                     <Link href="/admin/skills" className="text-[10px] font-bold text-indigo-400 hover:underline">Manage Skill Library &rarr;</Link>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     <Button 
                       variant="outline" 
                       onClick={() => {
                          const allNames = dbSkills.map(s => s.name);
                          updateData('skills', allNames);
                       }}
                       className="col-span-full border-dashed border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/5 h-10 text-[10px] uppercase tracking-widest font-bold mb-2"
                     >
                        <CheckCircle2 size={14} className="mr-2" /> Select All Skills from Library
                     </Button>

                     {dbSkills.map((skill) => {
                        const isSelected = data.skills.includes(skill.name);
                        return (
                           <button
                             key={skill.id}
                             onClick={() => {
                                const newSkills = isSelected 
                                   ? data.skills.filter(s => s !== skill.name)
                                   : [...data.skills, skill.name];
                                updateData('skills', newSkills);
                             }}
                             className={cn(
                               "flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all",
                               isSelected 
                                  ? "bg-indigo-600/10 border-indigo-500 text-white" 
                                  : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                             )}
                           >
                              {skill.name}
                              {isSelected && <CheckCircle2 size={14} className="text-indigo-400" />}
                           </button>
                        );
                     })}
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-indigo-300 leading-relaxed italic">
                     These skills are synchronized with your master skills list. Deselect a skill here to hide it from your ATS resume without deleting it from your database.
                  </div>
              </motion.div>
           )}

            {activeTab === 'edu' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {(data.education || []).map((edu, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                    <button 
                      className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 transition-colors"
                      onClick={() => {
                        const newEdu = [...data.education];
                        newEdu.splice(idx, 1);
                        updateData('education', newEdu);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">University / School</label>
                        <input 
                          placeholder="e.g. Stanford University"
                          value={edu.school}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 text-white" 
                          onChange={(e) => {
                            const newEdu = [...data.education];
                            newEdu[idx].school = e.target.value;
                            updateData('education', newEdu);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Degree</label>
                          <input 
                            placeholder="e.g. B.S. Computer Science"
                            value={edu.degree}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 text-white" 
                            onChange={(e) => {
                              const newEdu = [...data.education];
                              newEdu[idx].degree = e.target.value;
                              updateData('education', newEdu);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Period</label>
                          <input 
                            placeholder="e.g. 2018 - 2022"
                            value={edu.period}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 text-white" 
                            onChange={(e) => {
                              const newEdu = [...data.education];
                              newEdu[idx].period = e.target.value;
                              updateData('education', newEdu);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full border border-dashed border-white/10 rounded-xl py-8 hover:bg-white/5 text-gray-400 shadow-none h-auto"
                  onClick={() => {
                    updateData('education', [...(data.education || []), { school: '', degree: '', period: '' }]);
                  }}
                >
                  <Plus size={18} className="mr-2" /> Add University / Education
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-1/2 flex flex-col min-h-0 relative">
           <div className="flex items-center gap-2 mb-4 px-2">
             <Layout size={16} className="text-indigo-400" />
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ATS Preview</span>
           </div>
           <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 overflow-y-auto p-[5%] bg-white text-black font-serif">
                <div className="max-w-full mx-auto">
                    <div className="flex items-center gap-6 border-b-[1.5px] border-black pb-4 mb-6">
                       {data.photo_url && (
                          <div className="h-16 w-16 rounded-full overflow-hidden border border-black/10 shrink-0">
                             <img src={data.photo_url} alt={data.fullName} className="h-full w-full object-cover" />
                          </div>
                       )}
                       <div className="flex-1 text-center">
                          <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">{data.fullName}</h1>
                          <div className="text-[10px] space-x-2 text-gray-700">
                             <span>{data.role}</span>
                             <span>•</span>
                             <span>{data.location}</span>
                             <span>•</span>
                             <span>{data.email}</span>
                             <span>•</span>
                             <span>{data.phone}</span>
                          </div>
                       </div>
                    </div>

                   <div className="mb-6">
                      <h2 className="text-xs font-bold uppercase border-b border-black mb-2 py-0.5 tracking-wider font-sans">Summary</h2>
                      <p className="text-[10px] leading-relaxed text-gray-800">{data.summary}</p>
                   </div>

                   <div className="mb-6">
                      <h2 className="text-xs font-bold uppercase border-b border-black mb-3 py-0.5 tracking-wider font-sans">Experience</h2>
                      <div className="space-y-4 text-gray-800">
                         {data.experience.map((exp, i) => (
                           <div key={i}>
                              <div className="flex justify-between items-baseline mb-1">
                                 <h3 className="text-[11px] font-bold">{exp.company}</h3>
                                 <span className="text-[10px] italic">{exp.period}</span>
                              </div>
                              <p className="text-[10px] font-medium italic mb-1.5">{exp.role}</p>
                              <ul className="list-disc ml-4 space-y-1">
                                 {(exp.desc || []).map((d, j) => (
                                   <li key={j} className="text-[10px] leading-relaxed">{d}</li>
                                 ))}
                              </ul>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Projects Duality Split */}
                   {[
                     { label: "Freelance Success", type: "Freelance" },
                     { label: "Engineering Portfolio", type: "Portfolio" }
                   ].map((section) => {
                     const sectionProjects = dbProjects.filter(p => data.projects?.includes(p.id) && p.type === section.type);
                     if (sectionProjects.length === 0) return null;
                     
                     return (
                        <div key={section.type} className="mb-6">
                           <h2 className="text-xs font-bold uppercase border-b border-black mb-3 py-0.5 tracking-wider font-sans">{section.label}</h2>
                           <div className="space-y-4 text-gray-800">
                             {sectionProjects.map((p, i) => (
                               <div key={i}>
                                 <div className="flex justify-between items-baseline mb-1">
                                   <h3 className="text-[11px] font-bold">{p.title}</h3>
                                   <span className="text-[10px] italic">{p.category}</span>
                                 </div>
                                 <p className="text-[10px] leading-relaxed italic mb-1">Tech: {p.tech_stack.join(", ")}</p>
                                 <p className="text-[10px] leading-relaxed">{p.description}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                     );
                   })}

                   <div className="mb-6">
                      <h2 className="text-xs font-bold uppercase border-b border-black mb-2 py-0.5 tracking-wider font-sans">Skills</h2>
                      <p className="text-[10px] leading-relaxed text-gray-800 font-medium">
                         {data.skills.filter(s => s && s.trim() !== "").join(" • ")}
                      </p>
                   </div>

                   <div>
                      <h2 className="text-xs font-bold uppercase border-b border-black mb-3 py-0.5 tracking-wider font-sans">Education</h2>
                      <div className="space-y-3 text-gray-800">
                         {(data.education || []).map((edu, i) => (
                           <div key={i} className="flex justify-between items-baseline">
                              <div>
                                 <h3 className="text-[11px] font-bold">{edu.school}</h3>
                                 <p className="text-[10px] italic">{edu.degree}</p>
                              </div>
                              <span className="text-[10px]">{edu.period}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
  );
}
