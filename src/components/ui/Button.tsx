import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const base = cn(
  "inline-flex items-center justify-center gap-2 rounded-xl font-sans",
  "transition duration-150 ease-out select-none whitespace-nowrap",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
  "active:scale-[0.97]",
  "disabled:pointer-events-none disabled:opacity-40",
);

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-brand-solar text-text-inverse shadow-cta-solar",
    "hover:brightness-110",
    "disabled:bg-bg-surface-2 disabled:text-text-tertiary disabled:shadow-none",
  ),
  secondary: cn(
    "bg-bg-surface-2 border border-border-subtle text-text-primary",
    "hover:border-border-strong hover:bg-bg-surface-3",
  ),
  ghost: cn(
    "bg-transparent text-text-primary",
    "hover:bg-bg-surface-2",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-caption",
  md: "h-10 px-5 text-body",
  lg: "h-12 px-6 text-body",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    leadingIcon,
    trailingIcon,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {leadingIcon ? (
        <span className="inline-flex shrink-0">{leadingIcon}</span>
      ) : null}
      {children}
      {trailingIcon ? (
        <span className="inline-flex shrink-0">{trailingIcon}</span>
      ) : null}
    </button>
  );
});
