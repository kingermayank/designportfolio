import type { WorkLensId } from "@/lib/workLenses";

/** Trailing phrases for the “Currently …” loop. */
export const CURRENTLY_ABOUT = [
  "talking my way through work with HeyClicky.",
  "thinking out loud with AI using ChatGPT.",
  "getting things done faster with Raycast.",
  "soundtracking the workday on Spotify.",
  "tracking another questionable life metric on Strava.",
  "collecting internet rabbit holes on Are.na.",
] as const;

/** Optional lens-specific loops (kept for potential reuse). */
export const CURRENTLY_BY_LENS: Record<WorkLensId, readonly string[]> = {
  visual: [
    "bringing interactions to life in Rive.",
    "sketching out new ideas in Paper.",
    "polishing micro-interactions in Jitter.",
    "exploring new visual directions with Reve.",
    "experimenting with generative visuals in Flora.",
    "weaving together visual experiments in Weave.",
  ],
  engineering: [
    "shipping another project with Vercel.",
    "turning designs into code with Cursor.",
    "wiring up the stack with npm.",
    "making the web move with GSAP.",
  ],
  systems: [
    "organizing the chaos in Notion.",
    "mapping how everything connects in FigJam.",
    "digging into product behavior with Mixpanel.",
    "turning messy research into structure in Airtable.",
  ],
};
