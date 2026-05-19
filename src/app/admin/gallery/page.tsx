"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2,
  Search,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Palette,
  Clipboard,
  Check,
  AlertTriangle,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";
import { GalleryItem } from "@/types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";

const MIGRATION_SQL = `-- CREATE GALLERY TABLE, HELPER FUNCTIONS & POLICIES
-- 1. Create is_admin helper function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE (user_id = auth.uid() OR email = auth.jwt() ->> 'email')
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  prompt TEXT,
  type TEXT NOT NULL DEFAULT 'AI Image',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Access Policy
DROP POLICY IF EXISTS "Allow public read-only access to gallery" ON gallery;
CREATE POLICY "Allow public read-only access to gallery" ON gallery FOR SELECT USING (true);

-- 5. Create Admin Edit Access Policy using non-recursive is_admin() helper
DROP POLICY IF EXISTS "Allow all actions for authenticated users on gallery" ON gallery;
CREATE POLICY "Allow all actions for authenticated users on gallery" ON gallery FOR ALL USING (public.is_admin());`;

export default function AdminGalleryPage() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: "",
    description: "",
    image_url: "",
    prompt: "",
    type: "AI Image"
  });

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Fetch gallery error:", error);
      if (error.code === '42P01') { // relation does not exist
        setDbError(true);
      } else {
        alert("Failed to load gallery: " + error.message);
      }
    } else {
      setGalleryList(data || []);
      setDbError(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || "",
        description: item.description || "",
        image_url: item.image_url || "",
        prompt: item.prompt || "",
        type: item.type || "AI Image"
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        prompt: "",
        type: "AI Image"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Please upload or provide an image URL.");
      return;
    }
    setSaving(true);

    const payload = {
      ...formData,
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      prompt: formData.prompt?.trim(),
      updated_at: new Date().toISOString()
    };

    let error;
    if (editingItem) {
      const { error: err } = await supabase
        .from('gallery')
        .update(payload)
        .eq('id', editingItem.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('gallery')
        .insert([payload]);
      error = err;
    }

    if (error) {
      console.error("Save gallery item error:", error.message);
      alert("Failed to save gallery item: " + error.message);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Delete failed.");
    } else {
      fetchData();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const copyPromptText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const filteredItems = galleryList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Design & AI Gallery</h1>
          <p className="text-gray-400 text-sm">
            Showcase your AI art, landing page designs, and video creation screenshots alongside their prompts.
          </p>
        </div>
        {!dbError && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search gallery..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-full text-white" 
              />
            </div>
            <Button 
              onClick={() => handleOpenModal()}
              className="rounded-2xl bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 shadow-lg shadow-white/5 w-full sm:w-auto"
            >
              <Plus size={20} className="mr-2" /> Showcase New
            </Button>
          </div>
        )}
      </div>

      {dbError ? (
        <div className="rounded-[40px] border border-amber-500/20 bg-amber-500/5 p-8 lg:p-12 space-y-6 max-w-4xl">
          <div className="flex gap-4 items-start">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
               <AlertTriangle className="text-amber-400" size={24} />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white mb-2">Database Migration Required</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 The <code>gallery</code> table does not exist in your Supabase database. Please copy the SQL query below, navigate to your <strong>Supabase Dashboard &gt; SQL Editor</strong>, paste it, click <strong>Run</strong>, and then refresh this page to begin managing your gallery!
               </p>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 font-mono text-xs text-gray-300 p-6 leading-relaxed max-h-72 overflow-y-auto">
            <pre className="whitespace-pre">{MIGRATION_SQL}</pre>
            <button 
              onClick={() => copyToClipboard(MIGRATION_SQL)}
              className="absolute top-4 right-4 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95"
            >
              {copiedSql ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Copied!</span>
                </>
              ) : (
                <>
                  <Clipboard size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Copy SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="flex justify-end pt-4">
             <Button 
               onClick={fetchData}
               className="rounded-xl bg-white text-black font-bold h-12 px-6"
             >
                I Run the SQL, Refresh Now
             </Button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-20 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
           <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <Palette className="text-gray-600" size={40} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Your showcase is empty</h3>
           <p className="text-gray-500 max-w-sm mb-8 italic">Showcase your amazing AI artwork, landing page graphics, and video projects for clients.</p>
           <Button 
             onClick={() => handleOpenModal()}
             className="rounded-2xl bg-white text-black font-bold h-12 px-8"
           >
             Showcase First Design
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id}
              className="group p-5 rounded-[32px] bg-zinc-900/40 border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col gap-5 justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-video rounded-2xl bg-zinc-950 overflow-hidden border border-white/5 relative">
                   {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   ) : (
                      <ImageIcon className="text-indigo-400 opacity-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={24} />
                   )}
                   <span className={cn(
                      "absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/10",
                      item.type === 'AI Image' ? "bg-purple-500/80 text-white" : 
                      item.type === 'Design' ? "bg-blue-500/80 text-white" :
                      "bg-emerald-500/80 text-white"
                   )}>
                      {item.type}
                   </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed h-8">{item.description}</p>
                  )}
                </div>

                {item.prompt && (
                  <div className="rounded-xl bg-black/40 border border-white/5 p-3 relative group/prompt min-h-[50px] flex items-center">
                    <p className="text-[10px] font-mono text-gray-500 line-clamp-2 pr-6 leading-relaxed select-all">
                       {item.prompt}
                    </p>
                    <button 
                      onClick={() => copyPromptText(item.id, item.prompt || "")}
                      className="absolute right-2 top-2 p-1.5 rounded-lg bg-zinc-900 text-gray-400 hover:text-white border border-white/10 transition-all"
                      title="Copy Prompt"
                    >
                      {copiedPromptId === item.id ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Clipboard size={12} />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                 <button 
                   onClick={() => handleOpenModal(item)}
                   className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold border border-white/5"
                 >
                   <Edit2 size={12} /> Edit
                 </button>
                 <button 
                   onClick={() => handleDelete(item.id)}
                   className="py-2.5 px-4 rounded-xl bg-red-500/5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center border border-red-500/10"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Item Modal */}
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
              className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSave} className="p-8 md:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {editingItem ? "Update Showcase" : "Showcase New Asset"}
                    </h2>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Title</label>
                         <input 
                           required
                           value={formData.title || ""}
                           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                           placeholder="Cosmic Cyberpunk Girl..."
                         />
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                         <select 
                           value={formData.type}
                           onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none" 
                         >
                            <option value="AI Image">AI Image</option>
                            <option value="Design">Design</option>
                            <option value="Video SS">Video SS</option>
                         </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Description (Optional)</label>
                       <textarea 
                         rows={2}
                         value={formData.description || ""}
                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none" 
                         placeholder="Short context about the creation..."
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Generation Prompt (Optional)</label>
                       <textarea 
                         rows={3}
                         value={formData.prompt || ""}
                         onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                         className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none" 
                         placeholder="/imagine prompt: highly detailed 3d render, cyberpunk fashion, cinematic lighting --ar 16:9..."
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Asset Image</label>
                       <ImageUpload 
                         value={formData.image_url}
                         onChange={(url) => setFormData({ ...formData, image_url: url })}
                       />
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5 flex gap-4">
                    <Button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      variant="ghost" 
                      className="flex-1 rounded-2xl border border-white/5 text-gray-400 h-12 font-bold"
                    >
                       Cancel
                    </Button>
                    <Button 
                      disabled={saving}
                      className="flex-1 rounded-2xl bg-white text-black hover:bg-gray-200 h-12 font-bold shadow-xl shadow-white/5"
                    >
                       {saving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                       {editingItem ? "Update Asset" : "Publish Asset"}
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
