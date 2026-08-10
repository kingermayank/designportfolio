export type CaseMedia = {
  shade: string; // placeholder / letterbox fill
  src?: string; // real asset in /public, or YouTube watch/embed URL when youtube
  video?: boolean;
  /** Embed a YouTube player instead of a local image/video. */
  youtube?: boolean;
  ar?: number; // natural aspect ratio (width / height); defaults to 16/9
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
  /** Live product link shown as a CTA on the detail left rail. */
  websiteUrl?: string;
  /** Brand accent for highlight labels (and website CTA). */
  accent?: string;
};

const G = "#262626";

/* ------------------------------------------------------------------ *
 * Ikon Technologies — Toolbox
 * ------------------------------------------------------------------ */

const tb = (
  src: string,
  ar: number,
  video?: boolean,
): CaseMedia => ({
  shade: "#282828",
  src,
  ar,
  video,
});

const toolbox: CaseStudy = {
  slug: "toolbox",
  title: "Ikon Technologies",
  detailTitle:
    "Redesigning Toolbox into an enterprise-ready platform that helped unlock Ikon's largest customer expansion",
  tagline: "An enterprise-ready platform for dealership operations.",
  description:
    "I led everything design-related for Toolbox as we onboarded dealerships from legacy to the new NextGen platform — 450 dealerships onboarded, and 40 directions across 450 relationships migrated from legacy. Showcasing the product at NADA 2026 drove 132 more dealership signups.",
  year: 2025,
  category: "Design Engineering",
  shade: "#282828",
  mediaOnly: true,
  accent: "#76C874", // Ikon / Toolbox green
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
  // Detail hero loops; Work 1 card uses cover.mp4 from /toolbox/new.
  workCover: "/toolbox/new/cover.mp4",
  hero: {
    shade: "#282828",
    src: "/toolbox/hero.mp4",
    video: true,
    ar: 3840 / 2048,
  },
  mediaBlocks: [
    { type: "full", media: tb("/toolbox/design-system.mp4", 1920 / 1080, true) },
    { type: "full", media: tb("/toolbox/ai-chat.mp4", 3840 / 2048, true) },
    { type: "full", media: tb("/toolbox/inventory.mp4", 3840 / 2048, true) },
    { type: "full", media: tb("/toolbox/configurations.mp4", 3840 / 2048, true) },
    { type: "full", media: tb("/toolbox/device-pairing.mp4", 3840 / 2048, true) },
    { type: "full", media: tb("/toolbox/dashboard.mp4", 1920 / 1080, true) },
    { type: "full", media: tb("/toolbox/invoices.mp4", 3840 / 2048, true) },
    { type: "full", media: tb("/toolbox/gateways.mp4", 3840 / 2048, true) },
    { type: "full", media: tb("/toolbox/impact.mp4", 1672 / 1080, true) },
    {
      type: "split",
      left: tb("/toolbox/nada-1.jpg", 1000 / 750),
      right: [tb("/toolbox/nada-2.jpg", 1000 / 750)],
    },
    { type: "full", media: tb("/toolbox/nada-3.jpg", 2048 / 1321) },
  ],
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
  detailTitle: "Reimagining Airbnb for time travel across areas",
  tagline: "Reimagining Airbnb for time travel across eras.",
  description:
    "A process breakdown of a fictional side project done end to end: design, code, images, content, and a video commercial, all using AI. Two weeks, solo, zero to shipped.",
  year: 2025,
  category: "Full-Stack AI Build",
  shade: "#2b2b2b",
  websiteUrl: "https://www.warpbnb.com/",
  accent: "#ff0257",
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
  workCover: "/warpbnb/new/warp12.mp4",
  hero: {
    shade: "#2b2b2b",
    src: "/warpbnb/warp11.mp4",
    video: true,
    ar: 4 / 3,
  },
  // Editorial stack: full rows, then 8|9, full rows, then 6|(7/10).
  // (No warp1 file in /warpbnb/new — stack starts at warp2.)
  mediaBlocks: [
    { type: "full", media: wb("/warpbnb/new/warp2.png", 1920 / 1080) },
    { type: "full", media: wb("/warpbnb/new/warp3.png", 2146 / 1138) },
    {
      type: "split",
      left: wb("/warpbnb/new/warp8.mp4", 864 / 1080, true),
      right: [wb("/warpbnb/new/warp9.mp4", 2276 / 1080, true)],
    },
    { type: "full", media: wb("/warpbnb/new/warp4.png", 4066 / 2285) },
    { type: "full", media: wb("/warpbnb/new/warp5.png", 4074 / 2292) },
    {
      type: "split",
      left: wb("/warpbnb/new/warp6.png", 1944 / 2421),
      right: [
        wb("/warpbnb/new/warp7.mp4", 1922 / 1080, true),
        wb("/warpbnb/new/warp10.mp4", 1920 / 1080, true),
      ],
    },
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
  detailTitle: "Empowering pathologists to diagnose with confidence and speed",
  tagline: "Empowering pathologists to diagnose with confidence and speed.",
  description:
    "I designed and shipped Region Comments, a collaboration tool on PathAI's Patient Diagnostics platform. It cut second-opinion turnaround times by ~45% and noticeably increased the number of cases pathologists sign out daily.",
  year: 2022,
  category: "Product Design",
  shade: "#282828",
  mediaOnly: true,
  accent: "#a78bfa", // purple
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
    src: "/pathai/path1.png",
    ar: 5000 / 3733,
  },
  // Editorial stack: AISight | (login / roles) → scrolling UI → rest → buttons sheet last.
  mediaBlocks: [
    {
      type: "split",
      left: pa("/pathai/new/path2.png", 1336 / 1812),
      right: [
        pa("/pathai/new/path5.png", 2284 / 1288),
        pa("/pathai/new/path4.png", 2280 / 1984),
      ],
    },
    // Scrolling AISight UI: full width, original portrait ratio (no split/fill crop).
    { type: "full", media: pa("/pathai/new/path6.mp4", 1538 / 2048, true) },
    { type: "full", media: pa("/pathai/new/path8.mp4", 3840 / 2160, true) },
    { type: "full", media: pa("/pathai/new/path9.mp4", 3668 / 2064, true) },
    // Mid-case product shot — full bleed, edge to edge (not the editorial max grid).
    {
      type: "full",
      bleed: true,
      media: pa("/pathai/new/path12.png", 3680 / 2760),
    },
    // Region Comments input-state walkthrough (Default → Focus → Typing → Completed).
    {
      type: "embed",
      embed: "pathai-comment-states",
      shade: "#dce0e9",
      ar: 16 / 9,
    },
    // Anatomy of a completed comment card (name / date / message → assembled).
    {
      type: "embed",
      embed: "pathai-comment-anatomy",
      shade: "#dce0e9",
      ar: 16 / 9,
    },
    // Region selection edge cases (nested, overlap priority, draw-over, z-index).
    {
      type: "embed",
      embed: "pathai-region-edge-cases",
      shade: "#e8ebf2",
      ar: 16 / 9,
    },
    { type: "full", media: pa("/pathai/new/path10.png", 1680 / 2742) },
    { type: "full", media: pa("/pathai/new/path3.png", 2685 / 1791) },
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

const stub = (
  slug: string,
  title: string,
  tagline: string,
  description: string,
  year: number,
  category: string,
  shade: string,
): CaseStudy => ({
  slug,
  title,
  tagline,
  description,
  year,
  category,
  shade,
  sections: [
    soon("Overview", "Full case study coming soon. Read it today at kingermayank.com."),
    soon("Process", "Full case study coming soon. Read it today at kingermayank.com."),
    soon("Outcome", "Full case study coming soon. Read it today at kingermayank.com."),
  ],
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
  detailTitle: "Brand strategy and landing page from scratch",
  tagline: "Brand strategy and landing page from scratch.",
  description:
    "Creating Walkity's brand strategy and landing page from scratch, with accessibility at the center of the work.",
  year: 2023,
  category: "Brand Design",
  shade: "#222222",
  mediaOnly: true,
  accent: "#2dd4bf", // cyan
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
  workCover: "/walkity/new/brand.png",
  hero: {
    shade: "#222222",
    src: "/walkity/new/walk10.png",
    ar: 6000 / 4500,
  },
  mediaBlocks: [
    { type: "full", media: wk("/walkity/new/walk11.png", 6000 / 4500) },
    { type: "full", media: wk("/walkity/new/walk12.png", 6000 / 4000) },
    { type: "full", media: wk("/walkity/new/brand.png", 3354 / 2514) },
    { type: "full", media: wk("/walkity/new/walk13.png", 3642 / 2731) },
    { type: "full", media: wk("/walkity/new/walk2.png", 4143 / 2734) },
    { type: "full", media: wk("/walkity/new/walk5.png", 2894 / 2172) },
    {
      type: "split",
      left: wk("/walkity/new/walk7.png", 2515 / 2515),
      right: [wk("/walkity/new/walk8.png", 2515 / 2515)],
    },
    { type: "full", media: wk("/walkity/new/walk3.png", 4096 / 2734) },
    { type: "full", media: wk("/walkity/new/walk4.png", 2694 / 1768) },
    { type: "full", media: wk("/walkity/new/walk6.mp4", 2160 / 1624, true) },
    { type: "full", media: wk("/walkity/new/walk9.mp4", 1920 / 1080, true) },
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

const bigbasket: CaseStudy = {
  slug: "bigbasket",
  title: "BigBasket",
  detailTitle: "A design system for India's largest grocery app",
  tagline: "A design system for India's largest grocery app.",
  description:
    "Design system for India's largest grocery delivery app, building shared standards across a sprawling e-commerce product.",
  year: 2021,
  category: "Design Systems",
  shade: "#242424",
  mediaOnly: true,
  accent: "#84cc16", // green
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
    src: "/bigbasket/cover.png",
    ar: 3006 / 2254,
  },
  // Order follows the reference stack after cover.
  mediaBlocks: [
    { type: "full", media: bb("/bigbasket/chaos.png", 3840 / 2160) },
    { type: "full", media: bb("/bigbasket/Audit.png", 1840 / 536) },
    { type: "full", media: bb("/bigbasket/foundations_layout2.png", 1786 / 1286) },
    { type: "full", media: bb("/bigbasket/button.png", 1920 / 857) },
    { type: "full", media: bb("/bigbasket/components.mp4", 1280 / 800, true) },
    { type: "full", media: bb("/bigbasket/ios-vs-android.png", 1920 / 857) },
    { type: "full", media: bb("/bigbasket/melon3.png", 3200 / 1118) },
    { type: "full", media: bb("/bigbasket/spider.mp4", 2880 / 1800, true) },
    { type: "full", media: bb("/bigbasket/Artboard.png", 2688 / 1680) },
    { type: "full", media: bb("/bigbasket/guidelines.mp4", 1280 / 712, true) },
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

export const CASE_STUDIES: CaseStudy[] = [
  toolbox,
  pathai,
  walkity,
  warpbnb,
  bigbasket,
  stub(
    "ikon-pm",
    "Ikon Technologies",
    "Untangling legacy chaos to drive revenue.",
    "Stepping beyond design to untangle legacy chaos and drive growth: product management work at Ikon Technologies.",
    2024,
    "Product Management",
    "#262626",
  ),
];
