export function HomeIndicator() {
  return (
    <div
      className="sticky bottom-0 z-20 flex h-[var(--home-indicator-height)] w-full items-end justify-center pb-2"
      aria-hidden
    >
      <div className="h-[5px] w-[134px] rounded-full bg-text-primary/85" />
    </div>
  );
}
