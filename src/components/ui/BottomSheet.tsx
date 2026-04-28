import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "./cn";

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-30 flex items-end justify-center"
    >
      <button
        type="button"
        aria-label="Close sheet"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-pointer bg-bg-scrim",
          "animate-[ui-fade-in_180ms_ease-out_forwards]",
        )}
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-t-3xl border-t border-border-strong bg-bg-glass",
          "px-6 pb-6 pt-3 text-text-primary backdrop-blur-md",
          "animate-[ui-sheet-in_260ms_ease-out_forwards]",
          className,
        )}
      >
        <div
          aria-hidden
          className="mx-auto mb-4 h-1 w-12 rounded-full bg-border-strong"
        />
        {title ? (
          <h2 className="text-h2 text-text-primary">{title}</h2>
        ) : null}
        {description ? (
          <p className="mt-2 text-body text-text-secondary">{description}</p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
        {footer ? (
          <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
