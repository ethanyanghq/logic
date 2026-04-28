import { createContext, useContext } from "react";

export type DemoControlsContextValue = {
  open: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  toggleSheet: () => void;
};

export const DemoControlsContext = createContext<DemoControlsContextValue | null>(
  null,
);

export function useDemoControls(): DemoControlsContextValue {
  const ctx = useContext(DemoControlsContext);
  if (!ctx) {
    throw new Error("useDemoControls must be used inside <DemoControls>");
  }
  return ctx;
}
