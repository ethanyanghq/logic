import type { ReactNode } from "react";
import type { DemoPresetDefinition } from "@/data/presets";
import { DemoControlsLayer, DemoControlsProvider } from "../demo";
import { HomeIndicator } from "./HomeIndicator";
import { Notch } from "./Notch";
import { StatusBar } from "./StatusBar";

type PhoneFrameProps = {
  children: ReactNode;
  onSelectPreset?: (preset: DemoPresetDefinition) => void;
};

export function PhoneFrame({ children, onSelectPreset }: PhoneFrameProps) {
  return (
    <DemoControlsProvider>
      <div className="relative flex h-full w-full items-center justify-center bg-bg-canvas">
        <div
          className={[
            // Mobile: edge-to-edge fills viewport, no shell chrome.
            "h-full w-full overflow-hidden bg-bg-app",
            // Desktop: fixed phone-frame size, centered, with hardware shell.
            "md:h-[var(--frame-height)] md:w-[var(--frame-width)]",
            "md:rounded-frame md:bg-shell-outer md:p-1",
            "md:border md:border-border-shell md:shadow-frame",
          ].join(" ")}
        >
          <div
            className={[
              "relative flex h-full w-full flex-col overflow-hidden bg-bg-app bg-app-glow",
              // Inner radius matches outer minus shell padding so glass sits flush.
              "md:rounded-screen",
            ].join(" ")}
          >
            <Notch />
            <StatusBar />
            <main className="frame-scroll relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
            <HomeIndicator />
            <DemoControlsLayer onSelectPreset={onSelectPreset} />
          </div>
        </div>
      </div>
    </DemoControlsProvider>
  );
}
