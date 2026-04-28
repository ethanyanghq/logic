import { cn } from "./cn";
import type { ProgressTone } from "./ProgressRing";

export type ProgressBarProps = {
  /** Value in [0, 1]. Clamped. */
  value: number;
  tone?: ProgressTone;
  height?: number;
  className?: string;
  ariaLabel?: string;
};

const toneStyles: Record<ProgressTone, string> = {
  solar: "bg-brand-solar",
  neural: "bg-brand-neural",
  success: "bg-semantic-success",
};

export function ProgressBar({
  value,
  tone = "solar",
  height = 8,
  className,
  ariaLabel,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-bg-surface-3",
        className,
      )}
      style={{ height }}
    >
      <div
        className={cn("h-full rounded-full", toneStyles[tone])}
        style={{
          width: `${clamped * 100}%`,
          transition: "width 600ms ease-out",
        }}
      />
    </div>
  );
}
