import { useCallback } from "react";
import { playAppSound, prepareAppAudio, type AppSound } from "@/lib/sound";
import { selectEffectiveSoundEnabled, useAppStore } from "@/store";

export function useSoundEffects(): (sound: AppSound) => void {
  const soundEnabled = useAppStore(selectEffectiveSoundEnabled);

  return useCallback(
    (sound: AppSound) => {
      playAppSound(sound, soundEnabled);
    },
    [soundEnabled],
  );
}

export function usePrepareSoundEffects(): () => void {
  const soundEnabled = useAppStore(selectEffectiveSoundEnabled);

  return useCallback(() => {
    prepareAppAudio(soundEnabled);
  }, [soundEnabled]);
}
