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
  /** Overrides the default "View Website" CTA label. */
  ctaLabel?: string;
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
    ],
    tags: {
      label: "Industry",
      values: split("Automotive, IoT Hardware, RevOps"),
    },
  },

  warpbnb: {
    titleAccent: "Airbnb for time travel",
    items: [
      { label: "Company", value: "Warpbnb" },
      { label: "Role", value: "Everything: design, code, content, motion, film" },
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
      { label: "Client", value: "VisIoT Technologies Pvt. Ltd." },
      { label: "Role", value: "Head of Design" },
    ],
    tags: {
      label: "Focus area",
      values: split("Brand Strategy, Visual Identity, Web Design"),
    },
  },

  bigbasket: {
    titleAccent: "Design System for India's largest grocery delivery app",
    items: [
      { label: "Company", value: "BigBasket" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "Design System Foundations, Components, Documentation, Cross-Platform Patterns",
      ),
    },
  },

  /* Ikon Technologies — Product Lead. Same company and role across all four;
     only the focus-area tags change. */
  "ikon-analytics": {
    titleAccent: "HEART-driven framework",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Role", value: "Product Lead" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "HEART Framework, Success Metrics, Event Instrumentation, Heap, Smartlook, Google Analytics",
      ),
    },
  },

  "ikon-service-blueprint": {
    titleAccent: "single source of truth",
    ctaLabel: "View Process Map",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Role", value: "Product Lead" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "Cross-Functional Discovery, Device Lifecycle Mapping, Business Rules, HubSpot, NetSuite, Zoho",
      ),
    },
  },

  "ikon-data-dictionary": {
    titleAccent: "unified data dictionary",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Role", value: "Product Lead" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "Stakeholder Interviews, Data Cataloguing, Flow Mapping, Vendor Consolidation, BI Partnership",
      ),
    },
  },

  "ikon-agentic-outreach": {
    titleAccent: "agentic outreach",
    items: [
      { label: "Company", value: "Ikon Technologies" },
      { label: "Role", value: "Product Lead" },
    ],
    tags: {
      label: "Focus area",
      values: split(
        "Agentic Workflows, Stella AI, Service Scheduling, Vendor Partnership, Pilot Measurement",
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
    ctaLabel: meta.ctaLabel ?? "View Website",
    meta: items,
    metaTags: meta.tags,
    accent: brandColor(study.slug) ?? study.accent,
    tone: "neutral",
  };
}
