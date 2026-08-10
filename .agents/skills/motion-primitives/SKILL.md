---
name: motion-primitives
description: "Guidelines, copy-paste components, and Framer Motion integration rules for motion-primitives (animated components for React/Next.js/Tailwind CSS)."
---

# Motion Primitives - Animation Guide

Motion Primitives is an open-source library of pre-built, customizable, and beautifully animated React/Next.js/Tailwind CSS components built on top of Framer Motion. It operates on a "copy-paste" design philosophy (similar to shadcn/ui).

## Installation & Setup

Before copying components, ensure your project has the required dependencies:

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

### Utility Helper (cn)
Verify you have the standard `cn` utility in `src/lib/utils.ts` (or equivalent):

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Component Implementation Patterns

### 1. Animated Tabs (LayoutGroup Transitions)
Use Framer Motion's `layoutId` for smooth hover/active slide animations between tabs.

```tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

export function AnimatedTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
            activeTab === tab.id
              ? "text-zinc-950 dark:text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-white dark:bg-zinc-900 shadow rounded-lg"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
```

### 2. Dialog / Morphing Modal
Smooth modal transitions using `AnimatePresence` and custom scale/fade transitions.

```tsx
import { motion, AnimatePresence } from "framer-motion";

export function Dialog({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md overflow-hidden bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

## Best Practices & Performance

1. **Reduced Motion**: Respect user OS accessibility settings. Wrap animations in checks or use Framer Motion's `useReducedMotion` hook.
   ```tsx
   import { useReducedMotion } from "framer-motion";
   const shouldReduceMotion = useReducedMotion();
   const animate = shouldReduceMotion ? {} : { opacity: 1, scale: 1 };
   ```
2. **GPU Acceleration**: Animate `transform` (translate, scale, rotate) and `opacity` properties. Avoid animating `width`, `height`, or positioning headers (`top`/`left`) directly as they cause layout recalculations (reflows).
3. **Exit Animations**: Always wrap components with conditional rendering inside `<AnimatePresence>` to allow `exit` properties to trigger correctly.
4. **LayoutId Scoping**: Always place `<LayoutGroup>` around nested items with duplicate `layoutId`s to prevent unintended animation cross-talk.
