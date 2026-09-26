"use client";

import { useEffect } from "react";

const STORAGE_KEY = "portfolio-sound-enabled";

function soundEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
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
    return () => {
      document.removeEventListener("click", handleClick, true);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  return null;
}
