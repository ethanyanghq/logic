export function HomeIndicator() {
  return (
    <div
      className="sticky bottom-0 z-20 flex h-[var(--home-indicator-height)] w-full items-end justify-center pb-2"
      aria-hidden
    >
      <div className="h-1 w-32 rounded-full bg-text-primary/85" />
    </div>
  );
}
