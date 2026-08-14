export type CaseMedia = {
  shade: string; // placeholder / letterbox fill
  src?: string; // real asset in /public, or YouTube watch/embed URL when youtube
  video?: boolean;
  /** Embed a YouTube player instead of a local image/video. */
  youtube?: boolean;
  ar?: number; // natural aspect ratio (width / height); defaults to 16/9
  /** How the asset fills the frame. Default cover; contain letterboxes into `shade`. */
  fit?: "cover" | "contain";
  /** Inset the asset inside the frame (px). Use with `fit: "contain"` to pad into `shade`. */
  pad?: { top?: number; bottom?: number; left?: number; right?: number };
  /** HTML video playbackRate (1 = normal). */
  playbackRate?: number;
  /**
   * Flat black overlay on the hero. `true` = 80% (Toolbox default);
   * a number is opacity 0–1 (e.g. 0.2 for PathAI).
   */
  scrim?: boolean | number;
  caption?: string;
};

export type CaseSection = {
  nav: string;
  heading?: string;
  body: string[];
  media: CaseMedia[];
};

/** Interactive embed rendered inside a case-study media stack. */
export type MediaEmbedId =
  | "pathai-comment-states"
  | "pathai-comment-anatomy"
  | "pathai-region-edge-cases";

/** Full-width row, or left tile + right column (one or more stacked). */
export type MediaBlock =
  | {
      type: "full";
      media: CaseMedia;
      /** Edge-to-edge — breaks out of the editorial content max-width. */
      bleed?: boolean;
    }
  | {
      type: "split";
      left: CaseMedia;
      right: CaseMedia[];
      /** When false, left keeps its natural AR instead of stretching to the right stack. */
      fillLeft?: boolean;
      /** Column flex fractions for left / right. Defaults to equal `[1, 1]`. */
      columns?: [number, number];
    }
  | {
      type: "embed";
      embed: MediaEmbedId;
      shade: string;
      ar: number;
    };

export type CaseHighlight = {
  label: string;
  body: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** Optional Cesare headline on the detail page (falls back to title). */
  detailTitle?: string;
  tagline: string;
  description: string;
  year: number;
  category: string;
  shade: string;
  hero?: CaseMedia;
  /** Work 1 card uses a still (hero thumb) instead of looping the hero video. */
  workStill?: boolean;
  /** Optional Work 1 cover (still or video) — overrides hero / workStill on the grid. */
  workCover?: string;
  credits?: { label: string; value: string }[];
  sections: CaseSection[];
  /** Right column is a stacked media grid only — no body copy or captions. */
  mediaOnly?: boolean;
  /** Optional editorial layout for mediaOnly studies (falls back to flat section media). */
  mediaBlocks?: MediaBlock[];
  /** Left-rail Motivation / Approach / Outcome (or Problem / Solution / Impact). */
  highlights?: CaseHighlight[];
  /** Closing impact line rendered under the media stack on editorial studies. */
  impact?: string;
  /** Live product link shown as a CTA on the detail left rail. */
  websiteUrl?: string;
  /** Brand accent for highlight labels (and website CTA). */
  accent?: string;
  /**
   * When false, the project is not linked to a case-study page.
   * Defaults to true. Use with `externalUrl` for outbound Work-grid links.
   */
  linkable?: boolean;
  /** Opens from the Work grid in a new tab instead of a case-study route. */
  externalUrl?: string;
  /**
   * When false, the study is kept out of the Visual Craft project grid but
   * still gets a case-study page. For work that belongs to another lens —
   * the Ikon PM studies live under Systems Thinking. Defaults to true.
   */
  inWorkGrid?: boolean;
};

const G = "#262626";

/* ------------------------------------------------------------------ *
 * Ikon Technologies — Toolbox
 * ------------------------------------------------------------------ */

const tb = (
  src: string,
  ar: number,
  video?: boolean,
  caption?: string,
  extras?: Partial<CaseMedia>,
): CaseMedia => ({
  shade: "#282828",
  src,
  ar,
  video,
  caption,
  ...extras,
});

/** Desktop product shots — 16:9 frame, gray mat, vertical inset. */
const tbDesktop = (src: string, caption: string): CaseMedia =>
  tb(src, 16 / 9, true, caption, {
    shade: "#BCBEC4",
    fit: "contain",
    pad: { top: 64, bottom: 64 },
  });

const toolbox: CaseStudy = {
  slug: "toolbox",
  title: "Ikon Technologies",
  detailTitle:
    "Redesigning Toolbox into an enterprise-ready platform that helped unlock Ikon's largest customer expansion.",
  tagline: "An enterprise-ready platform for dealership operations.",
  description:
    "I led everything design-related for Toolbox as we onboarded dealerships from legacy to the new NextGen platform — 450 dealerships onboarded, and 40 directions across 450 relationships migrated from legacy. Showcasing the product at NADA 2026 drove 132 more dealership signups.",
  year: 2025,
  category: "Design Engineering",
  shade: "#282828",
  mediaOnly: true,
  accent: "#03BB7D", // Ikon brand green
  highlights: [
    {
      label: "Problem",
      body: "Dealership tools were fragmented across the legacy business, making inventory, keys, service, and customer workflows harder to run as one system.",
    },
    {
      label: "Approach",
      body: "Led Toolbox end to end as solo designer, then shifted into design engineering to build an AI-native dealer operating system on a shared component foundation.",
    },
    {
      label: "Outcome",
      body: "Pre-launch drove a 33% surge in dealership signups and secured 134 new dealerships before public release, with Toolbox showcased at NADA 2025.",
    },
  ],
  // Work card thumbnail video; case hero keeps the live-site hero reel.
  workCover: "/toolbox/thumbnail.mp4",
  hero: {
    shade: "#282828",
    src: "/toolbox/hero.mp4",
    video: true,
    ar: 16 / 9,
    scrim: true,
  },
  mediaBlocks: [
    // Filenames on disk are out of sync with content — map by what's in the frame.
    {
      type: "full",
      media: tbDesktop(
        "/toolbox/inventory.mp4", // Agent chat UI
        "Giving dealers a conversational way to understand inventory, customers, service opportunities, and operational risks.",
      ),
    },
    {
      type: "full",
      media: tbDesktop(
        "/toolbox/configurations.mp4", // Inventory map
        "Helping sales teams find vehicles and keys faster so customers are not left waiting during test drives.",
      ),
    },
    {
      type: "full",
      media: tbDesktop(
        "/toolbox/device-pairing.mp4", // Configurations
        "Giving dealers control over sell-first rules and battery thresholds so they can prioritize the right vehicles before problems happen.",
      ),
    },
    {
      type: "full",
      // Phone mockups already include their own gray art — no CSS mat/padding.
      media: tb(
        "/toolbox/dashboard.mp4",
        16 / 9,
        true,
        "Making the pairing process reliable and frustration-free to prevent returning perfectly good hardware.",
      ),
    },
    {
      type: "full",
      media: tbDesktop(
        "/toolbox/invoices.mp4", // Dashboard
        "Helping dealers monitor operational health and catch issues before they become costly problems.",
      ),
    },
    {
      type: "full",
      media: tbDesktop(
        "/toolbox/invoices-ui.mp4", // Invoices
        "Reducing billing confusion by bringing invoice visibility and dispute resolution into the dealer's portal.",
      ),
    },
    {
      type: "full",
      media: tbDesktop(
        "/toolbox/gateways.mp4",
        "Bringing key-tracking infrastructure in-house to improve location accuracy and reduce operational costs.",
      ),
    },
  ],
  impact:
    "Toolbox pre-launch drove a 33% surge in dealership customers.",
  credits: [
    { label: "Company", value: "Ikon Technologies" },
    { label: "Industry", value: "Automotive, IoT Hardware" },
    { label: "Role", value: "Lead Product Designer, Design Engineer" },
  ],
  sections: [
    {
      nav: "Overview",
      body: [
        "Redesigning Toolbox into an enterprise-ready platform that helped unlock Ikon's largest customer expansion.",
      ],
      media: [],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Warpbnb
 * ------------------------------------------------------------------ */

const wb = (
  src: string,
  ar: number,
  video?: boolean,
): CaseMedia => ({
  shade: "#2b2b2b",
  src,
  ar,
  video,
});

const warpbnb: CaseStudy = {
  slug: "warpbnb",
  title: "Warpbnb",
  detailTitle: "Reimagining Airbnb for time travel across eras.",
  tagline: "Reimagining Airbnb for time travel across eras.",
  description:
    "A process breakdown of a fictional side project done end to end: design, code, images, content, and a video commercial, all using AI. Two weeks, solo, zero to shipped.",
  year: 2025,
  category: "Full-Stack AI Build",
  shade: "#2b2b2b",
  websiteUrl: "https://www.warpbnb.com/",
  accent: "#FF0459",
  mediaOnly: true,
  highlights: [
    {
      label: "Motivation",
      body: "Explore how far one designer could take an idea end to end with AI, without losing taste, humor, or craft.",
    },
    {
      label: "Approach",
      body: "Reimagined Airbnb for time travel, then designed, coded, populated, animated, and marketed the entire fictional product as a solo experiment.",
    },
    {
      label: "Outcome",
      body: "Shipped a polished, full-stack experience in two weeks, demonstrating how AI can expand execution while human judgment continues to define quality.",
    },
  ],
  // Detail hero stays on warp11; Work 1 card uses warp12 from /warpbnb/new.
  workCover: "/warpbnb/thumbnail.mp4",
  hero: {
    shade: "#2b2b2b",
    src: "/warpbnb/cover.png",
    ar: 16 / 9,
    scrim: 0.6,
  },
  // Numbered stack: 3-1 / 3-2 sit side by side; the commercial closes it out.
  mediaBlocks: [
    { type: "full", media: wb("/warpbnb/warp1.png", 3840 / 2160) },
    { type: "full", media: wb("/warpbnb/warp2.png", 2146 / 1138) },
    {
      type: "split",
      // Wide clips letterboxed into matching square frames (white bars top/bottom).
      left: {
        shade: "#ffffff",
        src: "/warpbnb/warp3-1.mp4",
        video: true,
        ar: 1,
        fit: "contain",
      },
      right: [
        {
          shade: "#ffffff",
          src: "/warpbnb/warp3-2.mp4",
          video: true,
          ar: 1,
          fit: "contain",
        },
      ],
    },
    { type: "full", media: wb("/warpbnb/warp4.png", 4066 / 2285) },
    { type: "full", media: wb("/warpbnb/warp5.png", 4074 / 2292) },
    { type: "full", media: wb("/warpbnb/warp6.mp4", 1922 / 1080, true) },
    { type: "full", media: wb("/warpbnb/warp7.mp4", 3340 / 2160, true) },
    { type: "full", media: wb("/warpbnb/warp8.mp4", 1920 / 1080, true) },
    {
      type: "full",
      media: {
        shade: "#2b2b2b",
        src: "https://www.youtube.com/watch?v=2JfVbt3C4Q8",
        youtube: true,
        ar: 16 / 9,
      },
    },
  ],
  credits: [
    {
      label: "Tools",
      value:
        "Figma, Magicpath, Cursor, Storybook, Claude Code, Codex, Supabase, Vercel, Gemini, Luma Dream Machine, Higgsfield, Topaz Bloom, Replicate, ElevenLabs, Final Cut Pro",
    },
    { label: "Timeline", value: "~2 weeks, mostly at night" },
    { label: "Role", value: "Everything: design, code, content, motion, film" },
  ],
  sections: [
    {
      nav: "The Idea",
      heading: "Building the story before building the UI.",
      body: [
        "Years ago I came across the Amazon Dating concept on Twitter and always wanted to make something similar: a little funny, a little absurd, but instantly understandable. With AI I finally had the superpowers to build and ship an idea like that end to end.",
        "Brainstorming with ChatGPT produced Warpbnb: Airbnb, but for booking stays across different eras. The goal was never a real product. It was a fictional one that let me put every AI-adjacent skill into practice: design, code, copywriting, image generation, motion, even a full commercial. Everything it takes to build and sell a product, inside a single experiment.",
        "Best case, I'd make something cool. Worst case, I'd learn a lot. It ended up being both.",
      ],
      media: [],
    },
    {
      nav: "Design → Code",
      heading: "From design file to pixel-perfect code.",
      body: [
        "I started in Figma, drawing screens out the traditional way to figure out what this thing should look like. For the first design-to-code pass I used Magicpath, the fastest way to get a structured base out of a Figma frame and into code.",
        "Then I connected Cursor to Figma's MCP and exported all my design tokens (colors, typography, spacing) as JSON into the codebase. This is the step most people skip. When Cursor has the actual values it uses them; when it doesn't, it guesses, and its guesses are close enough to be annoying and wrong enough to cost you time.",
        "I installed Storybook and had the agent create stories for every component, each in isolation, all variants, all states. That's where I did design QA: padding off, hover states not triggering, dark mode breaking. A full-page review hides these things; Storybook does not. Once the foundation was in, everything downstream got dramatically easier. Mobile responsiveness was a prompt. The hard part is always the beginning; after that you're mostly directing.",
      ],
      media: [
        { shade: G, src: "/warpbnb/figma-screens.mp4", video: true, ar: 1.56, caption: "Screens drawn out the traditional way before pushing to MagicPath." },
        { shade: G, src: "/warpbnb/storybook.mp4", video: true, ar: 1.55, caption: "Every component in isolation, all variants, all states." },
      ],
    },
    {
      nav: "Vibe Content",
      heading: "The work is choosing, not prompting.",
      body: [
        "Getting the shell into code is one thing; filling it with real content is another. Not a single line of copy on Warpbnb was written by me; all of it was AI-generated. I wanted the voice unhinged, funny, and a little absurd, so I trained a Claude skill on examples of the style I wanted and had it generate everything: era descriptions, listing taglines, button text, house rules.",
        "The trick is not prompting harder. It's giving the model specific examples to work from. Show it the style you want and it picks it up, rather than typing \"make it funny\" for the 50th time and hoping.",
        "For iconography I pointed a better-icons skill at the codebase. It read the amenity copy, understood each item, and matched it to the right Lucide icon using related names and tags: 64+ amenities, no manual list, done in under five minutes.",
      ],
      media: [
        { shade: G, src: "/warpbnb/reviews.mp4", video: true, ar: 1.78, caption: "Guest reviews generated with a custom-trained skill." },
        { shade: G, src: "/warpbnb/icons.png", ar: 1.78, caption: "64+ amenities matched to icons without a single manual instruction." },
        { shade: G, src: "/warpbnb/thiings.png", ar: 1.78, caption: "thiings.co handled most of the 3D illustration heavy lifting." },
      ],
    },
    {
      nav: "Image-Gen",
      heading: "Curating takes more time than you think.",
      body: [
        "Six image types per listing: exterior, bedroom, restroom, living room, kitchen, and more. Each started with a prompt structure drafted in ChatGPT to get the architecture right before touching any generation tool.",
        "The part that took longest was not generating; it was curating. I spent more time deciding what looked good, what felt right for the era, and what matched the aesthetic than I spent running generations. The time cost shifts almost entirely to judgment.",
        "One thing I didn't expect: different models behaved completely differently by era. Luma Dream Machine for futuristic settings: the lighting, the scale, the surreal quality. Nanobanana for historical eras: grittier, more grounded texture. Once I noticed the pattern I leaned in and consistency improved. Final selects were upscaled through Topaz Bloom.",
      ],
      media: [
        { shade: G, src: "/warpbnb/prompt-arch.png", ar: 1.78, caption: "The prompt architecture drafted for each listing." },
        { shade: G, src: "/warpbnb/automation-fail.png", ar: 1.78, caption: "What happens when you automate image generation without guardrails." },
        { shade: G, src: "/warpbnb/topaz.mp4", video: true, ar: 1.78, caption: "Same image before and after Topaz Bloom. The difference is not subtle." },
      ],
    },
    {
      nav: "Motion",
      heading: "The last 10% is the difference between good and great.",
      body: [
        "This is where I spent the most obsessive time. I drew on Emil Kowalski's animation principles around easing, timing, and physicality as a foundation, plus a skill trained on animation craft to find where things could improve.",
        "To tune the interactions I built a temporary panel directly in the UI (sliders for easing, duration, intensity) so I could adjust everything live without re-running anything. It's the difference between feeling in control of your design and blindly submitting values and hoping.",
        "For the logo I generated the concept in Nanobanana, vectorized it in Figma, and added a cursor-follow effect in Rive so the eyes track your cursor as you zoom in.",
      ],
      media: [
        { shade: G, src: "/warpbnb/particles.mp4", video: true, ar: 1.78, caption: "Hover, tap, jiggle, grow, snap back." },
        { shade: G, src: "/warpbnb/snap.mp4", video: true, ar: 1.78, caption: "Inspired by Thanos's snap: press the button and it disintegrates." },
        { shade: G, src: "/warpbnb/rive-logo.mp4", video: true, ar: 1.78, caption: "A cursor-follow effect built in Rive to give the logo a sense of awareness." },
      ],
    },
    {
      nav: "Marketing",
      heading: "Building it is half the job. The other half is making people care.",
      body: [
        "For the commercial I took the final images into Kling 3.0, animating first frame to last frame, then brought some outputs into Luma Dream Machine for additional motion before stitching the clips together.",
        "For the voiceover I cloned an ad-read voice style in ElevenLabs. Writing a script that sounds right when spoken took more iteration than expected: some words needed phonetic spelling, and emphasis had to be marked manually to land excitement in the right places. The difference between a flat read and an energetic one is often just a few spelling tricks and some punctuation.",
      ],
      media: [
        { shade: G, src: "/warpbnb/commercial.png", ar: 1.78, caption: "The full commercial pipeline: every generation that went into the final cut." },
        { shade: G, src: "/warpbnb/voiceover.png", ar: 1.78, caption: "The voiceover script: phonetic spelling and emphasis marks included." },
      ],
    },
    {
      nav: "The Slop",
      heading: "Things are chopped and cooked before they are served.",
      body: [
        "Not everything worked. Early on I tried the obvious shortcut: drop everything into Lovable, paste in some reference, and hope it would produce something close. It did not. What came out was generic, unstyled, and structurally off.",
        "The whole point of this project was unslopifying that output. Getting from the slop baseline to something that actually looked considered took real work. Every tool in this stack will produce bad output if you let it. The gap between what AI generates by default and what you actually want to ship is where all the real design work lives, and that gap is not shrinking as fast as people think.",
      ],
      media: [
        { shade: G, src: "/warpbnb/slop.png", ar: 1.78, caption: "Everything that went wrong before anything went right." },
      ],
    },
    {
      nav: "Reflections",
      heading: "AI unlocked the ability to build end to end.",
      body: [
        "Two weeks, solo, zero to shipped: design system, frontend, backend, custom copy, populated listings, host and reviewer avatars, micro-interactions, and a video commercial.",
        "This entire project was an exercise in curation. I spent more time deciding what was good than generating anything. AI raises your floor dramatically. It does not raise your ceiling.",
        "The other thing that kept hitting me: the foundation is everything. Once the codebase understood the design system, once Storybook was working, once the tokens were in, everything downstream got easy. The hard part is always the beginning. After that, you're directing, not building.",
      ],
      media: [],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * PathAI
 * ------------------------------------------------------------------ */

const pa = (
  src: string,
  ar: number,
  video?: boolean,
): CaseMedia => ({
  shade: "#282828",
  src,
  ar,
  video,
});

const pathai: CaseStudy = {
  slug: "pathai",
  title: "PathAI",
  detailTitle: "Empowering pathologists to diagnose with speed and confidence.",
  tagline: "Empowering pathologists to diagnose with speed and confidence.",
  description:
    "I designed and shipped Region Comments, a collaboration tool on PathAI's Patient Diagnostics platform. It cut second-opinion turnaround times by ~45% and noticeably increased the number of cases pathologists sign out daily.",
  year: 2022,
  category: "Product Design",
  shade: "#282828",
  mediaOnly: true,
  accent: "#D18BFF", // PathAI brand purple
  highlights: [
    {
      label: "Problem",
      body: "Pathologists had no fast, reliable way to get second opinions, falling back on screenshots and email that delayed critical diagnostic decisions.",
    },
    {
      label: "Approach",
      body: "Researched curbside consults with pathologists, then designed Region Comments as a contextual collaboration layer directly on digital slides.",
    },
    {
      label: "Outcome",
      body: "Shipped in Q4 2022 and cut second-opinion turnaround by ~45%, with adoption expanding into QA, tumor boards, teaching, and research.",
    },
  ],
  // Cover drives Work 1 card + detail hero (~4:3 monitor shot).
  hero: {
    shade: "#282828",
    src: "/pathai/cover.png",
    ar: 16 / 9,
    scrim: 0.4,
  },
  workCover: "/pathai/thumbnail.png",
  // Numbered stack: files are laid out by number, `n-1`/`n-2` sit side by side.
  // 4/5/6 are the interactive Region Comments pieces, not image files.
  mediaBlocks: [
    {
      type: "split",
      columns: [2, 3],
      left: pa("/pathai/path1-1.png", 1742 / 1966),
      right: [pa("/pathai/path1-2.png", 5462 / 4096)],
    },
    { type: "full", media: pa("/pathai/path2.png", 3224 / 1816) },
    { type: "full", media: pa("/pathai/path3.png", 3288 / 2192) },
    // 4 — Region selection edge cases (nested, overlap priority, draw-over).
    {
      type: "embed",
      embed: "pathai-region-edge-cases",
      shade: "#dce0e9",
      ar: 16 / 9,
    },
    // 5 — Anatomy of a completed comment card (name / date / message).
    {
      type: "embed",
      embed: "pathai-comment-anatomy",
      shade: "#dce0e9",
      ar: 16 / 9,
    },
    // 6 — Input states (Default → Focus → Typing → Completed).
    {
      type: "embed",
      embed: "pathai-comment-states",
      shade: "#dce0e9",
      ar: 16 / 9,
    },
    { type: "full", media: pa("/pathai/path7.mp4", 3668 / 2064, true) },
    { type: "full", media: pa("/pathai/path9.png", 2720 / 1814) },
    { type: "full", media: { ...pa("/pathai/path10.mp4", 3840 / 2160, true), playbackRate: 0.5 } },
    { type: "full", media: pa("/pathai/path11.png", 2738 / 1542) },
    { type: "full", media: pa("/pathai/path8.png", 2700 / 1520) },
  ],
  credits: [
    {
      label: "My Contribution",
      value:
        "User research, stakeholder alignment, interaction design, rapid prototyping, user testing, handoff",
    },
    { label: "Team", value: "Me, Sandy Zhu, Riley Hunter, Jamie Harisiades, 5× SWE" },
    { label: "Company", value: "PathAI" },
  ],
  sections: [
    {
      nav: "Problem",
      heading: "Pathologists lack a fast, reliable way to get second opinions.",
      body: [
        "Pathologists have no efficient way to collaborate when a complex case needs a second opinion. Without a dedicated workflow, they fall back on slow workarounds (screenshots over email, shared accession numbers): a manual, disconnected process that delays critical decisions and invites miscommunication.",
        "In high-stakes cases like possible cancer, a delayed diagnosis directly affects patient outcomes. Speed and accuracy are critical.",
      ],
      media: [],
    },
    {
      nav: "Research",
      heading: "Understanding how pathologists seek second opinions today.",
      body: [
        "I began with organizational research and aligned with my PM on scope, focusing on informal (curbside) consultations, the most frequent, highest-friction part of the workflow.",
        "Partnering with a senior design researcher, I built a discussion guide and ran five semi-structured interviews with pathologists, capturing observations in Airtable so they could scale across teams. A clear pattern emerged: collaboration is as fundamental to a pathologist's workflow as design critique is to ours.",
      ],
      media: [],
    },
    {
      nav: "Solution",
      heading: "Region Comments: fast, traceable, contextual collaboration.",
      body: [
        "A contextual, traceable collaboration layer directly on digital slides. Pathologists draw a region, leave a note, and start a discussion, all inside the viewer. For the sender, quick markups replace lengthy emails; for the receiver, clicking a comment zooms to the exact tissue region.",
      ],
      media: [],
    },
    {
      nav: "Impact",
      heading: "Reduced diagnostic turnaround time by 45%.",
      body: [
        "After the Q4 2022 beta launch, consult and second-opinion turnaround dropped by ~45%, letting pathologists sign out more cases per day with less context switching, and freeing time for deeper review of complex specimens.",
      ],
      media: [],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Not yet ported — real titles and framing, placeholder media
 * ------------------------------------------------------------------ */

const soon = (nav: string, body: string): CaseSection => ({
  nav,
  body: [body],
  media: [{ shade: G, ar: 16 / 9 }],
});

/* ------------------------------------------------------------------ *
 * Walkity
 * ------------------------------------------------------------------ */

const wk = (
  src: string,
  ar: number,
  video?: boolean,
): CaseMedia => ({
  shade: "#222222",
  src,
  ar,
  video,
});

const walkity: CaseStudy = {
  slug: "walkity",
  title: "Walkity",
  detailTitle: "Brand strategy and landing page from scratch.",
  tagline: "Brand strategy and landing page from scratch.",
  description:
    "Creating Walkity's brand strategy and landing page from scratch, with accessibility at the center of the work.",
  year: 2023,
  category: "Brand Design",
  shade: "#222222",
  websiteUrl: "https://walkity.vercel.app/",
  mediaOnly: true,
  accent: "#00DFA8", // Walkity brand cyan
  highlights: [
    {
      label: "Motivation",
      body: "Give a haptic navigation startup a clear brand and landing page that centers accessibility without feeling clinical or cold.",
    },
    {
      label: "Approach",
      body: "Built the identity from footsteps plus haptic technology, then designed a dark, path-led landing experience around navigational independence.",
    },
    {
      label: "Outcome",
      body: "Shipped a cohesive brand system and marketing site that makes Walkity's purpose immediate: never walk alone.",
    },
  ],
  // Cover hero + Work card: brand.png. Case stack continues with walk11 → walk13.
  workCover: "/walkity/thumbnail.png",
  hero: {
    shade: "#222222",
    src: "/walkity/cover.png",
    ar: 16 / 9,
    scrim: 0.3,
  },
  // Numbered stack: 4 / 4-2 are the paired squares, side by side.
  mediaBlocks: [
    { type: "full", media: wk("/walkity/walk1.png", 4016 / 2241) },
    { type: "full", media: wk("/walkity/walk2.png", 3354 / 2514) },
    { type: "full", media: wk("/walkity/walk3.png", 6000 / 4500) },
    {
      type: "split",
      left: wk("/walkity/walk4.png", 2515 / 2515),
      right: [wk("/walkity/walk4-2.png", 2515 / 2515)],
    },
    { type: "full", media: wk("/walkity/walk5.png", 6000 / 4000) },
    { type: "full", media: wk("/walkity/walk6.png", 6000 / 4500) },
    { type: "full", media: wk("/walkity/walk7.png", 6000 / 4000) },
    { type: "full", media: wk("/walkity/walk8.mp4", 3 / 2, true) },
    {
      type: "full",
      media: {
        shade: "#D0DBE2",
        src: "/walkity/walk9.mp4",
        video: true,
        ar: 3 / 2,
        fit: "contain",
        pad: { top: 100, bottom: 100 },
      },
    },
  ],
  credits: [
    { label: "Role", value: "Brand strategy, visual identity, landing page design" },
    { label: "Focus", value: "Accessibility-centered brand and web experience" },
    { label: "Year", value: "2023" },
  ],
  sections: [
    {
      nav: "Overview",
      body: [
        "Creating Walkity's brand strategy and landing page from scratch, with accessibility at the center of the work.",
      ],
      media: [],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * BigBasket — Melon Design System
 * ------------------------------------------------------------------ */

const bb = (
  src: string,
  ar: number,
  video?: boolean,
): CaseMedia => ({
  shade: "#242424",
  src,
  ar,
  video,
});

/** Figma screen recordings — 16:9 frame, light gray mat, video contained. */
const bbFigma = (src: string): CaseMedia => ({
  shade: "#F5F5F5",
  src,
  video: true,
  ar: 16 / 9,
  fit: "contain",
  pad: { top: 48, bottom: 48, left: 48, right: 48 },
});

const bigbasket: CaseStudy = {
  slug: "bigbasket",
  title: "BigBasket",
  detailTitle:
    "Creating a Design System for India's largest grocery delivery app",
  tagline:
    "Creating a Design System for India's largest grocery delivery app",
  description:
    "Design system for India's largest grocery delivery app, building shared standards across a sprawling e-commerce product.",
  year: 2021,
  category: "Design Systems",
  shade: "#242424",
  mediaOnly: true,
  accent: "#6DE96C", // BigBasket brand green
  workCover: "/bigbasket/thumbs/work-cover.jpg",
  highlights: [
    {
      label: "Problem",
      body: "Product surfaces had drifted apart: hundreds of colors, text styles, and elevations with no shared system to keep experiences consistent.",
    },
    {
      label: "Approach",
      body: "Audited the chaos, then built Melon: foundations, components, and patterns that designers and engineers could share across BigBasket.",
    },
    {
      label: "Outcome",
      body: "A documented design system that streamlined UX process and gave teams a common language for shipping cohesive grocery experiences.",
    },
  ],
  hero: {
    shade: "#242424",
    src: "/bigbasket/cover.mp4",
    video: true,
    ar: 16 / 9,
  },
  // Order follows the reference stack after cover.
  mediaBlocks: [
    { type: "full", media: bb("/bigbasket/chaos.png", 3840 / 2160) },
    { type: "full", media: bb("/bigbasket/foundations_layout2.png", 1786 / 1286) },
    { type: "full", media: bb("/bigbasket/button.png", 1920 / 857) },
    { type: "full", media: bbFigma("/bigbasket/components.mp4") },
    { type: "full", media: bb("/bigbasket/ios-vs-android.png", 1920 / 857) },
    { type: "full", media: bb("/bigbasket/melon3.png", 3200 / 1118) },
    { type: "full", media: bbFigma("/bigbasket/spider.mp4") },
    { type: "full", media: bb("/bigbasket/Artboard.png", 2688 / 1680) },
    { type: "full", media: bb("/bigbasket/guidelines.mp4", 16 / 9, true) },
  ],
  credits: [
    {
      label: "My Contribution",
      value: "Design system foundations, components, documentation, and cross-platform patterns",
    },
    { label: "Company", value: "BigBasket" },
    { label: "Year", value: "2021" },
  ],
  sections: [
    {
      nav: "Overview",
      body: [
        "Design system for India's largest grocery delivery app, building shared standards across a sprawling e-commerce product.",
      ],
      media: [],
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Ikon Technologies — Product Management
 *
 * Four systems-thinking studies from the same Product Lead stint: the work
 * that sat behind Toolbox rather than inside it. Systems Thinking only —
 * `inWorkGrid: false` keeps the artifacts out of the Visual Craft grid.
 * ------------------------------------------------------------------ */

/** Screenshot artifacts that ship with their own gray mat baked in. */
const ik = (src: string, ar: number, caption: string): CaseMedia => ({
  shade: "#A9B2BB",
  src,
  ar,
  caption,
});

/** Diagrams exported on white — contained and padded into a light mat. */
const ikDiagram = (src: string, ar: number, caption: string): CaseMedia => ({
  shade: "#FFFFFF",
  src,
  ar,
  caption,
  fit: "contain",
  pad: { top: 48, bottom: 48, left: 48, right: 48 },
});

/** Shared across all four — same company, same role, same stint. */
const IKON_PM_CREDITS = [
  { label: "Company", value: "Ikon Technologies" },
  { label: "Role", value: "Product Lead" },
  { label: "Industry", value: "Automotive Retail, IoT" },
];

const ikonAnalytics: CaseStudy = {
  slug: "ikon-analytics",
  title: "Product Analytics",
  detailTitle:
    "Defining product success with a HEART-driven framework and aligning teams on measurable outcomes.",
  tagline: "A shared definition of product health for Toolbox.",
  description:
    "Established the HEART model as Toolbox's product health north star, mapping every major web and mobile workflow into instrumented, measurable touchpoints.",
  year: 2024,
  category: "Product Management",
  shade: "#A9B2BB",
  mediaOnly: true,
  inWorkGrid: false,
  accent: "#03BB7D",
  highlights: [
    {
      label: "Context",
      body: "Before launch there was no unified agreement on what success meant. Sales, ops, leadership, and product each pushed conflicting metrics, so no one shared a view of what to track once Toolbox was live.",
    },
    {
      label: "Approach",
      body: "Partnered with a Senior PM to establish the HEART model as the product health north star, mapped every major web and mobile workflow into measurable touchpoints, then worked with engineering to instrument events in Heap, Smartlook, and Google Analytics for both behavior and context.",
    },
    {
      label: "Outcome",
      body: "One agreed-upon measurement approach and a consistent, shared foundation for product analytics across teams — the basis for how Toolbox would grow, scale, and evaluate success.",
    },
  ],
  hero: {
    shade: "#A9B2BB",
    src: "/ikon/analytics.png",
    ar: 2048 / 1152,
    // Light artwork under white hero type — needs the full scrim to read.
    scrim: true,
  },
  mediaBlocks: [
    {
      type: "full",
      media: ik(
        "/ikon/analytics.png",
        2048 / 1152,
        "Success metrics sheet — every major flow mapped to HEART goals, behavioral signals, target metrics, and the tool tracking each one.",
      ),
    },
  ],
  impact:
    "This replaced **four conflicting scorecards** with one shared definition of product health.",
  credits: IKON_PM_CREDITS,
  sections: [
    {
      nav: "Overview",
      body: [
        "Established the HEART model as Toolbox's product health north star, mapping every major web and mobile workflow into instrumented, measurable touchpoints.",
      ],
      media: [],
    },
  ],
};

const ikonBlueprint: CaseStudy = {
  slug: "ikon-service-blueprint",
  title: "Service Blueprint",
  detailTitle:
    "Driving operational impact by establishing the single source of truth behind Ikon's internal tools ecosystem.",
  tagline: "The end-to-end device lifecycle, mapped once and shared.",
  description:
    "Mapped Ikon's device lifecycle from manufacturing through warehouse, dealership, and activation — the operational source of truth that kicked off the warehouse management system project.",
  year: 2024,
  category: "Product Management",
  shade: "#A9B2BB",
  mediaOnly: true,
  inWorkGrid: false,
  accent: "#03BB7D",
  websiteUrl:
    "https://www.figma.com/board/iSfdIrs1RwJ4GN4vVyFvbR/End-to-end-device-lifecycle-process-map.?node-id=1-3022&t=QI2kD9R2T5OjLTd8-1",
  highlights: [
    {
      label: "Context",
      body: "Internal operations across warehouse, accounting, field ops, and hardware ran on disconnected tools, tribal knowledge, and manual workflows — impossible to scale, and impossible to find the bottlenecks in.",
    },
    {
      label: "Approach",
      body: "Led cross-functional discovery with field operations to map the device lifecycle end to end, from manufacturing through warehouse, dealership, and activation. Partnered with another PM to define business rules, the workflow systems map, and data flow across HubSpot → NetSuite → Zoho.",
    },
    {
      label: "Outcome",
      body: "A single operational source of truth that NetSuite consultants used to initiate the warehouse management system project — saving discovery time, preventing rework, and letting leadership update SOPs against real workflows instead of assumptions.",
    },
  ],
  hero: {
    shade: "#A9B2BB",
    src: "/ikon/blueprint.jpeg",
    ar: 16 / 9,
    scrim: true,
  },
  mediaBlocks: [
    {
      type: "full",
      media: ik(
        "/ikon/blueprint.jpeg",
        16 / 9,
        "End-to-end device lifecycle across accounting, operations, warehouse, and dealership lanes — pain points and system gaps called out inline.",
      ),
    },
  ],
  impact:
    "This became the blueprint **NetSuite consultants used to start** the warehouse management system project.",
  credits: IKON_PM_CREDITS,
  sections: [
    {
      nav: "Overview",
      body: [
        "Mapped Ikon's device lifecycle from manufacturing through warehouse, dealership, and activation — the operational source of truth that kicked off the warehouse management system project.",
      ],
      media: [],
    },
  ],
};

const ikonDataDictionary: CaseStudy = {
  slug: "ikon-data-dictionary",
  title: "Data Dictionary",
  detailTitle:
    "Creating a unified data dictionary to power future product expansion and eliminate cross-team ambiguity.",
  tagline: "One catalogue for every internal and external data source.",
  description:
    "Catalogued internal, first-party, and third-party data into one dictionary with definitions aligned across teams — surfacing redundant vendor spend worth roughly $6,000 a month.",
  year: 2024,
  category: "Product Management",
  shade: "#FFFFFF",
  mediaOnly: true,
  inWorkGrid: false,
  accent: "#03BB7D",
  highlights: [
    {
      label: "Context",
      body: "The team wanted to expand into customer intelligence, vehicle context, and Smart Marketing — but had no clarity on what data already existed, which integrations fed it, how each department defined it, or what was contractually available and actually usable.",
    },
    {
      label: "Approach",
      body: "Partnered with data and BI analysts to interview departments on sources, dependencies, pain points, and usage, then built a unified data dictionary and flow map cataloguing internal, first-party, and third-party data with definitions aligned across teams.",
    },
    {
      label: "Outcome",
      body: "Eliminated data ambiguity and gave teams a shared understanding of what the platform could actually do. Surfaced redundant vendor payments that cut roughly $6,000 from monthly spend, and grounded roadmap decisions in real financials. The proactivity led to leading the AI/ML agentic outreach initiative.",
    },
  ],
  hero: {
    shade: "#FFFFFF",
    src: "/ikon/dictionary.png",
    ar: 2442 / 1253,
    scrim: true,
  },
  mediaBlocks: [
    {
      type: "full",
      media: ikDiagram(
        "/ikon/dictionary.png",
        2442 / 1253,
        "Data dictionary catalogue — external sources and DMS integrations on one side, internal systems on the other.",
      ),
    },
  ],
  impact:
    "This surfaced duplicate vendor payments worth roughly **$6,000 a month**.",
  credits: IKON_PM_CREDITS,
  sections: [
    {
      nav: "Overview",
      body: [
        "Catalogued internal, first-party, and third-party data into one dictionary with definitions aligned across teams — surfacing redundant vendor spend worth roughly $6,000 a month.",
      ],
      media: [],
    },
  ],
};

const ikonAgentic: CaseStudy = {
  slug: "ikon-agentic-outreach",
  title: "AI/ML Integration",
  detailTitle:
    "Optimized service appointment scheduling with agentic outreach and increased booking efficiency.",
  tagline: "Agentic outreach that books service appointments on its own.",
  description:
    "Automated dealership service outreach end to end with Stella AI — identifying customers, running the conversation, checking live availability, and booking autonomously.",
  year: 2025,
  category: "Product Management",
  shade: "#FFFFFF",
  mediaOnly: true,
  inWorkGrid: false,
  accent: "#03BB7D",
  highlights: [
    {
      label: "Problem",
      body: "Dealerships re-engage customers for routine maintenance one call at a time. Without real-time scheduling visibility, agents burn time on back-and-forth that often ends without a booking.",
    },
    {
      label: "Approach",
      body: "Worked with Stella AI, a third-party conversational partner, to automate the flow end to end: identify who to contact, run the conversation, check live scheduling availability from dealer systems, and book the appointment autonomously — with human agents handling only the exceptions that need escalation.",
    },
    {
      label: "Impact",
      body: "Early pilots booked multiple service appointments autonomously in the first week, pointing toward reduced manual workload, shorter time-to-book, and better long-term conversion efficiency.",
    },
  ],
  hero: {
    shade: "#FFFFFF",
    src: "/ikon/agentic.png",
    ar: 16 / 9,
    scrim: true,
  },
  mediaBlocks: [
    {
      type: "full",
      media: ikDiagram(
        "/ikon/agentic.png",
        1598 / 899,
        "Agentic outreach for service scheduling using Stella AI — natural language handles booking and store info, rules-based transfer routes the rest.",
      ),
    },
  ],
  impact:
    "This moved service outreach to **fully autonomous booking**, with humans on exceptions only.",
  credits: IKON_PM_CREDITS,
  sections: [
    {
      nav: "Overview",
      body: [
        "Automated dealership service outreach end to end with Stella AI — identifying customers, running the conversation, checking live availability, and booking autonomously.",
      ],
      media: [],
    },
  ],
};

const rolipoli: CaseStudy = {
  slug: "rolipoli",
  title: "Rolipoli",
  tagline: "An adaptive product to fold and store your sleeping bag.",
  description:
    "An adaptive product to fold and store your sleeping bag.",
  year: 2024,
  category: "Product Design",
  shade: "#262626",
  workCover: "/rolipoli/thumbnail.png",
  linkable: false,
  externalUrl: "https://www.youtube.com/watch?v=u9v3gzVkyDk",
  sections: [
    soon("Overview", "Full case study coming soon."),
  ],
};

export const CASE_STUDIES: CaseStudy[] = [
  toolbox,
  pathai,
  walkity,
  warpbnb,
  bigbasket,
  rolipoli,
  ikonAnalytics,
  ikonBlueprint,
  ikonDataDictionary,
  ikonAgentic,
];

export function isCaseLinkable(study: CaseStudy): boolean {
  return study.linkable !== false;
}

/** Case studies that open a detail page (excludes Work-grid-only teasers). */
export const LINKABLE_CASE_STUDIES = CASE_STUDIES.filter(isCaseLinkable);
