"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Invalid login credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-3xl text-white shadow-2xl shadow-indigo-500/40 mx-auto mb-6"
          >
            A
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Gateway</h1>
          <p className="text-gray-500 text-sm">Secure access to the Professional Duality Dashboard.</p>
        </div>

        <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute inset-0 rounded-[40px] bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner placeholder:text-gray-700" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all shadow-inner placeholder:text-gray-700" 
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-3"
              >
                <AlertCircle size={16} className="shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            <Button 
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-white text-black hover:bg-gray-100 font-bold text-sm shadow-xl shadow-white/5 transition-all relative overflow-hidden group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            <ShieldCheck size={14} className="text-gray-700" />
            Direct Encryption
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            Supabase Protected
          </div>
        </div>
      </motion.div>
    </div>
  );
}
