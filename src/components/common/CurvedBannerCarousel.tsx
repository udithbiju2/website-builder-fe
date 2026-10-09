import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { Play } from "lucide-react";

export type CurvedBannerItem = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  image: string;
  videoUrl?: string;
  author?: string;
  aspectRatio?: string;
  alt?: string;
};

export type CurvedBannerCarouselProps = {
  items?: CurvedBannerItem[];
  direction?: "left-to-right" | "right-to-left";
  speed?: number; // base speed in pixels per second
  pauseOnHover?: boolean;
  interactive?: boolean; // drag / swipe support
  curveIntensity?: "none" | "subtle" | "medium" | "dramatic";
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  className?: string;
  onItemClick?: (item: CurvedBannerItem) => void;
};

export const DEFAULT_BANNER_ITEMS: CurvedBannerItem[] = [
  {
    id: "coastal-cliff",
    title: "Cliffside Explorer",
    subtitle: "Cinematic drone capture on coastal cliffs",
    badge: "Travel",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&h=1050&q=85",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    author: "@marco_travels",
    alt: "Person sitting on rocky coastal cliffs looking at azure sea",
  },
  {
    id: "skincare-spa",
    title: "Aesthetic Wellness",
    subtitle: "Facial foam skincare gentle treatment",
    badge: "Beauty",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@glow_studios",
    alt: "Person receiving relaxing aesthetic foam facial skincare treatment",
  },
  {
    id: "citrus-flatlay",
    title: "Vibrant Harvest",
    subtitle: "Grapefruits, lemons and fresh citrus fruits",
    badge: "Food & Drink",
    image:
      "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@citrus_kitchen",
    alt: "Sliced grapefruits and fresh lemons on rustic board",
  },
  {
    id: "smoothie-bowl",
    title: "Morning Routine",
    subtitle: "Organic acai bowl with fresh berries & granola",
    badge: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@nourish_daily",
    alt: "Smiling woman enjoying fresh smoothie bowl with spoon",
  },
  {
    id: "motorcycle-ride",
    title: "Night Highway",
    subtitle: "Cinematic motorcycle ride over suspension bridge",
    badge: "Automotive",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@riders_journal",
    alt: "Motorcyclist cruising through bridge highway with headlights",
  },
  {
    id: "fresh-juice",
    title: "Artisan Refresh",
    subtitle: "Cold pressed orange juice in morning sunshine",
    badge: "Culinary",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@fresh_press",
    alt: "Hands pouring fresh squeezed orange juice into a glass jar",
  },
  {
    id: "creator-studio",
    title: "Golden Hour Studio",
    subtitle: "Behind the lens with top video storytellers",
    badge: "Creator",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@sarah_creates",
    alt: "Creator in studio setting with warm cinematic lighting",
  },
  {
    id: "street-fashion",
    title: "Urban Motion",
    subtitle: "High fashion editorial lookbook in motion",
    badge: "Fashion",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&h=1050&q=85",
    author: "@tokyo_street",
    alt: "Traveler standing near scenic landscape overlooking vista",
  },
];

export default function CurvedBannerCarousel({
  items = DEFAULT_BANNER_ITEMS,
  direction = "left-to-right",
  speed = 42,
  pauseOnHover = true,
  interactive = true,
  curveIntensity = "medium",
  cardWidth = 240,
  cardHeight = 350,
  gap = 20,
  className = "",
  onItemClick,
}: CurvedBannerCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Duplicated items for endless looping (3 sets)
  const duplicatedItems = items.concat(items, items);
  const totalItemCount = duplicatedItems.length;
  const setWidth = items.length * (cardWidth + gap);

  // Position and momentum refs (avoiding React state re-render loop for 60/120fps)
  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastDragXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Curve multiplier based on intensity
  const curveFactor =
    curveIntensity === "none"
      ? 0
      : curveIntensity === "subtle"
        ? 0.55
        : curveIntensity === "dramatic"
          ? 1.45
          : 1.0;

  // Active modal preview state
  const [activePreview, setActivePreview] = useState<CurvedBannerItem | null>(null);

  // Update physical transforms on the card DOM nodes
  const updateTransforms = useCallback(
    (offset: number) => {
      const container = containerRef.current;
      if (!container) return;

      const viewportWidth =
        container.clientWidth || container.offsetWidth || 1040;
      const viewportCenter = viewportWidth / 2;
      const step = cardWidth + gap;
      const totalWidth = totalItemCount * step;

      for (let i = 0; i < totalItemCount; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        // Calculate card's raw X position wrapped in an infinite seamless window
        let cardX = (i * step + offset) % totalWidth;
        if (cardX < -step * 2) {
          cardX += totalWidth;
        } else if (cardX > totalWidth - step) {
          cardX -= totalWidth;
        }

        // Center position of this card relative to the carousel viewport
        const cardCenter = cardX + cardWidth / 2;
        const normDistance = (cardCenter - viewportCenter) / Math.max(1, viewportCenter);

        // Cylindrical 3D perspective math matching the exact reference banner:
        // 1. rotateY: Cards on left rotate towards center (negative angle), cards on right rotate towards center (positive angle)
        const rotY = normDistance * 20 * curveFactor;

        // 2. rotateZ: Subtle natural tilt along the arc
        const rotZ = normDistance * 3.8 * curveFactor;

        // 3. translateY: Smooth parabolic/catenary curve lifting the outer cards
        const archElevation = -Math.pow(Math.abs(normDistance), 1.6) * 16 * curveFactor;

        // 4. scale: Center cards slightly more prominent
        const scale = 1 - Math.min(0.12, Math.abs(normDistance) * 0.05 * curveFactor);

        // 5. translateZ: Receding depth
        const transZ = -Math.abs(normDistance) * 36 * curveFactor;

        // Apply hardware-accelerated 3D matrix / transform
        el.style.transform = `translate3d(${cardX}px, ${archElevation}px, ${transZ}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
        el.style.zIndex = String(100 - Math.min(90, Math.round(Math.abs(normDistance) * 40)));
      }
    },
    [cardWidth, gap, totalItemCount, curveFactor]
  );

  // Main high-performance Animation Loop
  useEffect(() => {
    let running = true;

    const tick = (now: number) => {
      if (!running) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000); // capped delta time in seconds
      lastTimeRef.current = now;

      // Handle drag inertia decay when user releases drag
      if (!isDraggingRef.current) {
        if (Math.abs(dragVelocityRef.current) > 0.5) {
          offsetRef.current += dragVelocityRef.current * dt;
          dragVelocityRef.current *= Math.pow(0.88, dt * 60); // smooth friction
        } else {
          dragVelocityRef.current = 0;
          // Normal auto-scroll if not hovered (or if pauseOnHover is false)
          const isPaused = pauseOnHover && isHoveredRef.current;
          if (!isPaused) {
            const dirMultiplier = direction === "left-to-right" ? 1 : -1;
            offsetRef.current += dirMultiplier * speed * dt;
          }
        }

        // Keep offset bounded to avoid large numbers while preserving seamless loop
        if (setWidth > 0) {
          if (offsetRef.current >= setWidth) {
            offsetRef.current -= setWidth;
          } else if (offsetRef.current < 0) {
            offsetRef.current += setWidth;
          }
        }
      }

      updateTransforms(offsetRef.current);
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [direction, speed, pauseOnHover, setWidth, updateTransforms]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      updateTransforms(offsetRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateTransforms]);

  // Mouse & Touch Drag Interaction Handlers
  const handlePointerDown = (clientX: number) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    lastDragXRef.current = clientX;
    dragVelocityRef.current = 0;
  };

  const handlePointerMove = (clientX: number) => {
    if (!interactive || !isDraggingRef.current) return;
    const delta = clientX - lastDragXRef.current;
    lastDragXRef.current = clientX;
    offsetRef.current += delta;
    dragVelocityRef.current = delta * 50; // estimate velocity
    updateTransforms(offsetRef.current);
  };

  const handlePointerUp = () => {
    if (!interactive) return;
    isDraggingRef.current = false;
  };

  const onMouseDown = (e: ReactMouseEvent) => {
    if (e.button !== 0) return; // primary mouse button only
    handlePointerDown(e.clientX);
  };

  const onMouseMove = (e: ReactMouseEvent) => {
    handlePointerMove(e.clientX);
  };

  const onMouseUp = () => {
    handlePointerUp();
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerDown(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    handlePointerUp();
  };

  const handleCardClick = (item: CurvedBannerItem) => {
    // If user was dragging significantly, ignore the click
    if (Math.abs(lastDragXRef.current - dragStartXRef.current) > 8) {
      return;
    }
    if (onItemClick) {
      onItemClick(item);
    } else {
      setActivePreview(item);
    }
  };

  return (
    <div
      className={`relative w-full select-none overflow-hidden py-4 ${className}`}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        handlePointerUp();
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        cursor: interactive ? (isDraggingRef.current ? "grabbing" : "grab") : "default",
      }}
      aria-label="Interactive 3D Video Carousel Banner"
    >
      {/* 3D Curved Perspective Stage */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full"
        style={{
          height: `${cardHeight + 40}px`,
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            onClick={() => handleCardClick(item)}
            className="group absolute top-5 left-0 will-change-transform"
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              transformOrigin: "center center",
              transition: "box-shadow 0.25s ease, filter 0.25s ease",
            }}
          >
            {/* Outer Card with Rounded Bevel and Shadow */}
            <div
              className="relative h-full w-full overflow-hidden rounded-[26px] bg-ink/10 transition-transform duration-300 group-hover:scale-[1.025]"
              style={{
                boxShadow:
                  "0 20px 38px -12px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.18) inset",
              }}
            >
              {/* Media Image */}
              <img
                src={item.image}
                alt={item.alt || item.title}
                loading={idx < 8 ? "eager" : "lazy"}
                draggable={false}
                className="h-full w-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle top and bottom gradient overlays */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Category / Badge */}
              {item.badge && (
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-ink backdrop-blur-md shadow-sm">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Play Icon Badge on Hover */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
                <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg backdrop-blur-md transition-transform duration-200 group-hover:scale-110">
                  <Play className="size-5 fill-current ml-0.5" />
                </span>
              </div>

              {/* Bottom Creator / Title Metadata */}
              <div className="absolute bottom-0 inset-x-0 z-10 p-4 text-white">
                {item.author && (
                  <p className="text-[11px] font-medium tracking-wide text-white/85 drop-shadow-sm">
                    {item.author}
                  </p>
                )}
                <h4 className="text-sm font-bold tracking-tight text-white drop-shadow-md line-clamp-1">
                  {item.title}
                </h4>
              </div>

              {/* Gloss shine highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-white/25 ring-inset" />
            </div>
          </div>
        ))}
      </div>

      {/* Video / Card Preview Lightbox Modal */}
      {activePreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                  {activePreview.badge || "Video Reel"}
                </span>
                <h3 className="text-lg font-bold text-ink">{activePreview.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="size-8 rounded-full border border-line bg-canvas hover:bg-line text-ink flex items-center justify-center text-sm font-semibold transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Media */}
            <div className="relative aspect-[9/14] max-h-[65vh] w-full bg-black">
              {activePreview.videoUrl ? (
                <video
                  src={activePreview.videoUrl}
                  poster={activePreview.image}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={activePreview.image}
                  alt={activePreview.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between bg-surface px-5 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{activePreview.author}</p>
                {activePreview.subtitle && (
                  <p className="text-xs text-ink-muted">{activePreview.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-hover transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
