import { forwardRef } from "react";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { cn } from "./cn";

export type CardVariant = "default" | "interactive" | "selected" | "hero";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  /** Render as a button for keyboard activation when interactive. */
  asButton?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

const base = cn(
  "rounded-2xl border bg-bg-surface text-text-primary",
  "transition duration-150 ease-out",
);

const variantStyles: Record<CardVariant, string> = {
  default: "border-border-subtle",
  interactive: cn(
    "border-border-subtle cursor-pointer",
    "hover:border-border-strong hover:bg-bg-surface-2",
    "hover:-translate-y-1",
    "active:scale-[0.98] active:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
  ),
  selected: cn(
    "border-border-solar bg-brand-solar-muted shadow-active-card",
    "cursor-pointer",
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
  ),
  hero: cn(
    "border-border-strong shadow-active-card",
  ),
};

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant = "default", asButton = false, disabled, className, children, ...rest },
  ref,
) {
  const interactive = variant === "interactive" || variant === "selected";

  if (asButton && interactive) {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={buttonProps.type ?? "button"}
        disabled={disabled}
        className={cn(
          base,
          variantStyles[variant],
          disabled && "opacity-40 pointer-events-none",
          className,
        )}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      aria-disabled={disabled || undefined}
      className={cn(
        base,
        variantStyles[variant],
        disabled && "opacity-40 pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
