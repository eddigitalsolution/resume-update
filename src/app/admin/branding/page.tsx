"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Save, 
  Loader2, 
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { ResumeData } from "@/types";

export default function BrandingPage() {
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

  const updateConfig = (field: string, value: string) => {
    if (!data) return;
    const newConfig = { ...(data.homepage_config || {}), [field]: value };
    setData({ ...data, homepage_config: newConfig });
  };

  const handleSave = async () => {
    if (!data || !data.id) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("resume")
      .update({
        homepage_config: data.homepage_config
      })
      .eq("id", data.id);

    if (error) {
      console.error("Error saving branding:", error.message);
    }
    setSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Homepage Branding</h1>
            <p className="text-gray-400 text-xs md:text-sm">Manage your site's core narrative and headlines.</p>
          </div>
        </div>
        <Button 
          className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold px-8 py-6 sm:py-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="p-6 md:p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Hero Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Headline Part 1 (Primary Impact)</label>
                <input 
                  placeholder="e.g. Scale Your Business."
                  value={data.homepage_config?.hero_headline_part1 || ""}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                  onChange={(e) => updateConfig('hero_headline_part1', e.target.value)}
                />
             </div>
             <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Headline Part 2 (Technical Innovation)</label>
                <input 
                  placeholder="e.g. Innovate Your Tech."
                  value={data.homepage_config?.hero_headline_part2 || ""}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                  onChange={(e) => updateConfig('hero_headline_part2', e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Availability / Status Badge</label>
                <input 
                  value={data.homepage_config?.hero_availability || ""}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                  onChange={(e) => updateConfig('hero_availability', e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Primary CTA Text</label>
                <input 
                  value={data.homepage_config?.hero_cta_primary || ""}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                  onChange={(e) => updateConfig('hero_cta_primary', e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Section Narratives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Freelance Section */}
           <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-4">Freelance & Growth</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Badge Label</label>
                    <input 
                      placeholder="e.g. Client Success"
                      value={data.homepage_config?.freelance_label || ""}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                      onChange={(e) => updateConfig('freelance_label', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Section Title</label>
                    <input 
                      value={data.homepage_config?.freelance_title || ""}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                      onChange={(e) => updateConfig('freelance_title', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Narrative Description</label>
                    <textarea 
                      value={data.homepage_config?.freelance_description || ""}
                      rows={4}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white resize-none transition-all shadow-inner" 
                      onChange={(e) => updateConfig('freelance_description', e.target.value)}
                    />
                 </div>
              </div>
           </div>

           {/* Portfolio Section */}
           <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-b border-white/5 pb-4">Engineering & AI</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Badge Label</label>
                    <input 
                      placeholder="e.g. Engineering & AI"
                      value={data.homepage_config?.portfolio_label || ""}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                      onChange={(e) => updateConfig('portfolio_label', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Section Title</label>
                    <input 
                      value={data.homepage_config?.portfolio_title || ""}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                      onChange={(e) => updateConfig('portfolio_title', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Technical Summary</label>
                    <textarea 
                      value={data.homepage_config?.portfolio_description || ""}
                      rows={4}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white resize-none transition-all shadow-inner" 
                      onChange={(e) => updateConfig('portfolio_description', e.target.value)}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* SEO & Global Branding */}
        <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-4">SEO & Global Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Site SEO Title</label>
                <input 
                  value={data.homepage_config?.seo_title || ""}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                  onChange={(e) => updateConfig('seo_title', e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Global Site Name</label>
                <input 
                  value={data.homepage_config?.site_name || ""}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                  onChange={(e) => updateConfig('site_name', e.target.value)}
                />
             </div>
             <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Global Meta Description</label>
                <textarea 
                  value={data.homepage_config?.seo_description || ""}
                  rows={2}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white resize-none transition-all shadow-inner" 
                  onChange={(e) => updateConfig('seo_description', e.target.value)}
                />
             </div>
          </div>
        </div>
        
        {/* Portfolio Page Header */}
        <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Portfolio Page Header</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Page Title</label>
                 <input 
                   placeholder="e.g. Work & Creativity"
                   value={data.homepage_config?.portfolio_page_title || ""}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                   onChange={(e) => updateConfig('portfolio_page_title', e.target.value)}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Page Description</label>
                 <textarea 
                   placeholder="Describe your portfolio focus..."
                   value={data.homepage_config?.portfolio_page_description || ""}
                   rows={3}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white resize-none transition-all shadow-inner" 
                   onChange={(e) => updateConfig('portfolio_page_description', e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Skills Page Header */}
        <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Skills Page Header</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Page Title</label>
                 <input 
                   placeholder="e.g. Technical Skills"
                   value={data.homepage_config?.skills_page_title || ""}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                   onChange={(e) => updateConfig('skills_page_title', e.target.value)}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Page Description</label>
                 <textarea 
                   placeholder="Summarize your technical expertise..."
                   value={data.homepage_config?.skills_page_description || ""}
                   rows={3}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white resize-none transition-all shadow-inner" 
                   onChange={(e) => updateConfig('skills_page_description', e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Progress Page Header */}
        <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Live Progress Header</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Page Title</label>
                 <input 
                   placeholder="e.g. Live Progress"
                   value={data.homepage_config?.progress_page_title || ""}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                   onChange={(e) => updateConfig('progress_page_title', e.target.value)}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Page Description</label>
                 <textarea 
                   placeholder="Tell them what you're building right now..."
                   value={data.homepage_config?.progress_page_description || ""}
                   rows={3}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white resize-none transition-all shadow-inner" 
                   onChange={(e) => updateConfig('progress_page_description', e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Dynamic Contact Options */}
        <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Quick Ask Options</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-xl border-white/10 hover:bg-white/5 text-xs h-8"
              onClick={() => {
                if (!data) return;
                const options = [...(data.homepage_config?.contact_options || [])];
                options.push({ label: "New Option", message: "Hi! I'm interested in..." });
                setData({ ...data, homepage_config: { ...data.homepage_config, contact_options: options } });
              }}
            >
              Add Option
            </Button>
          </div>
          
          <div className="space-y-4">
            {data.homepage_config?.contact_options?.map((opt, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 relative group">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Label</label>
                  <input 
                    value={opt.label}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-green-500 outline-none text-white transition-all shadow-inner" 
                    onChange={(e) => {
                      const options = [...(data.homepage_config?.contact_options || [])];
                      options[idx].label = e.target.value;
                      setData({ ...data, homepage_config: { ...data.homepage_config, contact_options: options } });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Pre-filled Message</label>
                  <input 
                    value={opt.message}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-green-500 outline-none text-white transition-all shadow-inner" 
                    onChange={(e) => {
                      const options = [...(data.homepage_config?.contact_options || [])];
                      options[idx].message = e.target.value;
                      setData({ ...data, homepage_config: { ...data.homepage_config, contact_options: options } });
                    }}
                  />
                </div>
                <button 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const options = data.homepage_config?.contact_options?.filter((_, i) => i !== idx);
                    setData({ ...data, homepage_config: { ...data.homepage_config, contact_options: options } });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {(!data.homepage_config?.contact_options || data.homepage_config.contact_options.length === 0) && (
              <p className="text-center py-8 text-gray-600 text-xs italic">No dynamic options added yet. Click "Add Option" to start.</p>
            )}
          </div>
        </div>

        {/* Contact Links */}
        <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Business Contact</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">WhatsApp Business (International Format)</label>
                 <input 
                   placeholder="e.g. 60123456789"
                   value={data.homepage_config?.whatsapp_business || ""}
                   className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner" 
                   onChange={(e) => updateConfig('whatsapp_business', e.target.value)}
                 />
                 <p className="text-[10px] text-gray-500 italic pl-1">This will be used for the "Contact Me" buttons on the Progress and Portfolio pages.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
