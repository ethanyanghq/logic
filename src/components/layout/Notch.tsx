export function Notch() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-2 z-30 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-shell-outer"
      style={{
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 2px rgba(0,0,0,0.6)",
      }}
    />
  );
}
