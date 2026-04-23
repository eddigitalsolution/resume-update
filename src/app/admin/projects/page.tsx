"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  ExternalLink, 
  Code2, 
  Trash2, 
  Edit2,
  Search,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Rocket,
  Globe,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";
import { Project, ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TagInput } from "@/components/admin/TagInput";

export default function AdminProjectsPage() {
  const searchParams = useSearchParams();
  const focusMode = (searchParams.get("type") as 'Freelance' | 'Portfolio') || "Portfolio";
  
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    image_url: "",
    category: "",
    tech_stack: [],
    status: "Draft",
    is_featured: false,
    progress: 0,
    live_url: "",
    github_url: "",
    type: focusMode
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjectsList(data);
    setLoading(false);
  };

   useEffect(() => {
    fetchData();
  }, [focusMode]);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        image_url: project.image_url || "",
        category: project.category || "Web App",
        tech_stack: project.tech_stack || [],
        status: project.status || "Draft",
        is_featured: project.is_featured || false,
        progress: project.progress || 0,
        live_url: project.live_url || "",
         github_url: project.github_url || "",
        type: project.type || focusMode
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        category: focusMode === 'Freelance' ? "Service" : "Web App",
        tech_stack: [],
        status: "Draft",
        is_featured: false,
        progress: 0,
        live_url: "",
        github_url: "",
        type: focusMode
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    let error;
    if (editingProject) {
      const { error: err } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingProject.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('projects')
        .insert([payload]);
      error = err;
    }

    if (error) {
      console.error("Save error:", error.message);
      alert("Failed to save project: " + error.message);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This will also remove it from your resume.")) return;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Delete failed.");
    } else {
      fetchData();
    }
  };

   const filteredProjects = projectsList.filter(p => 
    (p.type === focusMode) && (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const titlePrefix = focusMode === 'Freelance' ? "Project" : "Portfolio";
  const iconColor = focusMode === 'Freelance' ? "text-blue-400" : "text-purple-400";

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{focusMode === 'Freelance' ? "Freelance Projects" : "Skill Portfolio"}</h1>
          <p className="text-gray-400 text-sm">
            {focusMode === 'Freelance' 
              ? "Manage your freelance jobs, contracts, and client deliverables." 
              : "Showcase your tech stack through apps, systems, and creative AI."}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search by title or tech..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-64 text-white" 
            />
          </div>
          <Button 
            onClick={() => handleOpenModal()}
            className="rounded-2xl bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 shadow-lg shadow-white/5"
          >
            <Plus size={20} className="mr-2" /> Launch New
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-20 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
           <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <Rocket className="text-gray-600" size={40} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
           <p className="text-gray-500 max-w-sm mb-8 italic">Your project terminal is clear. Time to launch a new masterpiece into the cloud.</p>
           <Button 
             onClick={() => handleOpenModal()}
             className="rounded-2xl bg-white text-black font-bold h-12 px-8"
           >
             Create First Project
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={project.id}
              className="group p-6 rounded-[32px] bg-zinc-900/40 border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden">
                   {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
                   ) : (
                      <ImageIcon className="text-indigo-400 opacity-40" size={24} />
                   )}
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => handleOpenModal(project)}
                     className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button 
                     onClick={() => handleDelete(project.id)}
                     className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                      project.status === 'Live' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      project.status === 'Past Job' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-zinc-800 text-gray-500 border-white/5"
                   )}>
                      {project.status}
                   </span>
                   {project.is_featured && (
                      <Star size={12} className="text-amber-400 fill-amber-400/20" />
                   )}
                   <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{project.category}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed h-10">{project.description}</p>
              </div>

              <div className="space-y-4 pt-2">
                 <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map(tech => (
                       <span key={tech} className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded-lg text-gray-400 border border-white/5">
                          {tech}
                       </span>
                    ))}
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
                       </div>
                       <span className="text-[10px] font-bold text-gray-600">{project.progress}%</span>
                    </div>
                    <div className="flex gap-3">
                       {project.live_url && <Globe size={14} className="text-gray-600 hover:text-indigo-400 transition-colors" />}
                       {project.github_url && <Code2 size={14} className="text-gray-600 hover:text-indigo-400 transition-colors" />}
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSave} className="p-8 md:p-12 space-y-8 max-h-[90vh] overflow-y-auto">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {editingProject ? `Update ${titlePrefix}` : `Launch New ${titlePrefix}`}
                    </h2>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Project Title</label>
                       <input 
                         required
                         value={formData.title || ""}
                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                         placeholder="Mars Rover Dashboard..."
                       />
                    </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                       <select 
                         value={formData.category}
                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none" 
                       >
                          {focusMode === 'Freelance' ? (
                            <>
                              <option value="Full-stack Job">Full-stack Job</option>
                              <option value="UI/UX Contract">UI/UX Contract</option>
                              <option value="Consulting">Consulting</option>
                              <option value="System Audit">System Audit</option>
                              <option value="Maintenance">Maintenance</option>
                              <option value="Marketing">Marketing</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Automation">Automation</option>
                            </>
                          ) : (
                            <>
                              <option value="Web App">Web App</option>
                              <option value="Internal System">Internal System</option>
                              <option value="AI Tool">AI Tool</option>
                              <option value="Creative Coding">Creative Coding</option>
                              <option value="Mobile App">Mobile App</option>
                            </>
                          )}
                       </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Mission Objective (Description)</label>
                       <textarea 
                         required
                         rows={3}
                         value={formData.description}
                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none" 
                         placeholder="Describe your role and impact..."
                       />
                    </div>

                     <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Tech Stack & Skills</label>
                        <TagInput 
                          value={formData.tech_stack || []}
                          onChange={(tags) => setFormData({ ...formData, tech_stack: tags })}
                          theme={focusMode === 'Freelance' ? 'blue' : 'purple'}
                          placeholder="e.g. Meta Ads, Copywriting..."
                        />
                     </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Progress (%)</label>
                       <input 
                         type="number"
                         max={100}
                         min={0}
                         value={formData.progress}
                         onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Launch Status</label>
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {["Draft", "Live", "In Progress", "Past Job"].map((s) => (
                             <button
                               key={s}
                               type="button"
                               onClick={() => setFormData({ ...formData, status: s as ProjectStatus })}
                               className={cn(
                                  "flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider border transition-all",
                                  formData.status === s 
                                     ? "bg-indigo-600 border-indigo-500 text-white" 
                                     : "bg-black/30 border-white/5 text-gray-500 hover:border-white/10"
                               )}
                             >
                                {s}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Homepage Spotlight</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                          className={cn(
                             "w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-3",
                             formData.is_featured 
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                                : "bg-black/30 border-white/5 text-gray-500 hover:border-white/10"
                          )}
                        >
                           <div className={cn(
                              "h-2 w-2 rounded-full",
                              formData.is_featured ? "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "bg-gray-600"
                           )} />
                           {formData.is_featured ? "Featured on Hero Section" : "Standard Project"}
                        </button>
                     </div>
                    
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Project Thumbnail</label>
                        <ImageUpload 
                          value={formData.image_url}
                          onChange={(url) => setFormData({ ...formData, image_url: url })}
                        />
                     </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Live Deployment</label>
                       <input 
                         value={formData.live_url}
                         onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                         placeholder="https://..."
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Source Repository</label>
                       <input 
                         value={formData.github_url}
                         onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                         placeholder="https://github.com/..."
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/5 flex gap-4">
                    <Button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      variant="ghost" 
                      className="flex-1 rounded-2xl border border-white/5 text-gray-400 h-14 font-bold"
                    >
                       Cancel
                    </Button>
                    <Button 
                      disabled={saving}
                      className="flex-2 rounded-2xl bg-white text-black hover:bg-gray-200 h-14 font-bold shadow-xl shadow-white/5"
                    >
                       {saving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 size={20} className="mr-2" />}
                       {editingProject ? "Confirm Redesign" : "Launch Project"}
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
