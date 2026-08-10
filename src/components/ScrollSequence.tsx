"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 250;

const formatFramePath = (index: number) => {
  const pad = String(index).padStart(3, "0");
  return `/frame/ezgif-frame-${pad}.jpg`;
};

export function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep loaded images cache in mutable ref to avoid React render lags
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    // 1. Preload all sequence frames
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadingProgress(pct);

      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = loadedImages;
        setIsLoaded(true);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = formatFramePath(i);
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad;
      loadedImages.push(img);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper to draw a frame centering it like object-fit: cover
    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img) return;

      const devicePixelRatio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Adjust canvas backing store size for sharp high-DPI screens
      if (canvas.width !== width * devicePixelRatio || canvas.height !== height * devicePixelRatio) {
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        drawWidth = canvas.height * imgRatio;
        drawX = (canvas.width - drawWidth) / 2;
      } else {
        // Image is taller than canvas
        drawHeight = canvas.width / imgRatio;
        drawY = (canvas.height - drawHeight) / 2;
      }

      // 1. Draw frame
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // 2. Inpaint/erase the baked-in Gemini star logo in the bottom-right corner.
      const sx = 1060;
      const sy = 510;
      const sw = 60;
      const sh = 110;

      const dx = drawX + (1120 / 1280) * drawWidth;
      const dy = drawY + (510 / 720) * drawHeight;
      const dw = (60 / 1280) * drawWidth;
      const dh = (110 / 720) * drawHeight;

      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    // Draw initial frame
    renderFrame(0);

    // Setup resize handler
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);

    // 2. Map scroll progress to sequence frames using GSAP ScrollTrigger
    const airpodsObj = { frame: 0 };
    
    const scrollAnimation = gsap.to(airpodsObj, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(airpodsObj.frame))
          );
          currentFrameRef.current = frameIndex;
          renderFrame(frameIndex);
        },
      },
    });

    // 3. Animate overlay glassmorphic titles as scroll trigger markers
    // Slide 1 is visible by default, so we fade it out first, then transition the next ones.
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    titleTimeline
      .to(".seq-title-1", { opacity: 0, y: -40, duration: 1 })
      .to(".seq-title-2", { opacity: 1, y: 0, duration: 1 })
      .to(".seq-title-2", { opacity: 0, y: -40, duration: 1 }, "+=0.5")
      .to(".seq-title-3", { opacity: 1, y: 0, duration: 1 })
      .to(".seq-title-3", { opacity: 0, y: -40, duration: 1 }, "+=0.5");

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollAnimation.scrollTrigger?.kill();
      titleTimeline.scrollTrigger?.kill();
    };
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ height: "400vh" }}
    >
      {/* SVG Convolution Sharpen Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="sharpenFilter">
            {/* 3x3 subtle sharpening kernel */}
            <feConvolveMatrix 
              order="3" 
              kernelMatrix="0 -0.4 0 -0.4 2.6 -0.4 0 -0.4 0" 
              preserveAlpha="true"
            />
          </filter>
        </defs>
      </svg>

      {/* Preloader overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 transition-opacity duration-500">
          <div className="flex flex-col items-center gap-6 max-w-xs w-full px-6">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border-[3px] border-zinc-800" />
              <div className="absolute h-full w-full rounded-full border-[3px] border-t-emerald-400 border-r-emerald-500 animate-spin" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                Preloading Sequence
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {loadingProgress}%
              </span>
            </div>

            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-150 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center px-4 md:px-8">
        
        {/* Responsive layout container (flex-col on mobile, flex-row on desktop) */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-4">
          
          {/* ── Text overlays (outside left on desktop, below on mobile) ── */}
          <div className="relative w-full max-w-md h-60 md:h-75 order-2 md:order-1 flex flex-col justify-start md:justify-center items-start text-left mt-4 md:mt-0 shrink-0 pointer-events-none">
            
            {/* Slide 1 - Fully visible by default on scroll entry */}
            <div className="seq-title-1 opacity-100 translate-y-0 absolute inset-0 flex flex-col items-start justify-center gap-3">
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                Process Audit
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                Systems Architecture
              </h3>
              <ul className="flex flex-col gap-2.5 mt-3 text-sm md:text-base text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Auditing runtime latency & render flows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Profiling database & cache bottlenecks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Optimizing client-side bundle structures</span>
                </li>
              </ul>
            </div>

            {/* Slide 2 */}
            <div className="seq-title-2 opacity-0 translate-y-8 absolute inset-0 flex flex-col items-start justify-center gap-3">
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                Automation Flow
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                Performance Optimization
              </h3>
              <ul className="flex flex-col gap-2.5 mt-3 text-sm md:text-base text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Mapping complex real-time data streams</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Automating manual operation sequences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Deploying AI-agent reasoning models</span>
                </li>
              </ul>
            </div>

            {/* Slide 3 */}
            <div className="seq-title-3 opacity-0 translate-y-8 absolute inset-0 flex flex-col items-start justify-center gap-3">
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                AI Engineering
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                Full-Scale Integrations
              </h3>
              <ul className="flex flex-col gap-2.5 mt-3 text-sm md:text-base text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Structuring secure transactional pipelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Scaling node networks & cloud instances</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span>Integrating cross-platform endpoints</span>
                </li>
              </ul>
            </div>

          </div>

          {/* ── Contained, Sharp 16:9 Frame (Desktop right, mobile top) ── */}
          <div className="w-full max-w-3xl aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl bg-zinc-950 flex items-center justify-center order-1 md:order-2 shrink-0">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover"
              style={{ filter: "url(#sharpenFilter)" }}
            />
            {/* Vignette Overlay for aesthetic blending */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
}
