/**
 * Work content lenses — each category switches the right-rail view.
 * Visual Craft keeps the project grid; the rest use curated lists / DE cards.
 */

export type WorkLensId = "visual" | "systems" | "engineering";

export type WorkLens = {
  id: WorkLensId;
  label: string;
};

export const WORK_LENSES: WorkLens[] = [
  { id: "visual", label: "Visual Craft" },
  { id: "systems", label: "Systems Thinking" },
  { id: "engineering", label: "Design Engineering" },
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

/** Systems Thinking — systems work + outcomes in one list. */
export const SYSTEMS_LIST: WorkListItem[] = [
  {
    id: "melon",
    slug: "bigbasket",
    title: "Hundreds of drifted styles → one Melon system",
    meta: "BigBasket · Design Systems · 2021",
    body: "Audited hundreds of drifted colors, text styles, and elevations, then built Melon — foundations, components, and patterns shared across India's largest grocery app.",
    thumb: "/bigbasket/thumbnail.png?v=2",
    shade: "#242424",
  },
  {
    id: "toolbox-system",
    slug: "toolbox",
    title: "One LLM-ready system behind every dealer workflow",
    meta: "Ikon Technologies · Design Engineering · 2025",
    body: "An LLM-aware design system exposing tokens and components to the model — the shared layer behind inventory, keys, service, and dealer workflows.",
    thumb: "/toolbox/thumbs/cover2.jpg",
    shade: "#282828",
  },
  {
    id: "region-comments",
    slug: "pathai",
    title: "Second opinions on the slide — not in email",
    meta: "PathAI · Product Design · 2022",
    body: "A contextual system for second opinions on digital slides — replacing screenshots and email with a workflow pathologists actually use.",
    thumb: "/pathai/thumbs/path1.jpg",
    shade: "#282828",
  },
  {
    id: "ikon-ops",
    title: "Fragmented dealership tools → one operating model",
    meta: "Ikon Technologies · Product Management · 2024",
    body: "Untangled fragmented dealership tools into a clearer operating model — aligning design, product, and engineering around one system.",
    thumb: "/logos/ikon.png",
    shade: "#262626",
  },
  {
    id: "dealerships",
    slug: "toolbox",
    title: "134 new dealerships before launch",
    meta: "Ikon Technologies · Toolbox · 2025",
    body: "Pre-launch drove a 33% surge in dealership signups and secured 134 new dealerships before public release, with Toolbox showcased at NADA 2025.",
    thumb: "/toolbox/thumbs/cover2.jpg",
    shade: "#282828",
  },
  {
    id: "pathology-speed",
    slug: "pathai",
    title: "~45% faster second opinions",
    meta: "PathAI · Region Comments · 2022",
    body: "Shipped in Q4 2022 and cut second-opinion turnaround by ~45%, with adoption expanding into QA, tumor boards, teaching, and research.",
    thumb: "/pathai/thumbs/path1.jpg",
    shade: "#282828",
  },
  {
    id: "melon-impact",
    slug: "bigbasket",
    title: "One shared language across grocery UX",
    meta: "BigBasket · Melon · 2021",
    body: "A documented design system that streamlined UX process and gave designers and engineers a common language for cohesive experiences.",
    thumb: "/bigbasket/thumbnail.png?v=2",
    shade: "#242424",
  },
  {
    id: "warpbnb-ship",
    slug: "warpbnb",
    title: "Zero to shipped in two weeks",
    meta: "Warpbnb · Full-Stack AI Build · 2025",
    body: "Solo end-to-end build — design, code, imagery, content, and a commercial — proving AI can expand velocity when taste still leads.",
    thumb: "/warpbnb/thumbs/warp11.jpg",
    shade: "#2b2b2b",
  },
];

export type EngKind = "Component" | "Surface" | "Website";

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
};

/** Design Engineering — component / surface / site cards. Click opens a detail modal. */
export const ENG_COMPONENTS: EngComponent[] = [
  {
    id: "warpbnb-search",
    title: "Warpbnb search",
    kind: "Component",
    body: "Theme, era, and guests — play with the Warpbnb search field live.",
    shade: "#FFE4EE",
    thumb: "/warpbnb/thumbs/search-field.png",
    src: "/warpbnb/thumbs/search-field.png",
    embedUrl: "/labs/search",
    embedTall: true,
    stack: ["React", "Inline tokens", "No deps"],
  },
  {
    id: "walkity-site",
    title: "Walkity",
    kind: "Website",
    body: "Brand strategy and landing page from scratch — accessibility at the center, shipped as a live marketing site.",
    shade: "#1a1a1a",
    thumb: "/walkity/thumbs/site-desktop.jpg",
    src: "/walkity/thumbs/site-desktop.jpg",
    href: "https://walkity.vercel.app/",
    embedUrl: "https://walkity.vercel.app/",
    embedTall: true,
    stack: ["Next.js", "Vercel", "Brand system"],
  },
  {
    id: "ds",
    title: "Design system",
    kind: "Component",
    body: "Tokens, components, and patterns wired for both humans and LLM-aware workflows.",
    src: "/toolbox/grid/design-system.mp4",
    video: true,
    thumb: "/toolbox/thumbs/design-system.jpg",
    shade: "#282828",
    stack: ["Next.js", "Design tokens", "LLM tooling"],
    note: "Surface preview for now — a playable embed can slot in via embedUrl when the lab is ready.",
  },
  {
    id: "ai-chat",
    title: "AI chat",
    kind: "Surface",
    body: "Conversational interface for dealer ops — context-aware and production-shaped.",
    src: "/toolbox/grid/ai-chat.mp4",
    video: true,
    thumb: "/toolbox/thumbs/ai-chat.jpg",
    shade: "#282828",
    stack: ["Next.js", "Framer Motion"],
    note: "Product surface captured from Toolbox. Interactive embed lands when the chat lab ships.",
  },
  {
    id: "inventory",
    title: "Inventory",
    kind: "Surface",
    body: "Dealership inventory flows rebuilt as a coherent operating surface.",
    src: "/toolbox/grid/inventory.mp4",
    video: true,
    thumb: "/toolbox/thumbs/inventory.jpg",
    shade: "#282828",
    stack: ["Next.js", "React"],
    note: "Ops surface preview — built end-to-end in Toolbox, shown here as motion capture until a live embed exists.",
  },
  {
    id: "config",
    title: "Configurations",
    kind: "Surface",
    body: "Complex dealer configuration made scannable and shippable.",
    src: "/toolbox/grid/configurations.mp4",
    video: true,
    thumb: "/toolbox/thumbs/configurations.jpg",
    shade: "#282828",
    stack: ["Next.js", "Framer Motion"],
    note: "Dense settings UI designed for scan speed. Embed optional later for deeper exploration.",
  },
  {
    id: "pairing",
    title: "Device pairing",
    kind: "Component",
    body: "Hardware ↔ software pairing with clear states and recovery paths.",
    src: "/toolbox/grid/device-pairing.mp4",
    video: true,
    thumb: "/toolbox/thumbs/device-pairing.jpg",
    shade: "#282828",
    stack: ["Next.js", "React", "IoT states"],
    note: "State machine UI for pairing — preview via capture; a lab embed can replace the stage when ready.",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    kind: "Surface",
    body: "Ops overview for dealers — signal over noise, built in product.",
    src: "/toolbox/grid/dashboard.mp4",
    video: true,
    thumb: "/toolbox/thumbs/dashboard.jpg",
    shade: "#282828",
    stack: ["Next.js", "React"],
    note: "Dashboard as shipped in Toolbox. Review mode until an interactive slice is extracted.",
  },
  {
    id: "invoices",
    title: "Invoices",
    kind: "Surface",
    body: "Billing and invoice flows designed and engineered as one surface.",
    src: "/toolbox/grid/invoices.mp4",
    video: true,
    thumb: "/toolbox/thumbs/invoices.jpg",
    shade: "#282828",
    stack: ["Next.js", "Framer Motion"],
    note: "Billing surface preview from production motion captures.",
  },
  {
    id: "gateways",
    title: "Gateways",
    kind: "Component",
    body: "Gateway management UI for IoT hardware at dealership scale.",
    src: "/toolbox/grid/gateways.mp4",
    video: true,
    thumb: "/toolbox/thumbs/gateways.jpg",
    shade: "#282828",
    stack: ["Next.js", "React", "IoT"],
    note: "Hardware management component — capture for now, live lab later.",
  },
  {
    id: "warpbnb-site",
    title: "Warpbnb.com",
    kind: "Website",
    body: "Full-stack fictional product site — design, code, motion, and commercial.",
    src: "/warpbnb/grid/warp11.mp4",
    video: true,
    thumb: "/warpbnb/thumbs/warp11.jpg",
    shade: "#2b2b2b",
    href: "https://www.warpbnb.com/",
    stack: ["Next.js", "Framer Motion", "Full-stack"],
    note: "Solo end-to-end build. Open the live site from the modal — no embed, just the real destination.",
  },
];
