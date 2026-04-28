export type DemoPreferences = {
  soundEnabled: boolean;
  reducedMotion: boolean;
  skipAnimations: boolean;
  gridOverlayEnabled: boolean;
};

export function createDefaultDemoPreferences(): DemoPreferences {
  return {
    soundEnabled: true,
    reducedMotion: false,
    skipAnimations: false,
    gridOverlayEnabled: false,
  };
}

export function getEffectiveSoundEnabled(preferences: DemoPreferences): boolean {
  return (
    preferences.soundEnabled &&
    !preferences.reducedMotion &&
    !preferences.skipAnimations
  );
}

export function getEffectiveMotionEnabled(
  preferences: DemoPreferences,
): boolean {
  return !preferences.reducedMotion && !preferences.skipAnimations;
}
