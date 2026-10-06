import { useEffect, useState, useCallback, useRef, type KeyboardEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
  Check,
} from "lucide-react";

export type LightboxItem = {
  url: string;
  alt?: string;
  title?: string;
  description?: string;
  size?: number;
  width?: number;
  height?: number;
};

export type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Single image URL or array of images/items */
  src?: string | LightboxItem | (string | LightboxItem)[];
  /** Current index if passing an array */
  index?: number;
  /** Called when switching images */
  onIndexChange?: (index: number) => void;
  /** Image alt text if single string src */
  alt?: string;
  /** Image title */
  title?: string;
  /** Default view mode: "modal" (centered card) or "fullscreen" */
  mode?: "modal" | "fullscreen";
};

export function Lightbox({
  isOpen,
  onClose,
  src,
  index: controlledIndex = 0,
  onIndexChange,
  alt = "",
  title,
  mode: initialMode = "modal",
}: LightboxProps) {
  const [internalIndex, setInternalIndex] = useState(controlledIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(initialMode === "fullscreen");
  const [copied, setCopied] = useState(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Normalize items array
  const items: LightboxItem[] = Array.isArray(src)
    ? src.map((item) => (typeof item === "string" ? { url: item } : item))
    : src
      ? [typeof src === "string" ? { url: src, alt, title } : src]
      : [];

  const currentIndex = onIndexChange ? controlledIndex : internalIndex;
  const currentItem = items[currentIndex] ?? {
    url: typeof src === "string" ? src : "",
    alt,
    title,
  };

  const setCurrentIndex = useCallback(
    (newIndex: number) => {
      setInternalIndex(newIndex);
      onIndexChange?.(newIndex);
      setScale(1);
      setRotation(0);
      setNaturalDimensions(null);
    },
    [onIndexChange],
  );

  // Lock scroll & reset transform when opened
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setNaturalDimensions(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (items.length > 1) {
      setCurrentIndex((currentIndex + 1) % items.length);
    }
  }, [currentIndex, items.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    if (items.length > 1) {
      setCurrentIndex((currentIndex - 1 + items.length) % items.length);
    }
  }, [currentIndex, items.length, setCurrentIndex]);

  const handleZoomIn = () => setScale((s) => Math.min(3.5, s + 0.25));
  const handleZoomOut = () => setScale((s) => Math.max(0.4, s - 0.25));
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const copyUrl = () => {
    if (!currentItem.url) return;
    navigator.clipboard.writeText(currentItem.url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "+" || e.key === "=") handleZoomIn();
    if (e.key === "-") handleZoomOut();
    if (e.key === "0") handleReset();
  };

  if (!isOpen || !currentItem.url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview Modal"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none outline-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Centered Modal Card Shell */}
      <div
        ref={modalRef}
        className={`relative flex flex-col overflow-hidden rounded-2xl border border-zinc-700/60 bg-[#121316] text-zinc-100 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)] transition-all duration-200 ${
          isFullscreen
            ? "fixed inset-3 sm:inset-6 max-w-none max-h-none h-[calc(100vh-24px)] sm:h-[calc(100vh-48px)] w-[calc(100vw-24px)] sm:w-[calc(100vw-48px)]"
            : "w-full max-w-4xl max-h-[88vh] h-auto"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 sm:px-5 py-3 backdrop-blur-sm z-30 shrink-0">
          {/* Title & Metadata */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-zinc-200 shrink-0">
              <Sparkles className="size-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {currentItem.title || currentItem.alt || "Image Preview"}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                {naturalDimensions && (
                  <span>
                    {naturalDimensions.width} × {naturalDimensions.height} px
                  </span>
                )}
                {items.length > 1 && (
                  <span className="font-medium text-brand-300">
                    {currentIndex + 1} of {items.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={scale <= 0.4}
                title="Zoom out (-)"
                className="p-1 text-zinc-300 hover:text-white rounded hover:bg-white/10 disabled:opacity-40 transition"
              >
                <ZoomOut className="size-3.5" />
              </button>
              <span className="px-1.5 text-[11px] font-medium text-zinc-300 min-w-[38px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={scale >= 3.5}
                title="Zoom in (+)"
                className="p-1 text-zinc-300 hover:text-white rounded hover:bg-white/10 disabled:opacity-40 transition"
              >
                <ZoomIn className="size-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleRotate}
              title="Rotate 90°"
              className="p-1.5 text-zinc-300 hover:text-white rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <RotateCcw className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-1.5 text-zinc-300 hover:text-white rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>

            <a
              href={currentItem.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original"
              className="p-1.5 text-zinc-300 hover:text-white rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <ExternalLink className="size-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              title="Close modal (Esc)"
              className="ml-1 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition hover:scale-105 active:scale-95"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Image Viewport Stage */}
        <div
          className="relative flex-1 min-h-[300px] sm:min-h-[460px] w-full flex items-center justify-center p-4 sm:p-8 bg-[#090a0c] bg-[radial-gradient(#1f2229_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isFullscreen) onClose();
          }}
        >
          {/* Previous Gallery Trigger */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              title="Previous image"
              className="absolute left-3 sm:left-4 z-20 p-2.5 rounded-full bg-zinc-900/80 border border-white/15 text-white hover:bg-zinc-800 hover:scale-110 active:scale-95 transition shadow-lg backdrop-blur-md"
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>
          )}

          {/* Image Display */}
          <div
            className="relative max-h-full max-w-full flex items-center justify-center transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={currentItem.url}
              alt={currentItem.alt || currentItem.title || "Preview"}
              className="max-h-[62vh] sm:max-h-[68vh] max-w-full object-contain rounded-lg shadow-xl ring-1 ring-white/10 bg-[#121316]"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
              }}
            />
          </div>

          {/* Next Gallery Trigger */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              title="Next image"
              className="absolute right-3 sm:right-4 z-20 p-2.5 rounded-full bg-zinc-900/80 border border-white/15 text-white hover:bg-zinc-800 hover:scale-110 active:scale-95 transition shadow-lg backdrop-blur-md"
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          )}
        </div>

        {/* Modal Footer Toolbar */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-900/90 px-4 py-2.5 backdrop-blur-sm z-30 shrink-0 text-xs text-zinc-300">
          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-white/10 transition"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied link" : "Copy URL"}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={currentItem.url}
              download
              className="inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1 text-xs transition active:scale-95"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
