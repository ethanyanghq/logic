import type { StoreApi } from "zustand/vanilla";
import {
  getDemoPresetByKey,
  type DemoPresetDefinition,
  type DemoPresetKey,
} from "../data/presets.ts";
import type { AppStoreState } from "./types.ts";

export type DemoPresetLoaderStore = Pick<StoreApi<AppStoreState>, "getState">;

export function loadDemoPreset(
  store: DemoPresetLoaderStore,
  presetKey: DemoPresetKey,
): DemoPresetDefinition {
  const preset = getDemoPresetByKey(presetKey);
  store.getState().applyPreset(preset);
  return preset;
}

export function loadFreshUserPreset(
  store: DemoPresetLoaderStore,
): DemoPresetDefinition {
  return loadDemoPreset(store, "fresh-user");
}

export function loadMidFoundationsPreset(
  store: DemoPresetLoaderStore,
): DemoPresetDefinition {
  return loadDemoPreset(store, "mid-foundations");
}

export function loadCompletionReadyPreset(
  store: DemoPresetLoaderStore,
): DemoPresetDefinition {
  return loadDemoPreset(store, "completion-ready");
}

export function loadPowerUserPreset(
  store: DemoPresetLoaderStore,
): DemoPresetDefinition {
  return loadDemoPreset(store, "power-user");
}
