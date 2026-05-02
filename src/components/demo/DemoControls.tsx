import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DemoPresetDefinition } from "@/data/presets";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { DemoControlsContext, useDemoControls } from "./DemoControlsContext";
import { DemoControlsSheet } from "./DemoControlsSheet";
import { GridOverlay } from "./GridOverlay";

export type DemoControlsProviderProps = {
  children: ReactNode;
};

export function DemoControlsProvider({ children }: DemoControlsProviderProps) {
  const [open, setOpen] = useState(false);

  const openSheet = useCallback(() => setOpen(true), []);
  const closeSheet = useCallback(() => setOpen(false), []);
  const toggleSheet = useCallback(() => setOpen((prev) => !prev), []);

  useKeyboardShortcut(
    { key: "r", ctrlOrMeta: true, shift: true },
    openSheet,
  );

  const value = useMemo(
    () => ({ open, openSheet, closeSheet, toggleSheet }),
    [open, openSheet, closeSheet, toggleSheet],
  );

  return (
    <DemoControlsContext.Provider value={value}>
      {children}
    </DemoControlsContext.Provider>
  );
}

export type DemoControlsLayerProps = {
  onSelectPreset?: (preset: DemoPresetDefinition) => void;
};

export function DemoControlsLayer({ onSelectPreset }: DemoControlsLayerProps) {
  const { open, closeSheet } = useDemoControls();
  return (
    <>
      <GridOverlay />
      <DemoControlsSheet
        open={open}
        onClose={closeSheet}
        onSelectPreset={onSelectPreset}
      />
    </>
  );
}
