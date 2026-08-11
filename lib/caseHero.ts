import type { CaseHeroProps } from "@/components/case-hero";
import type { MetadataItem, MetadataTags } from "@/components/case-hero";
import { brandColor } from "./brandColors";
import type { CaseStudy } from "./caseStudies";

/**
 * Per-study hero metadata. Every value here is lifted from that study's own
 * `credits` / `category` / `year` — this table only decides the order and the
 * row labels so the hero reads the same across every case study.
 */
type HeroMeta = {
  eyebrow?: string;
  items?: MetadataItem[];
  tags?: MetadataTags;
  /** Substring of the detail title painted in the brand accent. */
  titleAccent?: string;
};

const split = (value: string): string[] =>
  value
    .split(/,\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

const HERO_META: Record<string, HeroMeta> = {
  toolbox: {
    eyebrow: "Ikon Technologies",
    titleAccent: "unlock Ikon's largest customer expansion.",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Role", value: "Lead Product Designer, Design Engineer" },
      { label: "Focus", value: "Design Engineering" },
      { label: "Time", value: "2025" },
    ],
    tags: {
      label: "Industry",
      values: split("Automotive, IoT Hardware"),
    },
  },

  warpbnb: {
    eyebrow: "Airbnb",
    titleAccent: "Airbnb for time travel",
    items: [
      { label: "Company", value: "Warpbnb" },
      { label: "Role", value: "Everything: design, code, content, motion, film" },
      { label: "Focus", value: "Full-Stack AI Build" },
      { label: "Time", value: "~2 weeks, mostly at night" },
    ],
    tags: {
      label: "Tools",
      values: split(
        "Figma, Magicpath, Cursor, Storybook, Claude Code, Codex, Supabase, Vercel, Gemini, Luma Dream Machine, Higgsfield, Topaz Bloom, Replicate, ElevenLabs, Final Cut Pro",
      ),
    },
  },

  pathai: {
    eyebrow: "PathAI",
    titleAccent: "speed and confidence.",
    items: [
      { label: "Company", value: "PathAI" },
      { label: "Focus", value: "Product Design" },
      { label: "Team", value: "Me, Sandy Zhu, Riley Hunter, Jamie Harisiades, 5× SWE" },
      { label: "Time", value: "2022" },
    ],
    tags: {
      label: "My contribution",
      values: split(
        "User research, stakeholder alignment, interaction design, rapid prototyping, user testing, handoff",
      ),
    },
  },

  walkity: {
    eyebrow: "Walkity",
    titleAccent: "brand strategy and landing page",
    items: [
      { label: "Company", value: "Walkity" },
      { label: "Focus", value: "Accessibility-centered brand and web experience" },
      { label: "Time", value: "2023" },
    ],
    tags: {
      label: "Role",
      values: split("Brand strategy, visual identity, landing page design"),
    },
  },

  bigbasket: {
    eyebrow: "BigBasket",
    titleAccent: "design system",
    items: [
      { label: "Company", value: "BigBasket" },
      { label: "Focus", value: "Design Systems" },
      { label: "Time", value: "2021" },
    ],
    tags: {
      label: "My contribution",
      values: split(
        "Design system foundations, components, documentation, and cross-platform patterns",
      ),
    },
  },

  "ikon-pm": {
    eyebrow: "Ikon Technologies",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Focus", value: "Product Management" },
      { label: "Time", value: "2024" },
    ],
  },
};

const credit = (study: CaseStudy, label: string) =>
  study.credits?.find((c) => c.label === label)?.value;

/** Poster frame convention: /folder/name.mp4 -> /folder/thumbs/name.jpg */
function posterFor(src?: string): string | undefined {
  if (!src) return undefined;
  const m = src.match(/^\/([^/]+)\/(?:new\/)?([^/.]+)\.mp4$/);
  return m ? `/${m[1]}/thumbs/${m[2]}.jpg` : undefined;
}

/**
 * Maps a case study onto the hero template. Anything the table above doesn't
 * cover falls back to the study's own fields, so a new study renders a
 * sensible hero the moment it's added.
 */
export function caseHeroProps(study: CaseStudy): CaseHeroProps {
  const meta = HERO_META[study.slug] ?? {};

  const items: MetadataItem[] =
    meta.items ??
    ([
      { label: "Company", value: credit(study, "Company") ?? study.title },
      { label: "Role", value: credit(study, "Role") ?? credit(study, "My Contribution") },
      { label: "Focus", value: credit(study, "Focus") ?? study.category },
      { label: "Time", value: credit(study, "Timeline") ?? credit(study, "Year") ?? String(study.year) },
    ].filter((item): item is MetadataItem => Boolean(item.value)));

  const hero = study.hero;
  const heroIsEmbed = Boolean(hero?.youtube);

  return {
    eyebrow: meta.eyebrow ?? study.category,
    title: study.detailTitle ?? study.tagline,
    titleAccent: meta.titleAccent,
    description: study.description,
    media: {
      src: heroIsEmbed ? undefined : hero?.src,
      video: hero?.video,
      poster: posterFor(hero?.src),
      // The art's true ratio, so the cover runs full-bleed and uncropped.
      ratio: hero?.ar,
      shade: hero?.shade ?? study.shade,
      alt: "",
    },
    ctaHref: study.websiteUrl,
    ctaLabel: "View website",
    meta: items,
    metaTags: meta.tags,
    accent: brandColor(study.slug) ?? study.accent,
    tone: "neutral",
  };
}
