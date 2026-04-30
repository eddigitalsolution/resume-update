"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Skills", href: "/skills" },
  { name: "Progress", href: "/progress" },
];

export function Navbar({ siteName = "Portfolio", logoInitial = "P" }: { siteName?: string, logoInitial?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show navbar on admin pages or print route
  if (pathname.startsWith("/admin") || pathname === "/resume/print") {
    return null;
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-2xl glow-border">
        <Link href="/" id="nav-logo" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg group-hover:rotate-6 transition-all duration-500">
            {logoInitial}
          </div>
          <span className="text-xl font-black tracking-tighter text-white hidden sm:block uppercase">{siteName}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-link-${item.name.toLowerCase()}`}
              className={cn(
                "relative px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all hover:text-white",
                pathname === item.href ? "text-white" : "text-gray-400"
              )}
            >
              {pathname === item.href && (
                <motion.div
                  layoutId="navbar-highlight"
                  className="absolute inset-0 z-[-1] rounded-full bg-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.name}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/10 mx-4" />
          <Link
            href="/login"
            id="nav-link-admin"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
          >
            Admin 
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          id="mobile-menu-toggle"
          className="flex md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <motion.div 
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-current rounded-full" 
            />
            <motion.div 
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-current rounded-full" 
            />
            <motion.div 
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-current rounded-full" 
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-b border-white/5"
      >
        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              id={`mobile-nav-link-${item.name.toLowerCase()}`}
              className={cn(
                "text-2xl font-bold transition-colors",
                pathname === item.href ? "text-indigo-400" : "text-gray-500"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            id="mobile-nav-link-admin"
            className="text-2xl font-bold text-white mt-4 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            Admin Access
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}
