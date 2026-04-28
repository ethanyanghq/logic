import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "./cn";

export type ToastTone = "default" | "success" | "error" | "warning" | "neural";

export type ToastProps = {
  open: boolean;
  onClose: () => void;
  tone?: ToastTone;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Auto-dismiss after this many ms. 0 disables. */
  duration?: number;
  className?: string;
};

const toneStyles: Record<ToastTone, string> = {
  default: "border-border-strong",
  success: "border-semantic-success",
  error: "border-semantic-error",
  warning: "border-semantic-warning",
  neural: "border-border-neural",
};

const toneAccent: Record<ToastTone, string> = {
  default: "text-text-primary",
  success: "text-semantic-success",
  error: "text-semantic-error",
  warning: "text-semantic-warning",
  neural: "text-brand-neural",
};

export function Toast({
  open,
  onClose,
  tone = "default",
  icon,
  title,
  description,
  duration = 3000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-4"
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-80 items-start gap-3 rounded-2xl border bg-bg-glass",
          "px-4 py-3 text-text-primary backdrop-blur-md shadow-frame",
          "animate-[ui-toast-in_220ms_ease-out_forwards]",
          toneStyles[tone],
          className,
        )}
      >
        {icon ? (
          <span className={cn("mt-0.5 inline-flex shrink-0", toneAccent[tone])}>
            {icon}
          </span>
        ) : null}
        <div className="flex flex-1 flex-col gap-1">
          <span className={cn("text-body", toneAccent[tone])}>{title}</span>
          {description ? (
            <span className="text-caption text-text-secondary">{description}</span>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className={cn(
            "ml-2 rounded-full p-1 text-text-tertiary",
            "transition hover:bg-bg-surface-2 hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
