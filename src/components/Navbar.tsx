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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" id="nav-logo" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
            {logoInitial}
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">{siteName}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-link-${item.name.toLowerCase()}`}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors hover:text-white",
                pathname === item.href ? "text-white" : "text-gray-400"
              )}
            >
              {pathname === item.href && (
                <motion.div
                  layoutId="navbar-highlight"
                  className="absolute inset-0 z-[-1] rounded-md bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            id="nav-link-admin"
            className="ml-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Admin
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
