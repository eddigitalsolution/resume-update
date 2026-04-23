"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Briefcase, 
  Save, 
  Loader2,
  FileText,
  UserCircle,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface PersonalData {
  full_name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  photo_url: string;
  whatsapp_personal?: string;
}

export default function PersonalAdminPage() {
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: resume } = await supabase
        .from('resume')
        .select('*')
        .limit(1)
        .single();

      if (resume) {
        setResumeId(resume.id);
        setData({
          full_name: resume.full_name || "",
          role: resume.role || "",
          email: resume.email || "",
          phone: resume.phone || "",
          location: resume.location || "",
          summary: resume.summary || "",
          photo_url: resume.photo_url || "",
          whatsapp_personal: resume.whatsapp_personal || "",
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !resumeId) return;
    setSaving(true);

    const { error } = await supabase
      .from('resume')
      .update(data)
      .eq('id', resumeId);

    if (error) {
      console.error("Error saving profile:", error.message);
      alert("Failed to save changes.");
    } else {
      alert("Profile updated successfully!");
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

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Personal Profile</h1>
        <p className="text-gray-400 text-sm">Update your public identity and professional summary.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
               <UserCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Basic Information</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/3 xl:w-1/4 space-y-4">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Profile Photo</label>
               <ImageUpload 
                 value={data?.photo_url}
                 onChange={(url) => setData(prev => ({ ...prev!, photo_url: url }))}
               />
               <p className="text-[10px] text-gray-500 italic px-2">
                 This photo will be used on your public portfolio and ATS-optimized resume. Use a professional headshot for best results.
               </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  required
                  value={data?.full_name || ""}
                  onChange={(e) => setData(prev => ({ ...prev!, full_name: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Professional Role</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  required
                  value={data?.role || ""}
                  onChange={(e) => setData(prev => ({ ...prev!, role: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  required
                  type="email"
                  value={data?.email || ""}
                  onChange={(e) => setData(prev => ({ ...prev!, email: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  required
                  value={data?.phone || ""}
                  onChange={(e) => setData(prev => ({ ...prev!, phone: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Location / Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  required
                  value={data?.location || ""}
                  onChange={(e) => setData(prev => ({ ...prev!, location: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">WhatsApp Personal (International Format)</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    placeholder="e.g. 60123456789"
                    value={data?.whatsapp_personal || ""}
                    onChange={(e) => setData(prev => ({ ...prev!, whatsapp_personal: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
               <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Professional Summary</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Bio / Profile Description</label>
            <textarea 
              rows={8}
              required
              value={data?.summary || ""}
              onChange={(e) => setData(prev => ({ ...prev!, summary: e.target.value }))}
              placeholder="Tell your story..."
              className="w-full bg-black/50 border border-white/10 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none leading-relaxed"
            />
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button 
            disabled={saving}
            type="submit"
            className="rounded-[24px] bg-white text-black hover:bg-gray-200 font-bold h-14 px-10 text-lg shadow-xl"
          >
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={20} />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
