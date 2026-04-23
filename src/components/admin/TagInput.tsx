"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Hash, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  theme?: 'blue' | 'purple' | 'indigo';
}

export function TagInput({ 
  value = [], 
  onChange, 
  placeholder = "Add tech stack...",
  className,
  theme = 'indigo'
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase.from('skills').select('name');
      if (data) {
        setAllSkills(data.map(s => s.name));
      }
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    if (input.trim()) {
      const filtered = allSkills.filter(s => 
        s.toLowerCase().includes(input.toLowerCase()) && 
        !value.includes(s)
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input, allSkills, value]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/40",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40"
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-black/40 border border-white/10 rounded-2xl focus-within:border-indigo-500/50 transition-all">
        <AnimatePresence>
          {value.map((tag) => (
            <motion.span
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={tag}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                colors[theme]
              )}
            >
              <Hash size={12} className="opacity-50" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        
        <div className="relative flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : "Add more..."}
            className="w-full h-full bg-transparent border-none focus:outline-none text-sm text-white px-2 py-1 placeholder:text-gray-600"
          />

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 bottom-full mb-2 w-full max-w-[200px] bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
              >
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 py-1 mb-1 flex items-center gap-2 border-b border-white/5">
                  <Search size={10} /> Suggestions
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addTag(s)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <Plus size={12} />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
