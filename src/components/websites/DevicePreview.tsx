import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import { SiteStyles } from "../../site-kit/index.ts";

export type Device = "desktop" | "tablet" | "mobile";

export const DEVICES: { id: Device; label: string; width: number; icon: LucideIcon }[] = [
  { id: "desktop", label: "Desktop", width: 1280, icon: Monitor },
  { id: "tablet", label: "Tablet", width: 768, icon: Tablet },
  { id: "mobile", label: "Mobile", width: 390, icon: Smartphone },
];

export function deviceWidth(device: Device): number {
  return DEVICES.find((option) => option.id === device)?.width ?? 1280;
}

type DeviceToggleProps = {
  value: Device;
  onChange: (device: Device) => void;
  tone?: "light" | "dark";
};

export function DeviceToggle({ value, onChange, tone = "light" }: DeviceToggleProps) {
  const dark = tone === "dark";
  return (
    <div
      role="group"
      aria-label="Preview device"
      className={`flex rounded-lg border p-0.5 ${dark ? "border-white/15" : "border-line"}`}
    >
      {DEVICES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
            value === id
              ? dark
                ? "bg-white text-ink"
                : "bg-ink text-white"
              : dark
                ? "text-white/70 hover:text-white"
                : "text-ink-body hover:text-ink"
          }`}
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}

type PreviewFrameProps = {
  device: Device;
  /** Receives the href of clicked site links, e.g. to switch the previewed page. */
  onLinkClick?: (href: string) => void;
  /** Scale the frame down to the available width instead of scrolling sideways. Exposes `--preview-scale`. */
  fit?: boolean;
  children: ReactNode;
};

/** Fixed-width frame; site-kit container queries make it behave like a real device. */
export function PreviewFrame({ device, onLinkClick, fit = false, children }: PreviewFrameProps) {
  const width = deviceWidth(device);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!fit) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const nextScale = Math.min(1, outer.clientWidth / width);
      setScale(nextScale);
      setHeight(inner.offsetHeight * nextScale);
    };
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    update();
    return () => observer.disconnect();
  }, [fit, width]);

  // Site links point at the client site's paths, which don't exist inside the builder.
  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    if (!anchor) return;
    event.preventDefault();
    onLinkClick?.(anchor.getAttribute("href") ?? "");
  }

  const frameClass = "overflow-clip rounded-lg border border-line-strong bg-white shadow-sm";

  if (fit) {
    return (
      <div className="bg-canvas p-4 sm:p-6">
        <SiteStyles />
        <div ref={outerRef} className="mx-auto overflow-hidden" style={{ maxWidth: width, height: height ?? undefined }}>
          <div
            ref={innerRef}
            className={frameClass}
            style={{ width, transform: `scale(${scale})`, transformOrigin: "top left", "--preview-scale": scale } as CSSProperties}
            onClickCapture={handleClickCapture}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-canvas p-4 sm:p-6">
      <SiteStyles />
      <div className={`mx-auto ${frameClass}`} style={{ width }} onClickCapture={handleClickCapture}>
        {children}
      </div>
    </div>
  );
}
