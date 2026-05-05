import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  DEMO_PRESETS,
  type DemoPresetDefinition,
  type DemoPresetKey,
} from "@/data/presets";
import { Button } from "../ui";
import { cn } from "../ui/cn";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { appStore, loadDemoPreset, useAppStore } from "../../store";

const APP_VERSION = "0.0.1";

export type DemoControlsSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelectPreset?: (preset: DemoPresetDefinition) => void;
};

export function DemoControlsSheet({
  open,
  onClose,
  onSelectPreset,
}: DemoControlsSheetProps) {
  const preferences = useAppStore((state) => state.preferences);
  const updateDemoPreferences = useAppStore(
    (state) => state.updateDemoPreferences,
  );
  const resetApp = useAppStore((state) => state.resetApp);
  const playSound = useSoundEffects();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      if (confirmReset) {
        setConfirmReset(false);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener(
        "keydown",
        onKey,
        { capture: true } as EventListenerOptions,
      );
  }, [open, onClose, confirmReset]);

  useEffect(() => {
    if (!open) setConfirmReset(false);
  }, [open]);

  if (!open) return null;

  const handleReset = () => {
    resetApp();
    playSound("reset");
    setConfirmReset(false);
    onClose();
  };

  const handleLoadPreset = (presetKey: DemoPresetKey) => {
    const preset = loadDemoPreset(appStore, presetKey);
    playSound("preset");
    setConfirmReset(false);
    onSelectPreset?.(preset);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo controls"
      className="absolute inset-0 z-50 flex items-end justify-center"
    >
      <button
        type="button"
        aria-label="Close demo controls"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-pointer bg-bg-scrim",
          "animate-[ui-fade-in_180ms_ease-out_forwards]",
        )}
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-t-3xl border-t border-border-strong bg-bg-glass",
          "px-6 pb-6 pt-3 text-text-primary backdrop-blur-md",
          "animate-[ui-sheet-in_260ms_ease-out_forwards]",
        )}
      >
        <div
          aria-hidden
          className="mx-auto mb-4 h-1 w-12 rounded-full bg-border-strong"
        />
        {confirmReset ? (
          <ResetConfirm
            onCancel={() => setConfirmReset(false)}
            onConfirm={handleReset}
          />
        ) : (
          <DemoControlsContent
            soundEnabled={preferences.soundEnabled}
            skipAnimations={preferences.skipAnimations}
            gridOverlayEnabled={preferences.gridOverlayEnabled}
            onSelectPreset={handleLoadPreset}
            onToggleSound={() =>
              updateDemoPreferences({ soundEnabled: !preferences.soundEnabled })
            }
            onToggleSkipAnimations={() =>
              updateDemoPreferences({
                skipAnimations: !preferences.skipAnimations,
              })
            }
            onToggleGrid={() =>
              updateDemoPreferences({
                gridOverlayEnabled: !preferences.gridOverlayEnabled,
              })
            }
            onRequestReset={() => setConfirmReset(true)}
          />
        )}
      </div>
    </div>
  );
}

type DemoControlsContentProps = {
  soundEnabled: boolean;
  skipAnimations: boolean;
  gridOverlayEnabled: boolean;
  onSelectPreset: (presetKey: DemoPresetKey) => void;
  onToggleSound: () => void;
  onToggleSkipAnimations: () => void;
  onToggleGrid: () => void;
  onRequestReset: () => void;
};

function DemoControlsContent({
  soundEnabled,
  skipAnimations,
  gridOverlayEnabled,
  onSelectPreset,
  onToggleSound,
  onToggleSkipAnimations,
  onToggleGrid,
  onRequestReset,
}: DemoControlsContentProps) {
  return (
    <>
      <header className="flex flex-col gap-1">
        <span className="text-caption uppercase tracking-wider text-brand-solar">
          Demo controls
        </span>
        <h2 className="text-h2 text-text-primary">Stage and reset</h2>
        <p className="text-body text-text-secondary">
          Toggle demo affordances or reset to first launch. Open with{" "}
          <KeyHint label="R" />.
        </p>
      </header>

      <section className="mt-5 flex flex-col gap-2">
        <span className="text-caption uppercase tracking-wider text-text-tertiary">
          Presets
        </span>
        {DEMO_PRESETS.map((preset) => (
          <PresetButton
            key={preset.key}
            label={preset.label}
            description={preset.description}
            onClick={() => onSelectPreset(preset.key)}
          />
        ))}
      </section>

      <section className="mt-5 flex flex-col gap-2">
        <span className="text-caption uppercase tracking-wider text-text-tertiary">
          Toggles
        </span>
        <ToggleRow
          label="Sound"
          description="In-app sound effects."
          checked={soundEnabled}
          onChange={onToggleSound}
        />
        <ToggleRow
          label="Skip animations"
          description="Suppress motion and sound for fast demos."
          checked={skipAnimations}
          onChange={onToggleSkipAnimations}
        />
        <ToggleRow
          label="Grid overlay"
          description="4px spacing grid for layout review."
          checked={gridOverlayEnabled}
          onChange={onToggleGrid}
        />
      </section>

      <section className="mt-5 flex flex-col gap-2">
        <Button
          variant="secondary"
          fullWidth
          onClick={onRequestReset}
          className="border-semantic-error/50 text-semantic-error hover:border-semantic-error hover:text-semantic-error"
        >
          Reset to first launch
        </Button>
      </section>

      <footer className="mt-5 flex items-center justify-between text-caption text-text-tertiary">
        <span>App v{APP_VERSION}</span>
        <span>logic-app-v1</span>
      </footer>
    </>
  );
}

function ResetConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption uppercase tracking-wider text-semantic-error">
        Confirm reset
      </span>
      <h2 className="text-h2 text-text-primary">Reset to first launch?</h2>
      <p className="text-body text-text-secondary">
        This clears all progress, profile, streaks, and preferences, then routes
        back to onboarding. There is no undo.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Button
          fullWidth
          onClick={onConfirm}
          className="bg-semantic-error text-text-inverse shadow-none hover:brightness-110"
        >
          Reset everything
        </Button>
        <Button variant="ghost" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function PresetButton({
  label,
  description,
  onClick,
}: {
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-1 rounded-xl border border-border-subtle",
        "bg-bg-surface-2 px-4 py-3 text-left transition duration-150 ease-out",
        "hover:border-border-strong hover:bg-bg-surface-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
      )}
    >
      <span className="text-body text-text-primary">{label}</span>
      <span className="text-caption text-text-secondary">{description}</span>
    </button>
  );
}

type ToggleRowProps = {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: () => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl",
        "border border-border-subtle bg-bg-surface-2 px-4 py-3 text-left",
        "transition duration-150 ease-out hover:border-border-strong hover:bg-bg-surface-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-solar",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
      )}
    >
      <span className="flex flex-col">
        <span className="text-body text-text-primary">{label}</span>
        {description ? (
          <span className="text-caption text-text-secondary">{description}</span>
        ) : null}
      </span>
      <ToggleTrack checked={checked} />
    </button>
  );
}

function ToggleTrack({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
          "border transition-colors duration-150 ease-out",
        checked
          ? "border-brand-solar bg-brand-solar/30"
          : "border-border-subtle bg-bg-surface-3",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-4 w-4 rounded-full",
          "transition-all duration-150 ease-out",
          checked
            ? "translate-x-5 bg-brand-solar shadow-cta-solar"
            : "bg-text-tertiary",
        )}
      />
    </span>
  );
}

function KeyHint({ label }: { label: string }) {
  return (
      <kbd
        className={cn(
          "mx-1 inline-flex h-6 min-w-6 items-center justify-center",
          "rounded border border-border-subtle bg-bg-surface-2 px-1",
          "font-mono text-caption text-text-secondary",
        )}
      >
        {label}
    </kbd>
  );
}
