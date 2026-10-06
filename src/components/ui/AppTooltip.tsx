import { Tooltip } from "@heroui/react";
import type { ReactNode } from "react";

export type AppTooltipProps = {
  content: ReactNode;
  children: ReactNode;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end";
  delay?: number;
  closeDelay?: number;
  shortcut?: string;
  showArrow?: boolean;
  offset?: number;
  className?: string;
  isDisabled?: boolean;
};

export default function AppTooltip({
  content,
  children,
  placement = "top",
  delay = 0,
  closeDelay = 0,
  shortcut,
  showArrow = false,
  offset = 6,
  className = "",
  isDisabled = false,
}: AppTooltipProps) {
  if (isDisabled || !content) {
    return <>{children}</>;
  }

  return (
    <Tooltip delay={delay} closeDelay={closeDelay}>
      <Tooltip.Trigger className="inline-flex">{children}</Tooltip.Trigger>
      <Tooltip.Content
        placement={placement}
        offset={offset}
        showArrow={showArrow}
        className={`z-50 flex items-center gap-1.5 rounded-md border border-zinc-800/90 bg-zinc-900/95 px-2.5 py-1 text-ed-2xs font-medium tracking-wide text-zinc-100 shadow-xl backdrop-blur-md dark:border-zinc-700/70 dark:bg-zinc-800/95 dark:text-zinc-100 ${className}`}
      >
        <span>{content}</span>
        {shortcut && (
          <kbd className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-zinc-800/90 px-1 font-mono text-[9px] font-semibold text-zinc-300 border border-zinc-700/60 dark:bg-zinc-700/80 dark:text-zinc-200">
            {shortcut}
          </kbd>
        )}
      </Tooltip.Content>
    </Tooltip>
  );
}
