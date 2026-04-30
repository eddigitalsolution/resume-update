"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  className?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  bucket = "portfolio",
  className 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    // Enforce 4MB size limit (matches UI hint)
    if (file.size > 4 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 4MB.");
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      const error = err as Error;
      console.error("Upload error:", error.message);
      alert("Error uploading file. Make sure the 'portfolio' bucket exists and is public.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative h-48 rounded-[32px] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 group",
          dragActive ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 bg-black/40 hover:border-white/20",
          value && "border-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <NextImage 
                src={value} 
                alt="Upload Preview" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="flex gap-2">
                    <button 
                       type="button"
                       onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                       }}
                       className="p-3 rounded-2xl bg-white text-black hover:bg-gray-200 shadow-xl transition-all"
                    >
                       <Upload size={18} />
                    </button>
                    <button 
                       type="button"
                       onClick={(e) => {
                          e.stopPropagation();
                          onChange("");
                       }}
                       className="p-3 rounded-2xl bg-red-500 text-white hover:bg-red-400 shadow-xl transition-all"
                    >
                       <X size={18} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-6"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                   <Loader2 className="animate-spin text-indigo-500" size={32} />
                   <p className="text-sm font-bold text-indigo-400 animate-pulse">Launching to Cloud...</p>
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <ImageIcon className="text-gray-500 group-hover:text-white" size={24} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Click or Drop Image</p>
                  <p className="text-[10px] text-gray-500">PNG, JPG or WebP (max 4MB)</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {!value && !isUploading && (
         <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <p className="text-[10px] text-indigo-400 leading-relaxed font-medium italic">
               Files are stored in your secure Supabase storage and accessible via public URL.
            </p>
         </div>
      )}
    </div>
  );
}
