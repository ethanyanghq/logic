import { useAppStore } from "../../store";

export function GridOverlay() {
  const enabled = useAppStore((state) => state.preferences.gridOverlayEnabled);
  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-40"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(244, 200, 92, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(244, 200, 92, 0.18) 1px, transparent 1px)",
        backgroundSize: "4px 4px",
        mixBlendMode: "screen",
      }}
    />
  );
}
