"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  Wrench, 
  FileText, 
  GraduationCap,
  Home, 
  LogOut,
  Menu,
  X,
  UserCircle,
  Zap,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const adminNavItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Personal", href: "/admin/personal", icon: UserCircle },
  { name: "Branding", href: "/admin/branding", icon: Zap },
  { name: "Metrics", href: "/admin/metrics", icon: BarChart3 },
  { name: "Projects", href: "/admin/projects?type=Freelance", icon: Briefcase },
  { name: "Portfolio", href: "/admin/projects?type=Portfolio", icon: LayoutDashboard },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Resume", href: "/admin/resume", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Handle screen resize to auto-hide sidebar on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
      else setIsOpen(true);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-black overflow-x-hidden">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: 256, opacity: 1 }}
            exit={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
               "fixed left-0 top-0 h-full border-r border-white/10 bg-zinc-950 flex flex-col p-4 z-50 overflow-hidden shadow-2xl",
               !isMobile && "w-64"
            )}
          >
            <div className="flex items-center justify-between px-2 mb-10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                  A
                </div>
                <span className="font-bold text-lg text-white">Admin Hub</span>
              </div>
              {isMobile && (
                 <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white">
                    <X size={20} />
                 </button>
              )}
            </div>

            <nav className="flex-1 space-y-1">
              {adminNavItems.map((item) => {
                // If the item has a query param, we need to match it exactly
                const isActive = item.href.includes('?') 
                  ? pathname + '?' + searchParams.toString() === item.href
                  : pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                      isActive 
                        ? "bg-white text-black shadow-lg" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-black" : "group-hover:scale-110 transition-transform")} />
                    <span className="whitespace-nowrap">{item.name}</span>
                    {isActive && (
                       <motion.div 
                         layoutId="activeTab"
                         className="absolute right-2 h-1.5 w-1.5 rounded-full bg-indigo-500"
                       />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/5 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 whitespace-nowrap"
              >
                <Home size={18} />
                Visit Website
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors whitespace-nowrap"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main 
        animate={{ 
          paddingLeft: !isMobile && isOpen ? 256 : 0 
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 min-w-0"
      >
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all shadow-inner"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] hidden sm:block">
              {adminNavItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
               ID
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
