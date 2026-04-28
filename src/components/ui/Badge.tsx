import type { ReactNode } from "react";
import { cn } from "./cn";

export type BadgeProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  earned?: boolean;
  className?: string;
};

export function Badge({
  icon,
  label,
  description,
  earned = true,
  className,
}: BadgeProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-2xl border p-4 text-center",
        "transition duration-150 ease-out",
        earned
          ? "bg-bg-surface-2 border-border-subtle"
          : "bg-bg-surface border-border-subtle opacity-60",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          earned
            ? "bg-brand-solar-muted text-brand-solar"
            : "bg-bg-surface-3 text-text-tertiary",
        )}
        aria-hidden
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "text-caption uppercase tracking-wider",
            earned ? "text-text-primary" : "text-text-tertiary",
          )}
        >
          {label}
        </span>
        {description ? (
          <span className="text-caption text-text-tertiary">{description}</span>
        ) : null}
      </div>
    </div>
  );
}
