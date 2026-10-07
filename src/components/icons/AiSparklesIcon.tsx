import type { SVGProps } from "react";
import { useId } from "react";

export interface AiSparklesIconProps extends SVGProps<SVGSVGElement> {
  /**
   * Visual style variant:
   * - "glossy": Premium rich blue glossy gradient with subtle specular sheen (recommended default)
   * - "gradient": Smooth blue-to-indigo brand gradient
   * - "solid": Solid brand primary blue
   * - "current": Inherits currentColor from text color
   */
  variant?: "glossy" | "gradient" | "solid" | "current";
  /** Optional outer soft glow filter */
  glow?: boolean;
  /** Size in pixels (sets both width and height) */
  size?: number | string;
}

/**
 * Pixel-perfect 3-star AI Sparkles icon matching platform AI standard.
 * Features 1 primary large 4-point star on the left, 1 medium star on the top-right,
 * and 1 small star on the mid-right with rich glossy blue gradients.
 */
export function AiSparklesIcon({
  variant = "glossy",
  glow = false,
  size,
  className = "",
  style,
  ...props
}: AiSparklesIconProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, "");

  const gradId = `ai-sparkle-grad-${id}`;
  const glossId = `ai-sparkle-gloss-${id}`;
  const filterId = `ai-sparkle-glow-${id}`;

  let fillAttr: string;
  switch (variant) {
    case "solid":
      fillAttr = "var(--color-brand, #2447c7)";
      break;
    case "current":
      fillAttr = "currentColor";
      break;
    case "gradient":
      fillAttr = `url(#${gradId})`;
      break;
    case "glossy":
    default:
      fillAttr = `url(#${glossId})`;
      break;
  }

  const customSizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 align-middle ${className}`}
      style={{ ...customSizeStyle, ...style }}
      aria-hidden="true"
      {...props}
    >
      <defs>
        {/* Rich vibrant glossy blue linear gradient */}
        <linearGradient id={glossId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Clean Royal Brand Gradient */}
        <linearGradient id={gradId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        {/* Optional soft neon blue glow */}
        {glow && (
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#3b82f6" floodOpacity="0.45" />
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${filterId})` : undefined}>
        {/* 1. Large 4-Point Sparkle Star (Bottom Left) */}
        <path
          d="M 8.2 7.0 Q 8.2 14.2 15.4 14.2 Q 8.2 14.2 8.2 21.4 Q 8.2 14.2 1.0 14.2 Q 8.2 14.2 8.2 7.0 Z"
          fill={fillAttr}
        />

        {/* 2. Medium 4-Point Sparkle Star (Upper Right) */}
        <path
          d="M 15.2 3.2 Q 15.2 6.8 18.8 6.8 Q 15.2 6.8 15.2 10.4 Q 15.2 6.8 11.6 6.8 Q 15.2 6.8 15.2 3.2 Z"
          fill={fillAttr}
          opacity={variant === "glossy" ? 0.92 : undefined}
        />

        {/* 3. Small 4-Point Sparkle Star (Middle-Far Right) */}
        <path
          d="M 19.8 9.6 Q 19.8 11.8 22.0 11.8 Q 19.8 11.8 19.8 14.0 Q 19.8 11.8 17.6 11.8 Q 19.8 11.8 19.8 9.6 Z"
          fill={fillAttr}
          opacity={variant === "glossy" ? 0.85 : undefined}
        />
      </g>
    </svg>
  );
}

export default AiSparklesIcon;
