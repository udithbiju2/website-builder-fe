import type { SVGProps } from "react";

/**
 * Hand-drawn slanted double marks `//` positioned beside the headline
 */
export function SlashDoodle({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={`text-ink/80 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M6 24 L16 4" />
      <path d="M18 24 L28 4" />
    </svg>
  );
}

/**
 * Hand-drawn curved arrow with "Elevate your brand" script annotation on the top right
 */
export function ElevateBrandAnnotation({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none flex flex-col items-center text-ink/85 ${className}`}
      aria-hidden="true"
    >
      <span
        className="text-[17px] sm:text-[19px] tracking-wide rotate-[-4deg] font-medium"
        style={{
          fontFamily:
            '"Caveat", "Dancing Script", "Architects Daughter", "Segoe Print", "Bradley Hand", cursive',
        }}
      >
        Elevate your brand
      </span>
      <svg
        width="68"
        height="56"
        viewBox="0 0 74 62"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-1 -rotate-6 text-ink/75"
      >
        {/* Organic curved swoop downward and left towards the banner cards */}
        <path d="M12 4 C38 6, 62 20, 52 46 C50 50, 46 54, 40 54" />
        <path d="M49 46 L39 55 L45 61" />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn curved arrow with "It's free" script annotation pointing to the CTA button
 */
export function ItsFreeAnnotation({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none flex items-center gap-2 text-ink/85 ${className}`}
      aria-hidden="true"
    >
      <span
        className="text-[17px] sm:text-[19px] tracking-wide rotate-[-6deg] font-medium"
        style={{
          fontFamily:
            '"Caveat", "Dancing Script", "Architects Daughter", "Segoe Print", "Bradley Hand", cursive',
        }}
      >
        It's free
      </span>
      <svg
        width="46"
        height="32"
        viewBox="0 0 52 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink/75"
      >
        {/* Curved arrow curving upward and right into the button */}
        <path d="M6 14 C16 28, 30 26, 44 14" />
        <path d="M36 12 L45 13 L42 22" />
      </svg>
    </div>
  );
}
