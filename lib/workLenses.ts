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
    thumb: "/bigbasket/thumbs/cover.jpg",
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
    slug: "ikon-pm",
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
    thumb: "/bigbasket/thumbs/cover.jpg",
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

export type EngComponent = {
  id: string;
  title: string;
  kind: "Component" | "Surface" | "Website";
  body: string;
  src: string;
  video?: boolean;
  thumb?: string;
  shade: string;
  /** Optional case study to open from the expanded state. */
  slug?: string;
};

/** Design Engineering — expandable component / surface / site cards. */
export const ENG_COMPONENTS: EngComponent[] = [
  {
    id: "ds",
    title: "Design system",
    kind: "Component",
    body: "Tokens, components, and patterns wired for both humans and LLM-aware workflows.",
    src: "/toolbox/grid/design-system.mp4",
    video: true,
    thumb: "/toolbox/thumbs/design-system.jpg",
    shade: "#282828",
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "toolbox",
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
    slug: "warpbnb",
  },
];
