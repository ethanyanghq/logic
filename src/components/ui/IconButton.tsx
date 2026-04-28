import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type IconButtonVariant = "default" | "solar" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Accessible label — required since the button has no visible text. */
  label: string;
  icon: ReactNode;
};

const base = cn(
  "inline-flex items-center justify-center rounded-full",
  "transition duration-150 ease-out select-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
  "active:scale-[0.94]",
  "disabled:pointer-events-none disabled:opacity-40",
);

const variantStyles: Record<IconButtonVariant, string> = {
  default: cn(
    "bg-bg-surface-2 border border-border-subtle text-text-primary",
    "hover:border-border-strong hover:bg-bg-surface-3",
  ),
  solar: cn(
    "bg-brand-solar text-text-inverse shadow-cta-solar",
    "hover:brightness-110",
  ),
  ghost: cn(
    "bg-transparent text-text-secondary",
    "hover:bg-bg-surface-2 hover:text-text-primary",
  ),
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = "default",
      size = "md",
      label,
      icon,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          base,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...rest}
      >
        <span className="inline-flex shrink-0">{icon}</span>
      </button>
    );
  },
);
