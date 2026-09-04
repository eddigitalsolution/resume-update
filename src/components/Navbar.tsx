"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Skills", href: "/skills" },
  { name: "Progress", href: "/progress" },
  { name: "Gallery", href: "/gallery" },
];

export function Navbar({
  siteName = "Portfolio",
  logoInitial = "P",
}: {
  siteName?: string;
  logoInitial?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show navbar on admin pages or print route
  if (pathname.startsWith("/admin") || pathname === "/resume/print") {
    return null;
  }

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-300">
      <nav
        className={cn(
          "relative rounded-full px-3.5 py-2 flex items-center justify-between transition-all duration-500",
          "bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
          scrolled ? "border-white/15 bg-black/90 shadow-[0_20px_60px_rgba(0,0,0,0.95)]" : ""
        )}
      >
        {/* Brand Logo */}
        <Link 
          href="/" 
          id="nav-logo" 
          onClick={handleHomeClick}
          className="flex items-center gap-3 pl-2 group"
        >
          <div className="relative h-8 w-8 rounded-full bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-xs text-white">
              {logoInitial}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              {siteName}
            </span>
            <span className="text-[9px] font-semibold text-zinc-400 tracking-wider flex items-center gap-1">
              Craftsman <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-full border border-white/5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isHome = item.href === "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-link-${item.name.toLowerCase()}`}
                onClick={isHome ? handleHomeClick : undefined}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full",
                  isActive
                    ? "text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 z-[-1] rounded-full bg-white/10 border border-white/15 shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Admin Link */}
        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            id="nav-link-admin"
            className="group relative px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white rounded-full bg-zinc-900 border border-white/10 hover:border-indigo-500/50 hover:bg-zinc-850 transition-all shadow-md flex items-center gap-2"
          >
            <ShieldCheck size={13} className="text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            <span>Admin</span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          id="mobile-menu-toggle"
          className="flex md:hidden p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between items-center relative">
            <motion.span
              animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-current rounded-full transition-transform"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-current rounded-full"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-current rounded-full transition-transform"
            />
          </div>
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mt-2 rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isHome = item.href === "/";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    id={`mobile-nav-link-${item.name.toLowerCase()}`}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between",
                      isActive
                        ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                    onClick={isHome ? handleHomeClick : () => setIsOpen(false)}
                  >
                    <span>{item.name}</span>
                    {isActive && <Sparkles size={13} className="text-indigo-400" />}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-white/5" />

              <Link
                href="/login"
                id="mobile-nav-link-admin"
                className="px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-zinc-900 border border-white/10 flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-indigo-400" />
                  <span>Admin Access</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
