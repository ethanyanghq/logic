import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type RadioOptionState = "default" | "selected" | "correct" | "incorrect";

export type RadioOptionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Optional leading marker (letter, index badge, icon). */
  marker?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  state?: RadioOptionState;
  selected?: boolean;
};

const stateStyles: Record<RadioOptionState, string> = {
  default: cn(
    "border-border-subtle bg-bg-surface",
    "hover:border-border-strong hover:bg-bg-surface-2",
  ),
  selected: cn(
    "border-border-solar bg-brand-solar-muted shadow-active-card",
  ),
  correct: cn(
    "border-semantic-success bg-semantic-success-muted",
  ),
  incorrect: cn(
    "border-semantic-error bg-semantic-error-muted",
  ),
};

const markerStyles: Record<RadioOptionState, string> = {
  default: "bg-bg-surface-2 text-text-secondary border border-border-subtle",
  selected: "bg-brand-solar text-text-inverse border border-brand-solar",
  correct: "bg-semantic-success text-text-inverse border border-semantic-success",
  incorrect: "bg-semantic-error text-text-inverse border border-semantic-error",
};

export const RadioOption = forwardRef<HTMLButtonElement, RadioOptionProps>(
  function RadioOption(
    {
      marker,
      label,
      description,
      state,
      selected,
      className,
      type = "button",
      role = "radio",
      ...rest
    },
    ref,
  ) {
    const resolved: RadioOptionState =
      state ?? (selected ? "selected" : "default");
    return (
      <button
        ref={ref}
        type={type}
        role={role}
        aria-checked={resolved !== "default"}
        className={cn(
          "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left",
          "transition duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
          "active:scale-[0.99]",
          "disabled:pointer-events-none disabled:opacity-40",
          stateStyles[resolved],
          className,
        )}
        {...rest}
      >
        {marker ? (
          <span
            className={cn(
              "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              "font-mono text-caption",
              markerStyles[resolved],
            )}
          >
            {marker}
          </span>
        ) : null}
        <span className="flex flex-1 flex-col gap-1">
          <span className="text-body text-text-primary">{label}</span>
          {description ? (
            <span className="text-caption text-text-secondary">{description}</span>
          ) : null}
        </span>
      </button>
    );
  },
);
