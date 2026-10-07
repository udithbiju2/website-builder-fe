import { useEffect, useRef, useState } from "react";
import { useEditor } from "../editor-context.ts";

export function getSectionTargetElement(state: {
  sectionIndex?: number;
  sectionType?: string | null;
  targetId?: string | null;
}): HTMLElement | null {
  try {
    const iframes = Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe"));
    for (const iframe of iframes) {
      try {
        const doc = iframe.contentDocument;
        if (!doc) continue;

        if (state.targetId) {
          const elById = doc.querySelector<HTMLElement>(`[data-puck-id="${state.targetId}"], #${state.targetId}`);
          if (elById) {
            return elById.closest<HTMLElement>(".wb-editor-section-wrap, [data-puck-component]") || elById;
          }
        }

        const sectionElements = Array.from(
          doc.querySelectorAll<HTMLElement>(".wb-editor-section-wrap, [data-puck-component]")
        );

        if (typeof state.sectionIndex === "number" && sectionElements[state.sectionIndex]) {
          return sectionElements[state.sectionIndex];
        }

        if (sectionElements.length > 0) {
          return sectionElements[sectionElements.length - 1];
        }
      } catch {}
    }

    // Fallback host document search
    if (state.targetId) {
      const elById = document.querySelector<HTMLElement>(`[data-puck-id="${state.targetId}"], #${state.targetId}`);
      if (elById) return elById.closest<HTMLElement>(".wb-editor-section-wrap, [data-puck-component]") || elById;
    }
    const hostSections = Array.from(document.querySelectorAll<HTMLElement>(".wb-editor-section-wrap, [data-puck-component]"));
    if (typeof state.sectionIndex === "number" && hostSections[state.sectionIndex]) {
      return hostSections[state.sectionIndex];
    }
    if (hostSections.length > 0) {
      return hostSections[hostSections.length - 1];
    }
  } catch {
    // ignore cross-origin safely
  }
  return null;
}

export function scrollCanvasToSection(state: {
  sectionIndex?: number;
  sectionType?: string | null;
  targetId?: string | null;
}) {
  try {
    const iframes = Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe"));
    for (const iframe of iframes) {
      try {
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow;
        if (!doc) continue;

        const el = getSectionTargetElement(state);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
          if (win) {
            const rect = el.getBoundingClientRect();
            const currentScroll = win.pageYOffset || doc.documentElement.scrollTop || 0;
            const targetScroll = currentScroll + rect.top - (win.innerHeight / 2) + (rect.height / 2);
            win.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
          }
          return;
        }
      } catch {}
    }

    const hostEl = getSectionTargetElement(state);
    if (hostEl) {
      hostEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  } catch {
    // ignore
  }
}

export function scrollCanvasToBottom() {
  try {
    const iframes = Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe"));
    for (const iframe of iframes) {
      try {
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow;
        if (doc && win) {
          const maxScroll = Math.max(
            doc.body?.scrollHeight || 0,
            doc.documentElement?.scrollHeight || 0
          );
          win.scrollTo({ top: maxScroll, behavior: "smooth" });
          return;
        }
      } catch {}
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } catch {}
}

type TrackedRect = {
  top: number;
  height: number;
  left: number;
  width: number;
} | null;

export default function AiBuilderCanvasOverlay() {
  const { aiBuilding } = useEditor();
  const [visible, setVisible] = useState(false);
  const [renderedState, setRenderedState] = useState(aiBuilding);
  const [motionTick, setMotionTick] = useState(0);
  const [trackedRect, setTrackedRect] = useState<TrackedRect>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (aiBuilding?.active) {
      setRenderedState(aiBuilding);
      setVisible(true);
    } else if (visible) {
      // Graceful 400ms fade out when completed, then vanish
      const timer = setTimeout(() => {
        setVisible(false);
        setRenderedState(null);
        setTrackedRect(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [aiBuilding, visible]);

  // Real-time dynamic pointer trajectory across the section / canvas
  useEffect(() => {
    if (!aiBuilding?.active) return;
    const interval = setInterval(() => {
      setMotionTick((t) => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [aiBuilding?.active]);

  // Track target section bounding rectangle in 60fps frame loop
  useEffect(() => {
    if (!aiBuilding?.active && !visible) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const updateRect = () => {
      if (renderedState) {
        const el = getSectionTargetElement(renderedState);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.height > 10) {
            setTrackedRect({
              top: Math.max(0, r.top),
              height: Math.max(120, r.height),
              left: Math.max(0, r.left),
              width: r.width || 800,
            });
          }
        }
      }
      rafRef.current = requestAnimationFrame(updateRect);
    };

    rafRef.current = requestAnimationFrame(updateRect);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [aiBuilding?.active, visible, renderedState]);

  if (!visible && !aiBuilding?.active) return null;

  const isDone = !aiBuilding?.active;

  // Wide graceful sweeping curve across active section area
  const xSpan = trackedRect ? Math.max(160, (trackedRect.width - 60) * 0.45) : 320;
  const ySpan = trackedRect ? Math.max(50, (trackedRect.height - 40) * 0.4) : 90;

  const offsetX = Math.sin(motionTick * 0.25) * xSpan + Math.cos(motionTick * 0.12) * (xSpan * 0.2);
  const offsetY = Math.cos(motionTick * 0.2) * ySpan + Math.sin(motionTick * 0.08) * (ySpan * 0.15);

  let pointerTop = 200;
  let pointerLeft = 400;
  let boxTop = "25%";
  let boxHeight = "40%";
  let boxLeft = "16px";
  let boxWidth = "calc(100% - 32px)";

  if (trackedRect) {
    boxTop = `${trackedRect.top}px`;
    boxHeight = `${trackedRect.height}px`;
    boxLeft = `${Math.max(4, trackedRect.left + 4)}px`;
    boxWidth = `${Math.max(200, trackedRect.width - 8)}px`;

    pointerTop = trackedRect.top + trackedRect.height * 0.5 + offsetY;
    pointerLeft = trackedRect.left + trackedRect.width * 0.5 + offsetX;
  } else {
    const baseYPercent = renderedState?.pointerY ?? 40;
    boxTop = `${Math.max(5, baseYPercent - 15)}%`;
    boxHeight = "35%";
    pointerTop = (window.innerHeight * (baseYPercent + offsetY * 0.2)) / 100;
    pointerLeft = window.innerWidth * 0.5 + offsetX;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-40 overflow-hidden select-none transition-all duration-300 ${
        isDone ? "opacity-0 scale-98 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Blueprint Grid & Ambient Laser Field */}
      <div
        className="absolute inset-0 transition-all duration-300 bg-radial-[circle_at_50%_50%] from-cyan-500/10 via-blue-500/5 to-transparent"
        style={{
          backgroundPosition: `${pointerLeft}px ${pointerTop}px`,
        }}
      />

      {/* Active Section Hologram Bounding Box Tracing */}
      <div
        className="absolute rounded-xl border border-cyan-400/35 bg-cyan-500/[0.02] shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all duration-300 ease-out"
        style={{
          top: boxTop,
          height: boxHeight,
          left: boxLeft,
          width: boxWidth,
        }}
      >
        {/* Corner Neon Bracket Accents */}
        <div className="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#38bdf8]" />
        <div className="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#38bdf8]" />
        <div className="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#38bdf8]" />
        <div className="absolute -bottom-1 -right-1 size-3 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#38bdf8]" />
      </div>

      {/* Laser Scanline Beam sweeping across active section */}
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8,0_0_30px_#2563eb] transition-all duration-200 ease-out"
        style={{
          top: `${pointerTop}px`,
          transform: "translateY(-50%)",
        }}
      >
        <div className="absolute inset-0 bg-white/90 blur-[0.5px]" />
      </div>

      {/* Realistic 2026 AI Agent Crisp Arrow Pointer */}
      <div
        className="absolute transition-all duration-100 ease-out z-50 pointer-events-none select-none"
        style={{
          top: `${pointerTop}px`,
          left: `${pointerLeft}px`,
          transform: "translate(-2px, -2px)",
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Distinct, crisp, sharp neon cursor arrow */}
          <svg
            className="size-7 text-cyan-400 drop-shadow-[0_2px_10px_rgba(34,211,238,0.9)]"
            viewBox="0 0 24 24"
            fill="#22d3ee"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <polygon points="3,2 21,9 12,12 9,21" />
          </svg>
        </div>
      </div>
    </div>
  );
}

