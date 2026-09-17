/**
 * Work content lenses — each category switches the right-column view.
 * Visual Craft keeps the project grid; Product Strategy and Design Engineering use
 * curated lists / DE cards. About lives on its own `/about` page.
 */

export type WorkLensId = "visual" | "systems" | "engineering";

export type WorkLens = {
  id: WorkLensId;
  label: string;
  /** Deep-link hash (/#visual-craft). */
  anchor: string;
  /** Route path for this lens. */
  path: string;
};

export const WORK_LENSES: WorkLens[] = [
  { id: "visual", label: "Visual Craft", anchor: "visual-craft", path: "/" },
  { id: "systems", label: "Product Strategy", anchor: "product-strategy", path: "/product-strategy" },
  { id: "engineering", label: "Design Engineering", anchor: "design-engineering", path: "/design-engineering" },
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
  /** Category chips on the Product Strategy card. */
  badges?: string[];
  /** Ordered media shown in the Product Strategy detail carousel. */
  gallery?: Array<{
    src: string;
    caption: string;
  }>;
  year?: number;
};

/** Product Strategy — the Ikon Technologies product-lead studies. */
export const SYSTEMS_LIST: WorkListItem[] = [
  {
    id: "ikon-data-dictionary",
    slug: "ikon-data-dictionary",
    title: "One data dictionary, ~$6K/month of redundant spend cut",
    meta: "Ikon Technologies · Data Dictionary · 2024",
    body: "Catalogued internal, first-party, and third-party data with definitions aligned across teams, ending cross-team ambiguity and surfacing duplicate vendor payments worth roughly $6,000 a month.",
    thumb: "/ikon/thumbs/dictionary.jpg?v=3",
    shade: "#FFFFFF",
    badges: ["Data Strategy", "Product Enablement", "Business Analysis"],
    gallery: [
      {
        src: "/systems%20thinking/data%20dictionary_1.png",
        caption: "Unified data dictionary overview and source catalogue.",
      },
      {
        src: "/systems%20thinking/data%20dictionary_2.png",
        caption: "Data dictionary relationships and aligned definitions.",
      },
    ],
    year: 2024,
  },
  {
    id: "ikon-blueprint",
    slug: "ikon-service-blueprint",
    title: "One operational source of truth across disconnected ops",
    meta: "Ikon Technologies · Service Blueprint · 2024",
    body: "Mapped the device lifecycle end to end across accounting, operations, warehouse, and dealership, providing the blueprint NetSuite consultants used to start the warehouse management system project.",
    thumb: "/systems%20thinking/flow.png",
    shade: "#A9B2BB",
    badges: ["Service Design", "Systems Mapping", "Process Transformation"],
    gallery: [
      {
        src: "/systems%20thinking/tunr.png",
        caption: "End-to-end operational source-of-truth map.",
      },
      {
        src: "/systems%20thinking/figjam.png",
        caption: "Collaborative service-blueprint workspace in FigJam.",
      },
    ],
    year: 2024,
  },
  {
    id: "ikon-analytics",
    slug: "ikon-analytics",
    title: "A shared HEART framework replacing four conflicting scorecards",
    meta: "Ikon Technologies · Product Analytics · 2024",
    body: "Sales, ops, leadership, and product each tracked different metrics. Mapped every web and mobile workflow to HEART goals and instrumented them, giving Toolbox one shared definition of success.",
    thumb: "/systems%20thinking/Slide%2016_9%20-%2060.png",
    shade: "#FFFFFF",
    badges: ["Product Analytics", "Growth Strategy"],
    gallery: [
      {
        src: "/systems%20thinking/Slide%2016_9%20-%2060.png",
        caption: "HEART metrics framework used as the project thumbnail.",
      },
      {
        src: "/systems%20thinking/data%20analytics.png",
        caption: "Product analytics instrumentation and measurement model.",
      },
    ],
    year: 2024,
  },
  {
    id: "ikon-agentic",
    slug: "ikon-agentic-outreach",
    title: "Service appointments booked by an agent, not an operator",
    meta: "Ikon Technologies · AI/ML Integration · 2025",
    body: "Automated dealership service outreach end to end with Stella AI, identifying customers, running the call, checking live availability, and booking autonomously, with humans on exceptions only.",
    thumb: "/systems%20thinking/Slide%2016_9%20-%2061.png",
    shade: "#FFFFFF",
    badges: [
      "Strategic Partnerships",
      "Executive Alignment",
      "Agentic Outreach",
    ],
    year: 2025,
  },
];

export type EngKind =
  | "Component"
  | "Surface"
  | "Website"
  | "npm package"
  | "Marketing Landing Page"
  | "B2B SaaS tool"
  | "3D Model"
  | "Design Sandbox"
  | "Playful Side Project"
  | "3D Simulation";



export type EngContentBlock = { monoTitle?: boolean; plainMedia?: boolean; caption?: string } & (
  | { id: string; type: "text"; title?: string; body: string }
  | { id: string; type: "video"; title?: string; src: string; poster?: string; caption?: string }
  | { id: string; type: "image"; title?: string; src: string; alt: string }
  | { id: string; type: "embed"; title: string; body?: string; src: string; href?: string; linkLabel?: string }
);

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
  /** Optional secondary outbound action for design explorations. */
  explorationsHref?: string;
  explorationsLabel?: string;
  /** Same-origin (or absolute) URL loaded in the modal iframe playground. */
  embedUrl?: string;
  /** Optional ordered text, video, and embed sections below the project summary. */
  content?: EngContentBlock[];
  /** Tech stack shown under the stage. */
  stack?: string[];
  /** Process tools displayed beside the thumbnail title. */
  tools?: { name: string; logo: string; href: string }[];
  /** Short note on how it was built. */
  note?: string;
  /** Exportable source snippet — copy to clipboard in the modal. */
  code?: string;
  /** Fetches full source for copy when `code` is omitted (e.g. large standalone files). */
  codeUrl?: string;
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
    tools: [
      { name: "npm", logo: "/all-logos/npm.png?v=cf01fda6", href: "https://www.npmjs.com/" },
      { name: "Cursor", logo: "/all-logos/cursor-2.png", href: "https://cursor.com/" },
    ],
    title: "Shift Design System",
    kind: "npm package",
    body: "Tokens, components, and patterns wired for both humans and LLM-aware workflows.",
    src: "/toolbox/grid/shift-design-system.mp4",
    video: true,
    thumb: "/toolbox/thumbs/shift-design-system.jpg?v=2",
    shade: "#282828",
    stack: ["Next.js", "Design tokens", "LLM tooling"],
    note: "Surface preview from the Toolbox case study: Shift Design System 2.0.",
  },
  {
    id: "shift-playground",
    tools: [
      { name: "Cursor", logo: "/all-logos/cursor-2.png", href: "https://cursor.com/" },
      { name: "Mobbin MCP", logo: "/all-logos/mobbin.png", href: "https://mobbin.com/mcp" },
    ],
    title: "Shift Playground",
    kind: "Design Sandbox",
    body: "A live component lab for the Shift Design System. Tweak tabs, buttons, sliders, and more across dark and light modes.",
    shade: "#282828",
    thumb: "/shift-playground/thumbs/work-cover.jpg",
    src: "/shift-playground/playground.mp4",
    video: true,
    href: "https://design-playground-virid.vercel.app/",
    embedUrl: "https://design-playground-virid.vercel.app/",
    frame: "cover",
    stack: ["React", "Design tokens", "Component lab"],
    note: "Interactive playground for the Shift Design System: pick a component, tweak its props, and preview in real time.",
  },
  {
    id: "walkity-site",
    tools: [
      { name: "Lottie", logo: "/all-logos/lottie.jpg", href: "https://lottiefiles.com/" },
      { name: "Cursor", logo: "/all-logos/cursor-2.png", href: "https://cursor.com/" },
    ],
    title: "Walkity",
    kind: "Marketing Landing Page",
    body: "Brand strategy and landing page from scratch, with accessibility at the center, shipped as a live marketing site.",
    shade: "#1a1a1a",
    thumb: "/walkity/thumbs/hero-preview.jpg",
    src: "/walkity/thumbs/hero-preview.mp4",
    video: true,
    href: "https://walkity.vercel.app/",
    embedUrl: "https://walkity.vercel.app/",
    frame: "site",
    matte: "#D6E8F7",
    stack: ["Next.js", "Vercel", "Brand system"],
  },
  {
    id: "warpbnb-site",
    explorationsHref: "https://nextgendesigner.substack.com/p/reimagining-airbnb-for-time-travel",
    explorationsLabel: "View process breakdown",
    content: [
      { id: "warp-process", type: "text", monoTitle: true, title: "Process breakdown", body: "I took Warpbnb from Figma to code with Magicpath and Cursor, using Storybook to refine components and Claude Code to shape the copy. Nano Banana and Luma powered the imagery; Higgsfield and ElevenLabs brought the commercial to life. Built solo in two weeks, with hands-on curation guiding every step.", },
      { id: "warp-storybook", type: "video", plainMedia: true, src: "/warpbnb/archive/storybook.mp4", poster: "/warpbnb/archive/thumbs/storybook.jpg", caption: "Every component in isolation, all variants, all states." },
      { id: "warp-figma", type: "video", plainMedia: true, src: "/warpbnb/archive/figma-screens.mp4", poster: "/warpbnb/archive/thumbs/figma-screens.jpg", caption: "Screens drawn out the traditional way before pushing to MagicPath." },
      { id: "warp-icons", type: "image", plainMedia: true, src: "/warpbnb/archive/icons.png", alt: "Warpbnb icon explorations", caption: "The better-icons skill helped me match 64+ amenities to the right icons without a single manual instruction." },
      { id: "warp-prompts", type: "image", plainMedia: true, src: "/warpbnb/archive/prompt-arch.png", alt: "Prompt architecture for Warpbnb", caption: "The prompt architecture I drafted for each listing before touching any image generation tool." },
      { id: "warp-automation", type: "image", plainMedia: true, src: "/warpbnb/archive/automation-fail.png", alt: "An automation failure during the build", caption: "What happens when you try to automate image generation without oversight and setting guardrails." },
      { id: "warp-voiceover", type: "image", plainMedia: true, src: "/warpbnb/archive/voiceover.png", alt: "Voiceover workflow for Warpbnb", caption: "The voiceover script in ElevenLabs, with phonetic spelling and emphasis marks included." },
      { id: "warp-commercial", type: "image", plainMedia: true, src: "/warpbnb/archive/commercial.png", alt: "Commercial explorations in Higgsfield", caption: "The full commercial pipeline in Higgsfield, showing all the video generations that went into the final cut." },
    ],
    tools: [
      { name: "MagicPath", logo: "/all-logos/magicpath.png", href: "https://www.magicpath.ai/" },
      { name: "Cursor", logo: "/all-logos/cursor-2.png", href: "https://cursor.com/" },
      { name: "Reve", logo: "/all-logos/reve-2.png", href: "https://www.reve.com/" },
      { name: "Rive", logo: "/all-logos/rive.png", href: "https://rive.app/" },
      { name: "Higgsfield", logo: "/all-logos/higgsfield.png", href: "https://higgsfield.ai/" },
      { name: "Storybook", logo: "/all-logos/storybook.png", href: "https://storybook.js.org/" },
    ],
    title: "Warpbnb",
    kind: "Playful Side Project",
    body: "Full-stack fictional product site covering design, code, motion, and commercial.",
    shade: "#2b2b2b",
    thumb: "/warpbnb/thumbs/site-desktop.jpg?v=2",
    src: "/warpbnb/thumbs/site-desktop.jpg?v=2",
    href: "https://www.warpbnb.com/",
    embedUrl: "https://www.warpbnb.com/",
    frame: "site",
    matte: "#FFE4EE",
    stack: ["Next.js", "Framer Motion", "Full-stack"],
  },
  {
    id: "agave-site",
    explorationsHref: "https://app.paper.design/file/01KYASAGY134T3WXWFBZRYXGEM/2-0",
    tools: [
      { name: "Paper", logo: "/all-logos/paper-2.jpg", href: "https://paper.design/" },
      { name: "Cursor", logo: "/all-logos/cursor-2.png", href: "https://cursor.com/" },
    ],
    title: "Agave Landing Page",
    kind: "B2B SaaS tool",
    body: "A connected financial operations workspace for approvals, exceptions, expenses, and ERP sync.",
    shade: "#1a2e1c",
    thumb: "/agave/thumbs/dashboard-preview.jpg",
    src: "/agave/thumbs/dashboard-preview.jpg",
    href: "https://agave-kappa.vercel.app/",
    embedUrl: "https://agave-kappa.vercel.app/",
    content: [
      {
        id: "paper-board",
        type: "embed",
        title: "Process breakdown",
        body: "As part of my prompt-driven workflow to generate multiple iterations, I used a mix of Paper and Claude. I generated a design.md file from Agave’s website and used it with Claude to guide explorations in Paper, refining different directions into this prototype in a couple of hours.",
        src: "https://app.paper.design/file/01KYASAGY134T3WXWFBZRYXGEM/2-0",
      },
    ],
    frame: "site",
    matte: "#D8F0DC",
    stack: ["Next.js", "Vercel"],
  },
  {
    id: "f1-sim",
    tools: [
      { name: "Claude Code", logo: "/all-logos/claude.webp", href: "https://claude.com/product/claude-code" },
      { name: "Sketchfab", logo: "/all-logos/sketchfab.png", href: "https://sketchfab.com/" },
    ],
    title: "APEX F1 Sim",
    kind: "3D Simulation",
    body: "Shanghai 2026 race simulation. Watch the Chinese Grand Prix unfold, then ask why every decision happened.",
    shade: "#141414",
    thumb: "/f1-sim/thumbs/race-preview.jpg",
    src: "/f1-sim/thumbs/race-preview.mp4",
    video: true,
    href: "https://f1-sim-nine.vercel.app/",
    embedUrl: "https://f1-sim-nine.vercel.app/",
    content: [
      {
        id: "apex-process",
        type: "text",
        monoTitle: true,
        title: "Process breakdown",
        body: "Apex F1 started with licensed Sketchfab models of the Shanghai circuit and seven F1 cars, compressed with gltf-transform from ~600 MB to 23 MB for the web. With Claude Code, I generated a script to fit the racing line to the model’s painted boundaries and validated it against the real 5451 m lap length, landing within 2%. Claude Code handled the deterministic simulation in Three.js / React Three Fiber and the OpenF1 integration, while I directed the design of circuits, drivers, a quiz, predictions, and Explain Mode for newcomers. I verified the implementation with Vitest and Playwright, then tested it in the browser to catch the bugs automated checks missed.",
      },
    ],
    frame: "cover",
    stack: ["Next.js", "Vercel", "Simulation"],
  },
  {
    id: "keytag-3d",
    tools: [{ name: "Claude Code", logo: "/all-logos/claude.webp", href: "https://claude.com/product/claude-code" }],
    title: "Key Tracker 3D",
    kind: "3D Model",
    body: "Interactive 3D model of Ikon's key tracker tag. Rotate, zoom, and edit the tag ID live.",
    shade: "#050e1d",
    thumb: "/keytag/thumbs/work-cover.jpg",
    src: "/keytag/thumbnail.mp4",
    video: true,
    embedUrl: "/keytag/embed.html",
    content: [
      {
        id: "keytag-process",
        type: "text",
        monoTitle: true,
        title: "Process breakdown",
        body: "This key tag began as a 2D illustration, translated into real 3D geometry with physically based materials in three.js. I guided the proportions, materials, and interactions, with Claude Code generating the measurement scripts, model, and custom QR encoder. I validated the proportions against the illustration and verified the QR by scanning it. Editing the ID updates the serial, QR, and URL from one value. The AI-generated implementation is bundled into a single self-contained HTML file that runs hosted, off disk, or in an iframe.",
      },
      {
        id: "keytag-tools",
        type: "text",
        monoTitle: true,
        title: "Tools",
        body: "three.js, Canvas 2D, a custom QR encoder, Node for the build, Python and OpenCV for measurement and scan verification.",
      },
    ],
    frame: "cover",
    stack: ["Three.js", "WebGL", "QR generation"],
    note: "A constantly rotating 3D key tracker tag with live QR code updates.",
  },
  {
    id: "retell-benchmark",
    tools: [
      { name: "Paper", logo: "/all-logos/paper-2.jpg", href: "https://paper.design/" },
      { name: "Cursor", logo: "/all-logos/cursor-2.png", href: "https://cursor.com/" },
    ],
    title: "Retell Model Benchmark",
    kind: "Website",
    body: "Compare leading AI models across response quality, speed, and cost, built for voice-agent tradeoffs.",
    shade: "#0E1626",
    thumb: "/retell/thumbs/scroll-preview.jpg",
    src: "/retell/thumbs/scroll-preview.mp4",
    video: true,
    href: "https://retell-design.vercel.app/",
    embedUrl: "https://retell-design.vercel.app/",
    frame: "site",
    matte: "#E4ECF8",
    stack: ["Next.js", "Vercel"],
  },
];
