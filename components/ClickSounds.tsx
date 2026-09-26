"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "portfolio-sound-enabled";
const CHANGE_EVENT = "portfolio-sound-change";
let enabledInMemory = true;

function soundEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return enabledInMemory;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

const CONTROLS = [
  "a[href]", "button", "summary", '[role="button"]', '[role="tab"]',
  '[role="switch"]', '[role="menuitem"]', 'input[type="button"]',
  'input[type="submit"]', 'input[type="checkbox"]', 'input[type="radio"]',
  '[data-click-sound="on"]',
].join(",");

/** One listener survives route changes and also covers controls in portals. */
export default function ClickSounds() {
  useEffect(() => {
    const audio = new Audio("/click.wav");
    audio.preload = "auto";
    audio.volume = 0.25;
    audio.load();

    const play = () => {
      if (!soundEnabled()) return;
      // Restart the short sample, avoiding a pile-up during rapid interaction.
      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Playback restrictions or missing audio must never interrupt an action.
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) return;
      const target = event.target;
      if (target.closest('[data-click-sound="off"], [inert], [aria-disabled="true"], :disabled')) return;
      if (target.closest(CONTROLS)) play();
    };

    // Capture before a control navigates, unmounts, or stops propagation.
    // Native keyboard activation also emits click, so it plays exactly once.
    document.addEventListener("click", handleClick, true);
    window.addEventListener(CHANGE_EVENT, play);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener(CHANGE_EVENT, play);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  return null;
}

export function SoundToggle() {
  const enabled = useSyncExternalStore(subscribe, soundEnabled, () => true);

  return (
    <button
      type="button"
      className="soundToggle"
      aria-label="Interface sounds"
      aria-pressed={enabled}
      data-click-sound="off"
      onClick={() => {
        enabledInMemory = !enabled;
        try {
          localStorage.setItem(STORAGE_KEY, String(enabledInMemory));
        } catch {
          // Keep the preference for this session when storage is unavailable.
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
      }}
    >
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
