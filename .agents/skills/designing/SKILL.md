---
name: designing
description: "Master UI/UX design, visual aesthetics, dark-mode glassmorphism, typography, motion primitives, and responsive layout standards for this project."
---

# Designing Skill & Guidelines

This skill provides comprehensive visual design rules, aesthetic principles, and UI standards for building high-end web applications in Next.js, Tailwind CSS, and Framer Motion.

## 1. Visual Aesthetics & Design System

### Core Palette & Glassmorphism
- Use deep dark mode backdrops (`bg-black`, `bg-zinc-950`, `bg-zinc-900/50`).
- Apply subtle glassmorphism borders (`border border-white/10`, `border-white/5`).
- Incorporate subtle hover glows (`hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]`, `hover:border-indigo-500/40`).

### Typography & Hierarchy
- Clean, bold, high-contrast headings (`font-black`, `tracking-tight`, `text-white`).
- Uppercase tracking labels (`text-[10px] font-bold tracking-widest text-zinc-500 uppercase`).
- Legible body copy (`text-zinc-400`, `leading-relaxed`).

### Micro-Animations & Interactivity
- Staggered entrances with `framer-motion` (`initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`).
- Hover scaling on icons and interactive elements (`group-hover:scale-110 transition-transform`).
- Smooth LayoutGroup tab indicators with `layoutId`.

---

## 2. Component Guidelines

- **Cards**: High-end rounded corners (`rounded-3xl` or `rounded-[32px]`), subtle gradients, interactive hover states.
- **Buttons**: Pill/rounded styling (`rounded-xl` or `rounded-full`), clear active states, loading indicators (`Loader2 animate-spin`).
- **Lists & Grids**: Responsive grid columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

---

## 3. Quality Standards

- Avoid plain, default browser styling.
- Prevent layout shifts and text wrapping artifacts.
- Ensure all interactive elements have hover and focus states.
