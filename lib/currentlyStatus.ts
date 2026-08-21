import type { WorkLensId } from "@/lib/workLenses";

/** About-loop phrases with the software mark shown after its name. */
export const CURRENTLY_ABOUT = [
  {
    lead: "talking my way through work with",
    software: "HeyClicky",
    logo: "/all-logos/heyclicky.png",
    needsLightTile: false,
  },
  {
    lead: "thinking out loud with AI using",
    software: "ChatGPT",
    logo: "/all-logos/chatgpt.png",
    needsLightTile: true,
  },
  {
    lead: "getting things done faster with",
    software: "Raycast",
    logo: "/all-logos/raycast.png",
    needsLightTile: false,
  },
  {
    lead: "soundtracking the workday on",
    software: "Spotify",
    logo: "/all-logos/spotify.png",
    needsLightTile: false,
  },
  {
    lead: "tracking another questionable life metric on",
    software: "Strava",
    logo: "/all-logos/strava.png",
    needsLightTile: true,
  },
  {
    lead: "collecting internet rabbit holes on",
    software: "Are.na",
    logo: "/all-logos/arena.png",
    needsLightTile: true,
  },
  {
    lead: "bringing interactions to life in",
    software: "Rive",
    logo: "/all-logos/rive.png",
    needsLightTile: true,
  },
  {
    lead: "sketching out new ideas in",
    software: "Paper",
    logo: "/all-logos/paper.png",
    needsLightTile: false,
  },
  {
    lead: "polishing micro-interactions in",
    software: "Jitter",
    logo: "/all-logos/jitter.png",
    needsLightTile: false,
  },
  {
    lead: "experimenting with generative visuals in",
    software: "Flora",
    logo: "/all-logos/flora.png",
    needsLightTile: false,
  },
  {
    lead: "shipping another project with",
    software: "Vercel",
    logo: "/all-logos/vercel.png",
    needsLightTile: true,
  },
  {
    lead: "turning designs into code with",
    software: "Cursor",
    logo: "/all-logos/cursor.png",
    needsLightTile: true,
  },
  {
    lead: "wiring up the stack with",
    software: "npm",
    logo: "/all-logos/npm.png",
    needsLightTile: false,
  },
  {
    lead: "making the web move with",
    software: "GSAP",
    logo: "/all-logos/gsap.png",
    needsLightTile: true,
  },
  {
    lead: "organizing the chaos in",
    software: "Notion",
    logo: "/all-logos/notion.png",
    needsLightTile: true,
  },
  {
    lead: "mapping how everything connects in",
    software: "FigJam",
    logo: "/all-logos/figjam.png",
    needsLightTile: false,
  },
  {
    lead: "turning messy research into structure in",
    software: "Airtable",
    logo: "/all-logos/airtable.png",
    needsLightTile: false,
  },
] as const;

/** Optional lens-specific loops (kept for potential reuse). */
export const CURRENTLY_BY_LENS: Record<WorkLensId, readonly string[]> = {
  visual: [
    "bringing interactions to life in Rive.",
    "sketching out new ideas in Paper.",
    "polishing micro-interactions in Jitter.",
    "experimenting with generative visuals in Flora.",
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
    "turning messy research into structure in Airtable.",
  ],
};
