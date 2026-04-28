import { useEffect } from "react";

export type KeyboardShortcut = {
  key: string;
  ctrlOrMeta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

export type UseKeyboardShortcutOptions = {
  enabled?: boolean;
  preventDefault?: boolean;
};

export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  handler: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {},
): void {
  const { enabled = true, preventDefault = true } = options;
  const { key, ctrlOrMeta = false, shift = false, alt = false } = shortcut;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if ((event.ctrlKey || event.metaKey) !== ctrlOrMeta) return;
      if (event.shiftKey !== shift) return;
      if (event.altKey !== alt) return;
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      handler(event);
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true } as EventListenerOptions);
    };
  }, [enabled, preventDefault, key, ctrlOrMeta, shift, alt, handler]);
}
