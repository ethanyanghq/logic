import { forwardRef, useId } from "react";
import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: ReactNode;
  invalid?: boolean;
};

const fieldBase = cn(
  "w-full rounded-xl border bg-bg-surface-2 px-4 py-3 text-body text-text-primary",
  "placeholder:text-text-tertiary caret-brand-solar",
  "transition duration-150 ease-out",
  "focus:outline-none focus:border-border-solar focus:ring-2 focus:ring-border-solar",
  "disabled:opacity-40 disabled:cursor-not-allowed",
  "min-h-[96px] resize-y",
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, hint, invalid, id, className, rows = 4, ...rest }, ref) {
    const reactId = useId();
    const fieldId = id ?? reactId;
    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label
            htmlFor={fieldId}
            className="text-caption uppercase tracking-wider text-text-tertiary"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
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
  },
);
