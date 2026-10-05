import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { deviceWidth, type Device } from "../../../components/websites/DevicePreview.tsx";

const GUTTER = 24;

/**
 * Renders the canvas at the device's real width and scales it down to fit, so the
 * site's container-query breakpoints match what visitors see on that device.
 */
export default function CanvasViewport({ device, children }: { device: Device; children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);
  const width = deviceWidth(device);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const update = () => setBox({ width: outer.clientWidth - GUTTER * 2, height: outer.clientHeight - GUTTER * 2 });
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    update();
    return () => observer.disconnect();
  }, []);

  const scale = box ? Math.min(1, Math.max(box.width, 1) / width) : 1;
  const frameStyle: CSSProperties = {
    width,
    height: box ? box.height / scale : "100%",
    top: GUTTER,
    transform: `translateX(-50%) scale(${scale})`,
  };

  return (
    <div
      ref={outerRef}
      className="relative z-(--z-ed-canvas) min-w-0 flex-1 overflow-hidden bg-ed-app bg-[radial-gradient(var(--color-ed-border)_1px,transparent_1px)] bg-size-[16px_16px]"
    >
      {box && (
        <div
          className="absolute left-1/2 origin-top overflow-hidden rounded-ed-lg border border-ed-border bg-white shadow-ed-canvas transition-[width] duration-200 motion-reduce:transition-none"
          style={frameStyle}
        >
          {children}
        </div>
      )}
      {scale < 1 && (
        <span className="pointer-events-none absolute bottom-2 right-3 rounded-ed-sm bg-ed-panel/90 px-1.5 py-0.5 font-mono text-ed-2xs text-ed-muted shadow-ed-xs">
          {width}px · {Math.round(scale * 100)}%
        </span>
      )}
    </div>
  );
}
