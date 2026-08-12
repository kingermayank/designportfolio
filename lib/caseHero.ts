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
    titleAccent: "unlock Ikon's largest customer expansion.",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Role", value: "Lead Product Designer, Design Engineer" },
      { label: "Focus", value: "Design Engineering" },
    ],
    tags: {
      label: "Industry",
      values: split("Automotive, IoT Hardware"),
    },
  },

  warpbnb: {
    titleAccent: "Airbnb for time travel",
    items: [
      { label: "Company", value: "Warpbnb" },
      { label: "Role", value: "Everything: design, code, content, motion, film" },
      { label: "Focus", value: "Full-Stack AI Build" },
    ],
    tags: {
      label: "Tools",
      values: split(
        "Figma, Magicpath, Cursor, Storybook, Claude Code, Codex, Supabase, Vercel, Gemini, Luma Dream Machine, Higgsfield, Topaz Bloom, Replicate, ElevenLabs, Final Cut Pro",
      ),
    },
  },

  pathai: {
    titleAccent: "speed and confidence.",
    items: [
      { label: "Company", value: "PathAI" },
      { label: "Focus", value: "Product Design" },
      { label: "Team", value: "Me, Sandy Zhu, Riley Hunter, Jamie Harisiades, 5× SWE" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "User Research, Stakeholder Alignment, Interaction Design, Rapid Prototyping, User Testing, Handoff",
      ),
    },
  },

  walkity: {
    titleAccent: "brand strategy and landing page",
    items: [
      { label: "Company", value: "Walkity" },
      { label: "Focus", value: "Accessibility-centered brand and web experience" },
    ],
    tags: {
      label: "Role",
      values: split("Brand Strategy, Visual Identity, Landing Page Design"),
    },
  },

  bigbasket: {
    titleAccent: "design system",
    items: [
      { label: "Company", value: "BigBasket" },
      { label: "Focus", value: "Design Systems" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "Design System Foundations, Components, Documentation, Cross-Platform Patterns",
      ),
    },
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

const withPeriod = (text: string) =>
  /[.!?]$/.test(text.trim()) ? text : `${text.trim()}.`;

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
    ].filter((item): item is MetadataItem => Boolean(item.value)));

  const hero = study.hero;
  const heroIsEmbed = Boolean(hero?.youtube);

  return {
    title: withPeriod(study.detailTitle ?? study.tagline),
    titleAccent: meta.titleAccent,
    description: study.description,
    media: {
      src: heroIsEmbed ? undefined : hero?.src,
      video: hero?.video,
      poster: posterFor(hero?.src),
      // The art's true ratio, so the cover runs full-bleed and uncropped.
      ratio: hero?.ar,
      shade: hero?.shade ?? study.shade,
      scrim: hero?.scrim,
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
