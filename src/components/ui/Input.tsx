import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: ReactNode;
  invalid?: boolean;
};

const fieldBase = cn(
  "w-full rounded-xl border bg-bg-surface-2 px-4 py-3 text-body text-text-primary",
  "placeholder:text-text-tertiary caret-brand-solar",
  "transition duration-150 ease-out",
  "focus:outline-none focus:border-border-solar focus:ring-2 focus:ring-border-solar focus:ring-offset-0",
  "disabled:opacity-40 disabled:cursor-not-allowed",
);

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, invalid, id, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-caption uppercase tracking-wider text-text-tertiary"
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldBase,
          invalid ? "border-semantic-error" : "border-border-subtle",
          className,
        )}
        {...rest}
      />
      {hint ? (
        <span
          className={cn(
            "text-caption",
            invalid ? "text-semantic-error" : "text-text-tertiary",
          )}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
});
