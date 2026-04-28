import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "./cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Optional title rendered in the modal header. */
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Footer slot, typically holds confirm/cancel buttons. */
  footer?: ReactNode;
  /** Disable closing on backdrop click (e.g. destructive confirm). */
  dismissOnBackdrop?: boolean;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  dismissOnBackdrop = true,
  className,
}: ModalProps) {
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
      className="absolute inset-0 z-30 flex items-center justify-center px-4"
    >
      <button
        type="button"
        aria-label="Close modal"
        tabIndex={-1}
        onClick={dismissOnBackdrop ? onClose : undefined}
        className={cn(
          "absolute inset-0 bg-bg-scrim",
          "animate-[ui-fade-in_180ms_ease-out_forwards]",
          dismissOnBackdrop ? "cursor-pointer" : "cursor-default",
        )}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-[320px] rounded-2xl border border-border-strong bg-bg-glass",
          "p-6 text-text-primary backdrop-blur-md shadow-frame",
          "animate-[ui-modal-in_220ms_ease-out_forwards]",
          className,
        )}
      >
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
