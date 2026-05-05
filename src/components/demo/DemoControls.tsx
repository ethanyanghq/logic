import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DemoPresetDefinition } from "@/data/presets";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { DemoControlsContext, useDemoControls } from "./DemoControlsContext";
import { DemoControlsSheet } from "./DemoControlsSheet";
import { GridOverlay } from "./GridOverlay";

export type DemoControlsProviderProps = {
  children: ReactNode;
};

export function DemoControlsProvider({ children }: DemoControlsProviderProps) {
  const [open, setOpen] = useState(false);
  const playSound = useSoundEffects();

  const openSheet = useCallback(() => {
    playSound("open");
    setOpen(true);
  }, [playSound]);
  const closeSheet = useCallback(() => setOpen(false), []);
  const toggleSheet = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        playSound("open");
      }
      return !prev;
    });
  }, [playSound]);

  useKeyboardShortcut({ key: "r" }, openSheet);

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
