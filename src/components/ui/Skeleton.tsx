import type { CSSProperties } from "react";
import { cn } from "./cn";

export type SkeletonShape = "block" | "line" | "circle";

export type SkeletonProps = {
  shape?: SkeletonShape;
  width?: number | string;
  height?: number | string;
  className?: string;
};

export function Skeleton({
  shape = "block",
  width,
  height,
  className,
}: SkeletonProps) {
  const style: CSSProperties = {
    width: width ?? (shape === "line" ? "100%" : undefined),
    height: height ?? (shape === "line" ? 12 : undefined),
  };
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "relative overflow-hidden bg-bg-surface-2",
        shape === "circle" && "rounded-full",
        shape === "line" && "rounded-full",
        shape === "block" && "rounded-xl",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 -inset-x-full",
          "bg-gradient-to-r from-transparent via-bg-surface-3 to-transparent",
          "animate-[ui-shimmer_1500ms_linear_infinite]",
        )}
      />
    </div>
  );
}
