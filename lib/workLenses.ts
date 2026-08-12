/**
 * Work content lenses — each category is one section of the work column.
 * Visual Craft keeps the project grid; the rest use curated lists / DE cards.
 * The three stack in this order and the panel rail scroll-spies between them.
 */

export type WorkLensId = "visual" | "systems" | "engineering" | "about";

export type WorkLens = {
  id: WorkLensId;
  label: string;
  /** Section DOM id — also the deep-link hash (/#visual-craft). */
  anchor: string;
};

export const WORK_LENSES: WorkLens[] = [
  { id: "visual", label: "Visual Craft", anchor: "visual-craft" },
  { id: "systems", label: "Systems Thinking", anchor: "systems-thinking" },
  { id: "engineering", label: "Design Engineering", anchor: "design-engineering" },
  { id: "about", label: "About Me", anchor: "about-me" },
];

export type WorkListItem = {
  id: string;
  /** Opens this case study when present. */
  slug?: string;
  title: string;
  meta: string;
  body: string;
  thumb?: string;
  shade: string;
};

/** Systems Thinking — the Ikon Technologies product-lead studies. */
export const SYSTEMS_LIST: WorkListItem[] = [
  {
    id: "ikon-analytics",
    slug: "ikon-analytics",
    title: "A shared HEART framework replacing four conflicting scorecards",
    meta: "Ikon Technologies · Product Analytics · 2024",
    body: "Sales, ops, leadership, and product each tracked different metrics. Mapped every web and mobile workflow to HEART goals and instrumented them, giving Toolbox one shared definition of success.",
    thumb: "/ikon/thumbs/analytics.jpg",
    shade: "#A9B2BB",
  },
  {
    id: "ikon-blueprint",
    slug: "ikon-service-blueprint",
    title: "One operational source of truth across disconnected ops",
    meta: "Ikon Technologies · Service Blueprint · 2024",
    body: "Mapped the device lifecycle end to end across accounting, operations, warehouse, and dealership — the blueprint NetSuite consultants used to start the warehouse management system project.",
    thumb: "/ikon/thumbs/blueprint.jpg",
    shade: "#A9B2BB",
  },
  {
    id: "ikon-data-dictionary",
    slug: "ikon-data-dictionary",
    title: "One data dictionary, ~$6K/month of redundant spend cut",
    meta: "Ikon Technologies · Data Dictionary · 2024",
    body: "Catalogued internal, first-party, and third-party data with definitions aligned across teams — ending cross-team ambiguity and surfacing duplicate vendor payments worth roughly $6,000 a month.",
    thumb: "/ikon/thumbs/dictionary.jpg",
    shade: "#FFFFFF",
  },
  {
    id: "ikon-agentic",
    slug: "ikon-agentic-outreach",
    title: "Service appointments booked by an agent, not an operator",
    meta: "Ikon Technologies · AI/ML Integration · 2025",
    body: "Automated dealership service outreach end to end with Stella AI — identifying customers, running the call, checking live availability, and booking autonomously, with humans on exceptions only.",
    thumb: "/ikon/thumbs/agentic.jpg",
    shade: "#FFFFFF",
  },
];

export type EngKind =
  | "Component"
  | "Surface"
  | "Website"
  | "npm package"
  | "Marketing Landing Page"
  | "B2B SaaS tool";



export type EngComponent = {
  id: string;
  title: string;
  kind: EngKind;
  body: string;
  src?: string;
  video?: boolean;
  thumb?: string;
  shade: string;
  /** Live site — websites use this as the primary outbound action. */
  href?: string;
  /** Same-origin (or absolute) URL loaded in the modal iframe playground. */
  embedUrl?: string;
  /** Tech stack shown under the stage. */
  stack?: string[];
  /** Short note on how it was built. */
  note?: string;
  /** Exportable source snippet — copy to clipboard in the modal. */
  code?: string;
  /** Fetches full source for copy when `code` is omitted (e.g. large standalone files). */
  codeUrl?: string;
  /** Taller iframe stage for components with dropdowns / popovers. */
  embedTall?: boolean;
  /**
   * Card cover framing:
   * - `cover` default fill
   * - `center` contain + centered (Warpbnb search)
   * - `site` 0.8× sheet flush to bottom with L/T/R matte
   */
  frame?: "cover" | "center" | "site";
  /** Matte behind a `site` / `center` frame (left, top, right). */
  matte?: string;
};

/** Design Engineering — component / surface / site cards. Click opens a detail modal. */
export const ENG_COMPONENTS: EngComponent[] = [
  {
    id: "ds",
    title: "Shift Design System",
    kind: "npm package",
    body: "Tokens, components, and patterns wired for both humans and LLM-aware workflows.",
    src: "/toolbox/grid/shift-design-system.mp4",
    video: true,
    thumb: "/toolbox/thumbs/shift-design-system.jpg?v=2",
    shade: "#282828",
    stack: ["Next.js", "Design tokens", "LLM tooling"],
    note: "Surface preview from the Toolbox case study — Shift Design System 2.0.",
  },
  {
    id: "warpbnb-search",
    title: "Search Bar",
    kind: "Component",
    body: "Theme, era, and guests — play with the Warpbnb search field live.",
    shade: "#FFE4EE",
    thumb: "/warpbnb/search_de.png",
    src: "/warpbnb/search_de.png",
    embedUrl: "/labs/search",
    embedTall: true,
    frame: "cover",
    matte: "#FFE4EE",
    stack: ["React", "Inline tokens", "No deps"],
  },
  {
    id: "walkity-site",
    title: "walkity.com",
    kind: "Marketing Landing Page",
    body: "Brand strategy and landing page from scratch — accessibility at the center, shipped as a live marketing site.",
    shade: "#1a1a1a",
    thumb: "/walkity/thumbs/site-desktop.jpg",
    src: "/walkity/thumbs/site-desktop.jpg",
    href: "https://walkity.vercel.app/",
    embedUrl: "https://walkity.vercel.app/",
    embedTall: true,
    frame: "site",
    matte: "#D6E8F7",
    stack: ["Next.js", "Vercel", "Brand system"],
  },
  {
    id: "warpbnb-site",
    title: "warpbnb.com",
    kind: "Website",
    body: "Full-stack fictional product site — design, code, motion, and commercial.",
    shade: "#2b2b2b",
    thumb: "/warpbnb/thumbs/site-desktop.jpg?v=2",
    src: "/warpbnb/thumbs/site-desktop.jpg?v=2",
    href: "https://www.warpbnb.com/",
    embedUrl: "https://www.warpbnb.com/",
    embedTall: true,
    frame: "site",
    matte: "#FFE4EE",
    stack: ["Next.js", "Framer Motion", "Full-stack"],
  },
  {
    id: "agave-site",
    title: "Agave Landing Page",
    kind: "B2B SaaS tool",
    body: "Password-gated design assessment landing — one connected view of financial operations.",
    shade: "#1a2e1c",
    thumb: "/agave/thumbs/site-desktop.jpg",
    src: "/agave/thumbs/site-desktop.jpg",
    href: "https://agave-kappa.vercel.app/",
    embedUrl: "https://agave-kappa.vercel.app/",
    embedTall: true,
    frame: "site",
    matte: "#D8F0DC",
    stack: ["Next.js", "Vercel"],
  },
];
