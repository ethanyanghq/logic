import type { ReactNode } from "react";
import { cn } from "./cn";

export type StatTileTone = "default" | "solar" | "neural";

export type StatTileProps = {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  tone?: StatTileTone;
  className?: string;
};

const valueToneStyles: Record<StatTileTone, string> = {
  default: "text-text-primary",
  solar: "text-brand-solar",
  neural: "text-brand-neural",
};

export function StatTile({
  label,
  value,
  caption,
  tone = "default",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border-subtle bg-bg-surface p-4",
        className,
      )}
    >
      <span className="text-caption uppercase tracking-wider text-text-tertiary">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-h1 leading-none tabular-nums",
          valueToneStyles[tone],
        )}
      >
        {value}
      </span>
      {caption ? (
        <span className="text-caption text-text-secondary">{caption}</span>
      ) : null}
    </div>
  );
}
