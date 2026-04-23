"use client";

import { useEffect, useLayoutEffect } from "react";

export function PrintShell({ children }: { children: React.ReactNode }) {
  // Use useLayoutEffect to ensure styles are applied before first paint
  // avoiding a "flash" of dark mode during print snapshots.
  useLayoutEffect(() => {
    // Save original styles
    const originalBodyClasses = document.body.className;
    const originalHtmlClasses = document.documentElement.className;

    // Apply print-specific root classes
    // We remove 'dark' and 'bg-black' to ensure a white background.
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-black', 'text-gray-100', 'flex', 'flex-col');
    document.body.classList.add('bg-white', 'text-black', 'overflow-visible', 'h-auto', 'min-h-0');

    // Add a global style to hide the Navbar/Footer without moving them in the DOM
    const style = document.createElement('style');
    style.id = 'print-shell-styles';
    style.innerHTML = `
      nav, footer, .no-print-global {
        display: none !important;
      }
      main {
        padding: 0 !important;
        margin: 0 !important;
      }
      body {
        background-color: white !important;
        color: black !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Restore original state
      document.body.className = originalBodyClasses;
      document.documentElement.className = originalHtmlClasses;
      document.documentElement.classList.add('dark');
      const styleTag = document.getElementById('print-shell-styles');
      if (styleTag) styleTag.remove();
    };
  }, []);

  return <>{children}</>;
}
