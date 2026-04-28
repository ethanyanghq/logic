import { cn } from "./cn";

export type AvatarShape =
  | "prism"
  | "ring"
  | "hex"
  | "orbit"
  | "grid"
  | "wave";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  /** Geometric SVG identifier (matches the 6-shape onboarding set). */
  shape?: AvatarShape;
  /** Fallback initials when no shape is provided. */
  initials?: string;
  size?: AvatarSize;
  className?: string;
  alt?: string;
};

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-caption",
  md: "h-10 w-10 text-body",
  lg: "h-12 w-12 text-h2",
};

const sizePx: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

export function Avatar({
  shape,
  initials,
  size = "md",
  className,
  alt,
}: AvatarProps) {
  const px = sizePx[size];
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        "bg-bg-surface-2 border border-border-subtle text-text-primary",
        sizeStyles[size],
        className,
      )}
    >
      {shape ? (
        <AvatarShapeSvg shape={shape} size={px} />
      ) : (
        <span className="font-mono">{initials?.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}

function AvatarShapeSvg({ shape, size }: { shape: AvatarShape; size: number }) {
  const stroke = "rgba(142,167,255,0.85)";
  const accent = "rgba(245,208,111,0.95)";
  const inner = size * 0.55;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke={stroke}
      strokeWidth={1.5}
      aria-hidden
    >
      {shape === "prism" ? (
        <polygon
          points={`${cx},${cy - inner / 2} ${cx + inner / 2},${cy + inner / 2} ${cx - inner / 2},${cy + inner / 2}`}
        />
      ) : null}
      {shape === "ring" ? (
        <>
          <circle cx={cx} cy={cy} r={inner / 2} />
          <circle cx={cx} cy={cy} r={inner / 4} stroke={accent} />
        </>
      ) : null}
      {shape === "hex" ? (
        <polygon
          points={hexPoints(cx, cy, inner / 2)}
        />
      ) : null}
      {shape === "orbit" ? (
        <>
          <ellipse cx={cx} cy={cy} rx={inner / 2} ry={inner / 4} />
          <circle cx={cx} cy={cy} r={2} fill={accent} stroke="none" />
        </>
      ) : null}
      {shape === "grid" ? (
        <>
          {gridCells(cx, cy, inner).map((cell, i) => (
            <rect
              key={i}
              x={cell.x}
              y={cell.y}
              width={cell.w}
              height={cell.w}
              rx={1}
              stroke={i === 4 ? accent : stroke}
            />
          ))}
        </>
      ) : null}
      {shape === "wave" ? (
        <path
          d={`M ${cx - inner / 2} ${cy} Q ${cx - inner / 4} ${cy - inner / 3} ${cx} ${cy} T ${cx + inner / 2} ${cy}`}
        />
      ) : null}
    </svg>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function gridCells(cx: number, cy: number, size: number) {
  const w = size / 3;
  const x0 = cx - size / 2;
  const y0 = cy - size / 2;
  const cells: Array<{ x: number; y: number; w: number }> = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      cells.push({ x: x0 + c * w, y: y0 + r * w, w: w - 1 });
    }
  }
  return cells;
}
