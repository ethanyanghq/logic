import type { ReactNode } from "react";
import { cn } from "./cn";

export type ProgressTone = "solar" | "neural" | "success";

export type ProgressRingProps = {
  /** Value in [0, 1]. Clamped. */
  value: number;
  size?: number;
  stroke?: number;
  tone?: ProgressTone;
  /** Optional center label (e.g. "62%"). */
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const toneToColor: Record<ProgressTone, string> = {
  solar: "#F5D06F",
  neural: "#8EA7FF",
  success: "#7CFFB2",
};

export function ProgressRing({
  value,
  size = 64,
  stroke = 8,
  tone = "solar",
  children,
  className,
  ariaLabel,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <div
      role={ariaLabel ? "progressbar" : undefined}
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#232333"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={toneToColor[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center text-text-primary">
          {children}
        </div>
      ) : null}
    </div>
  );
}
