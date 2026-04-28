import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type TagTone = "neutral" | "solar" | "neural" | "success" | "warning" | "error";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone;
  children: ReactNode;
};

const toneStyles: Record<TagTone, string> = {
  neutral: "bg-bg-surface-2 text-text-secondary border border-border-subtle",
  solar: "bg-brand-solar-muted text-brand-solar border border-border-solar",
  neural: "bg-brand-neural-muted text-brand-neural border border-border-neural",
  success: "bg-semantic-success-muted text-semantic-success border border-semantic-success",
  warning: "bg-semantic-warning-muted text-semantic-warning border border-semantic-warning",
  error: "bg-semantic-error-muted text-semantic-error border border-semantic-error",
};

export function Tag({ tone = "neutral", className, children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-caption uppercase tracking-wider",
        toneStyles[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
