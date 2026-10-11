"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "framer-motion";
import WorkLensTransition from "@/components/WorkLensTransition";
import { useResume } from "@/components/ResumeOverlay";
import posthog from "posthog-js";
import CopyEmailButton from "@/components/CopyEmailButton";
import DataDictionaryThumbnail from "@/components/DataDictionaryThumbnail";
import DeferredVideo from "@/components/DeferredVideo";
import DeferredImage from "@/components/DeferredImage";
import EngCardPreview from "@/components/EngCardPreview";
import EngDetailModal from "@/components/EngDetailModal";
import SocialMenu from "@/components/SocialMenu";
import SystemsDetailOverlay from "@/components/SystemsDetailOverlay";
import { usePageTransition } from "@/components/PageTransition";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { isVideoSrc, workCardThumb } from "@/lib/workCardThumb";
import { WORK_FIT_CTA } from "@/lib/letter";
import { ABOUT_INTRO } from "@/lib/about";
import { SOCIAL_LINK_PREVIEWS } from "@/lib/socialLinkPreviews";
import { HoverLinkPreview, HoverTextPreview } from "@/components/ui/hover-link-preview";
import {
  ENG_COMPONENTS,
  SYSTEMS_LIST,
  WORK_LENSES,
  type EngComponent,
  type WorkLensId,
  type WorkListItem,
} from "@/lib/workLenses";

// Same fade choreography as the case-study list description (koto timings).
const TEXT_FADE = "opacity 167ms linear";

/** Even gutter revealed on Systems card hover, in px on every side. */
const SYS_HOVER_INSET = 12;

type Aspect = "4 / 5" | "5 / 3" | "4 / 3";
const ASPECTS: Aspect[] = ["4 / 5", "5 / 3", "4 / 3", "4 / 5", "5 / 3", "4 / 3"];
/** Per-project overrides for masonry card frames. */
const ASPECT_BY_SLUG: Partial<Record<string, Aspect>> = {
  toolbox: "4 / 5",
  warpbnb: "4 / 5",
  pathai: "4 / 3",
  bigbasket: "4 / 3",
  walkity: "4 / 3",
  rolipoli: "4 / 3",
};

/** Display-year overrides scoped to the Visual Craft project grid. */
const VISUAL_CRAFT_YEAR_BY_SLUG: Partial<Record<string, number>> = {
  toolbox: 2026,
  warpbnb: 2026,
  rolipoli: 2023,
};

function subscribeNarrow(onChange: () => void) {
  const mql = window.matchMedia("(max-width: 900px)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useIsNarrow() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia("(max-width: 900px)").matches,
    () => false,
  );
}

/** Square brand marks for the Work hover meta thumb. */
const LOGO_BY_SLUG: Record<string, string> = {
  toolbox: "/logos/toolbox.png?v=2",
  warpbnb: "/logos/warpbnb.png?v=2",
  pathai: "/logos/pathai.png?v=2",
  bigbasket: "/logos/bigbasket.png?v=2",
  walkity: "/logos/walkity.png?v=3",
  rolipoli: "/rolipoli/logo_rolipoli.png",
};

type Card = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: number;
  category: string;
  shade: string;
  accent?: string;
  media?: string;
  video?: boolean;
  thumb?: string;
  thumbSrcSet?: string;
  logo?: string;
  aspect: Aspect;
  linkable: boolean;
  externalUrl?: string;
};

function OverflowTicker({ text }: { text: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const label = textRef.current;
    if (!container || !label) return;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setOverflowing(label.getBoundingClientRect().width > container.clientWidth + 1);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text]);

  return (
    <span
      ref={containerRef}
      className={"workCardTagline" + (overflowing ? " is-overflowing" : "")}
      style={
        {
          "--work-marquee-duration": `${Math.max(6, text.length * 0.16)}s`,
        } as CSSProperties
      }
    >
      <span className="workCardTaglineTrack">
        <span ref={textRef}>{text}</span>
        {overflowing ? (
          <>
            <span className="workCardTaglineGap" aria-hidden>—</span>
            <span className="workCardTaglineDuplicate" aria-hidden>{text}</span>
          </>
        ) : null}
      </span>
    </span>
  );
}

/** Responsive stills for work covers that ship 1x + 2x files. */
const THUMB_SRCSET: Partial<Record<string, string>> = {
  pathai:
    "/pathai/thumbs/work-cover-800.webp 800w, /pathai/thumbs/work-cover-1200.jpg 1200w, /pathai/thumbs/work-cover.jpg 2400w",
  walkity:
    "/walkity/thumbs/work-cover-800.webp 800w, /walkity/thumbs/work-cover-1200.jpg?v=1 1200w, /walkity/thumbs/work-cover.jpg?v=1 2400w",
  bigbasket:
    "/bigbasket/thumbs/work-cover-800.webp 800w, /bigbasket/thumbs/work-cover-1200.jpg?v=5 1200w, /bigbasket/thumbs/work-cover.jpg?v=5 2400w",
};

// Visual Craft shows project work only — studies flagged `inWorkGrid: false`
// (the Ikon PM systems artifacts) live under Product Strategy instead.
const PROJECTS: Card[] = CASE_STUDIES.filter(
  (s) => s.inWorkGrid !== false,
).map((s, i) => {
  const cover = s.workCover;
  const coverVideo = isVideoSrc(cover);
  const thumb = workCardThumb(s);
  // Still cover image locks the card to a photo; video covers (and hero) can loop.
  const still = Boolean((cover && !coverVideo) || s.workStill);
  return {
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    description: s.workSummary ?? s.description,
    year: VISUAL_CRAFT_YEAR_BY_SLUG[s.slug] ?? s.year,
    category: s.category,
    shade: s.shade,
    accent: s.accent,
    media: coverVideo ? cover : still ? thumb : s.hero?.src,
    video: coverVideo ? true : still ? false : s.hero?.video,
    thumb,
    thumbSrcSet: THUMB_SRCSET[s.slug],
    logo: LOGO_BY_SLUG[s.slug],
    aspect: ASPECT_BY_SLUG[s.slug] ?? ASPECTS[i % ASPECTS.length],
    linkable: s.linkable !== false,
    externalUrl: s.externalUrl,
  };
});

const HOVER_REST_TIME: Partial<Record<string, number>> = {
  warpbnb: 10.45,
  rolipoli: 1,
};

function WorkCard({
  card,
  onHover,
  priority = false,
}: {
  card: Card;
  onHover?: (card: Card | null) => void;
  priority?: boolean;
}) {
  const { open } = usePageTransition();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const restTime = HOVER_REST_TIME[card.slug];
  const playOnHover = restTime != null;
  // Video covers play from the path as authored — the old /grid/ rewrite only
  // ever applied to assets that already lived under /grid/ or /new/.
  const gridSrc = card.video ? card.media : undefined;

  const cardStyle = {
    aspectRatio: card.aspect,
    ["--work-card-ar"]: card.aspect,
  } as CSSProperties;

  const inner = (
    <div className="workCardInner">
      <div
        ref={mediaRef}
        className="workCardMediaWrap"
        style={{ background: card.shade }}
      >
        {gridSrc ? (
          <DeferredVideo
            className="workCardMedia"
            src={gridSrc}
            poster={card.thumb}
            activation={priority ? "eager" : "visible"}
            playOnHover={playOnHover}
            hovered={previewing}
            posterTime={restTime}
            playbackRate={card.slug === "rolipoli" ? 0.7 : 1}
            loadMargin="80px 0px"
            respectReducedMotion={false}
            posterPriority={priority && !playOnHover}
          />
        ) : card.thumb || card.media ? (
          <DeferredImage
            className="workCardMedia"
            src={card.thumb || card.media}
            srcSet={card.thumbSrcSet}
            sizes="(max-width: 720px) 100vw, (max-width: 900px) 50vw, 36vw"
            alt=""
            eager={priority}
            fetchPriority={priority ? "high" : "auto"}
            quality={75}
          />
        ) : (
          <span className="workCardPlaceholder">{card.title}</span>
        )}
      </div>
      <span className="workCardCaption">
        <span className="workCardName">{card.title}</span>
        <OverflowTicker text={card.tagline} />
      </span>
    </div>
  );

  const hoverProps = {
    onMouseEnter: () => {
      onHover?.(card);
      setPreviewing(true);
    },
    onMouseLeave: () => {
      onHover?.(null);
      setPreviewing(false);
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) onHover?.(card);
    },
    onBlur: () => {
      onHover?.(null);
      setPreviewing(false);
    },
  };

  if (card.externalUrl) {
    return (
      <a
        href={card.externalUrl}
        className="workCard"
        data-slug={card.slug}
        style={cardStyle}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${card.title} (opens in a new tab)`}
        onClick={() => {
          posthog.capture("portfolio_item_opened", {
            item_id: card.slug,
            portfolio_section: "visual",
            destination: "external",
          });
        }}
        {...hoverProps}
      >
        {inner}
      </a>
    );
  }

  if (!card.linkable) {
    return (
      <div
        className="workCard workCardStatic"
        data-slug={card.slug}
        style={cardStyle}
        {...hoverProps}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/work/${card.slug}`}
      className="workCard"
      data-slug={card.slug}
      style={cardStyle}
      onNavigate={(e) => {
        e.preventDefault();
        onHover?.(null);
        setPreviewing(false);
        posthog.capture("portfolio_item_opened", {
          item_id: card.slug,
          portfolio_section: "visual",
          destination: "case_study",
        });
        open(`/work/${card.slug}`, {
          title: card.title,
          subtitle: `${card.category}, ${card.year}`,
          source: mediaRef.current ?? undefined,
        });
      }}
      {...hoverProps}
    >
      {inner}
    </Link>
  );
}

function SystemsCard({
  item,
  onOpen,
}: {
  item: WorkListItem;
  onOpen: () => void;
}) {
  const tags = item.badges ?? [];
  const cardRef = useRef<HTMLButtonElement>(null);

  // A single scale factor removes a percentage of each dimension, so a card
  // that's wider than it is tall insets more on the sides than top/bottom.
  // Deriving X and Y from the card's own size keeps all four gutters equal.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      el.style.setProperty("--sys-sx", String(1 - (SYS_HOVER_INSET * 2) / width));
      el.style.setProperty("--sys-sy", String(1 - (SYS_HOVER_INSET * 2) / height));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      className="sysCard"
      onClick={onOpen}
      aria-haspopup="dialog"
    >
      <span className="sysCardInset">
        <span className="sysCardMedia">
          <span className="sysCardMediaInner" style={{ background: item.shade }}>
            {item.id === "ikon-data-dictionary" ? (
              <DataDictionaryThumbnail />
            ) : item.thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.thumb} alt="" />
            ) : null}
          </span>
        </span>
        <span className="sysCardCopy">
          <span className="sysCardTitle">{item.title}</span>
          {tags.length > 0 ? (
            <ul className="sysCardTags">
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </span>
      </span>
    </button>
  );
}

function EngCard({
  item,
  onOpen,
}: {
  item: EngComponent;
  onOpen: () => void;
}) {
  return (
    <div
      className="engCard"
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
    >
      <EngCardPreview item={item} />
      <span className="engCardBar">
        <span className="engCardTitleRow">
          <span className="engCardName">{item.title}</span>
          {item.tools?.length ? (
            <span className="engCardTools" role="img" style={{ "--tool-count": item.tools.length } as CSSProperties} aria-label={`Tools used: ${item.tools.map((tool) => tool.name).join(", ")}`}>
              {item.tools.map((tool, index) => (
                <span
                  className="engCardTool"
                  key={tool.name}
                  title={tool.name}
                  style={{ "--tool-index": index, zIndex: index + 1 } as CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tool.logo} alt="" width="16" height="16" />
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <span className="engCardKind">{item.kind}</span>
      </span>
    </div>
  );
}

// Active-lens dot hop, sampled frame by frame (30fps) from the reference:
// [time 0–1, horizontal progress 0–1, rise in dot diameters, scaleX, scaleY].
// Same arc for every distance: ~4 diameters up, stretched in flight, a squash
// on landing, then one small rebound. The frame at t≈0.59 was a duplicated
// video frame (4% then 11% steps) and is dropped so long hops don't lurch.
const LENS_DOT_HOP: [number, number, number, number, number][] = [
  [0.000, 0.000, 0.000, 1.000, 1.000],
  [0.045, 0.000, -0.230, 1.000, 1.037],
  [0.091, 0.057, -0.926, 0.963, 1.074],
  [0.136, 0.143, -2.000, 0.926, 1.148],
  [0.181, 0.228, -2.741, 0.889, 1.185],
  [0.228, 0.301, -3.352, 0.889, 1.222],
  [0.273, 0.373, -3.774, 0.852, 1.259],
  [0.318, 0.444, -3.970, 0.852, 1.259],
  [0.364, 0.515, -3.970, 0.852, 1.259],
  [0.409, 0.600, -3.781, 0.852, 1.259],
  [0.454, 0.672, -3.352, 0.889, 1.222],
  [0.501, 0.743, -2.748, 0.889, 1.185],
  [0.546, 0.814, -2.000, 0.926, 1.148],
  [0.637, 0.972, -0.233, 1.000, 1.037],
  [0.682, 1.000, 0.022, 1.185, 0.852],
  [0.727, 1.000, -0.226, 1.037, 1.000],
  [0.774, 1.000, -0.374, 0.963, 1.074],
  [0.819, 1.000, -0.441, 0.963, 1.111],
  [0.864, 1.000, -0.211, 1.000, 1.000],
  [0.910, 1.000, -0.044, 1.037, 0.963],
  [0.955, 1.000, 0.030, 1.074, 0.963],
  [1.000, 1.000, 0.022, 1.000, 1.000],
];
const LENS_DOT_GAP = 5; // px between the label and the dot

export type WorkLayout = "split" | "stack";

export default function Work({
  initialLens,
  initialOpenItem,
  layout = "split",
}: {
  initialLens?: WorkLensId;
  initialOpenItem?: string;
  /** Homepage view: side panel beside the masonry, or the intro centered above it. */
  layout?: WorkLayout;
}) {
  const openResume = useResume();
  const isNarrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const [lens, setLens] = useState<WorkLensId>(initialLens ?? "visual");
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [emailCopiedAt, setEmailCopiedAt] = useState(0);
  const [lastHoverIdx, setLastHoverIdx] = useState(0);
  const [engActive, setEngActive] = useState<EngComponent | null>(() =>
    initialOpenItem && initialLens === "engineering"
      ? ENG_COMPONENTS.find((c) => c.id === initialOpenItem) ?? null
      : null,
  );
  const [systemsActive, setSystemsActive] = useState<WorkListItem | null>(() =>
    initialOpenItem && initialLens === "systems"
      ? SYSTEMS_LIST.find((s) => s.slug === initialOpenItem || s.id === initialOpenItem) ?? null
      : null,
  );
  const pushedOverlayUrl = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lensNavRef = useRef<HTMLElement | null>(null);
  const lensDotRef = useRef<HTMLSpanElement | null>(null);
  const dotLens = useRef<WorkLensId | null>(null);
  const { open } = usePageTransition();
  // The panel's hover rail belongs to the project grid — only while Visual
  // Craft, and only in the split layout where the panel sits beside the grid.
  const showingProjects = lens === "visual" && layout === "split";
  const lensRef = useRef(lens);
  lensRef.current = lens;

  const cards = PROJECTS;

  // Koto packs by alternating columns (DOM order: L,R,L,R…) so each column
  // stacks independently — no shared row height, no phantom gaps.
  const columns = useMemo(() => {
    const left: Card[] = [];
    const right: Card[] = [];
    cards.forEach((c, i) => (i % 2 === 0 ? left : right).push(c));
    return [left, right] as const;
  }, [cards]);

  const activeIdx = hoverIdx >= 0 ? hoverIdx : lastHoverIdx;
  const hoverOn = showingProjects && hoverIdx >= 0;

  const setHoverCard = (card: Card | null) => {
    // AnimatePresence keeps Visual Craft cards mounted during the lens exit.
    // A mouseenter/focus on those exiting cards must not re-hide the socials.
    if (lensRef.current !== "visual" || !card || document.documentElement.hasAttribute("data-project-transition")) {
      setHoverIdx(-1);
      return;
    }
    const idx = cards.findIndex((c) => c.slug === card.slug);
    if (idx < 0) return;
    setHoverIdx(idx);
    setLastHoverIdx(idx);
  };

  // One dot rides just right of the active lens label and hops to a new lens
  // (LENS_DOT_HOP). Layout/resize moves snap it; the view switch FLIPs it.
  useLayoutEffect(() => {
    const nav = lensNavRef.current;
    const dot = lensDotRef.current;
    if (!nav || !dot) return;
    // Rects are in screen pixels; a page entrance (e.g. the About → Home depth
    // swap at scale 0.965) would shrink every gap. Divide the ancestors'
    // scale back out so the dot lands in the nav's own CSS pixels.
    const scale = () => {
      const n = nav.getBoundingClientRect();
      return {
        x: nav.offsetWidth ? n.width / nav.offsetWidth : 1,
        y: nav.offsetHeight ? n.height / nav.offsetHeight : 1,
      };
    };
    const target = () => {
      const label = nav.querySelector<HTMLElement>(".workLens.on .workLensLabel");
      if (!label) return null;
      const n = nav.getBoundingClientRect();
      const r = label.getBoundingClientRect();
      const k = scale();
      const size = dot.offsetWidth;
      return {
        left: (r.right - n.left) / k.x + nav.scrollLeft + LENS_DOT_GAP,
        top: (r.top - n.top + r.height / 2) / k.y - size / 2,
      };
    };
    const place = (hop: boolean) => {
      const to = target();
      if (!to) return;
      // Start from wherever the dot is drawn now, even mid-hop.
      const n = nav.getBoundingClientRect();
      const d = dot.getBoundingClientRect();
      const k = scale();
      const from = {
        left: (d.left + d.width / 2 - n.left) / k.x - dot.offsetWidth / 2 + nav.scrollLeft,
        top: (d.top + d.height / 2 - n.top) / k.y - dot.offsetHeight / 2,
      };
      dot.getAnimations().forEach((a) => a.cancel());
      dot.style.left = `${to.left}px`;
      dot.style.top = `${to.top}px`;
      dot.dataset.ready = "true";
      if (!hop) return;
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const size = dot.offsetWidth;
      const lift = size * (parseFloat(getComputedStyle(dot).getPropertyValue("--lens-dot-hop")) || 1);
      dot.animate(
        LENS_DOT_HOP.map(([offset, along, rise, sx, sy]) => ({
          offset,
          transform: `translate(${(1 - along) * dx}px, ${(1 - along) * dy + rise * lift}px) scale(${sx}, ${sy})`,
        })),
        { duration: 733, easing: "linear" },
      );
    };
    place(dotLens.current !== null && dotLens.current !== lens && !reduceMotion);
    dotLens.current = lens;
    // ResizeObserver reports once on observe; only real size changes re-place
    // (otherwise that first report would cancel the hop that just started).
    let size = `${nav.clientWidth}x${nav.clientHeight}`;
    const observer = new ResizeObserver(() => {
      const next = `${nav.clientWidth}x${nav.clientHeight}`;
      if (next === size) return;
      size = next;
      place(false);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, [lens, layout, reduceMotion]);

  const selectLens = (id: WorkLensId) => {
    if (id === lens) return;
    // A restored grid skips its entrance only until a new lens is selected.
    if (rootRef.current) delete rootRef.current.dataset.projectRestored;
    const next = WORK_LENSES.find((l) => l.id === id);
    posthog.capture("work_lens_selected", { lens_id: id });
    setLens(id);
    setEngActive(null);
    setSystemsActive(null);
    setHoverIdx(-1);
    if (next) window.history.replaceState(null, "", next.path);
    rootRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Deep link — /product-strategy or legacy /#product-thinking opens that lens.
  useEffect(() => {
    if (initialLens) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const normalizedHash = hash === "product-thinking" ? "product-strategy" : hash;
    const match = WORK_LENSES.find((l) => l.anchor === normalizedHash);
    if (!match || match.id === "visual") return;
    setLens(match.id);
  }, [initialLens]);

  useEffect(() => {
    const onPop = () => {
      if (pushedOverlayUrl.current) {
        pushedOverlayUrl.current = false;
        setEngActive(null);
        setSystemsActive(null);
        setHoverIdx(-1);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const body =
    lens === "visual" ? (
      isNarrow ? (
        <div className="workGrid workGridFlat">
          {cards.map((card, index) => (
            <WorkCard key={card.slug} card={card} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="workGrid">
          {columns.map((col, ci) => (
            <div className="workCol" key={ci}>
              {col.map((card, index) => (
                <WorkCard
                  key={card.slug}
                  card={card}
                  onHover={setHoverCard}
                  priority={index === 0}
                />
              ))}
            </div>
          ))}
        </div>
      )
    ) : lens === "systems" ? (
      <div className="sysGrid">
        {SYSTEMS_LIST.map((item) => (
          <SystemsCard
            key={item.id}
            item={item}
            onOpen={() => {
              posthog.capture("portfolio_item_opened", {
                item_id: item.id,
                portfolio_section: "systems",
                destination: "detail_overlay",
              });
              setHoverIdx(-1);
              setSystemsActive(item);
              const slug = item.slug ?? item.id;
              window.history.pushState(null, "", `/product-strategy/${slug}`);
              pushedOverlayUrl.current = true;
            }}
          />
        ))}
      </div>
    ) : (
      <div className="engGrid">
        {ENG_COMPONENTS.map((item) => (
          <EngCard
            key={item.id}
            item={item}
            onOpen={() => {
              posthog.capture("portfolio_item_opened", {
                item_id: item.id,
                portfolio_section: "engineering",
                destination: "detail_overlay",
              });
              setEngActive(item);
              window.history.pushState(null, "", `/design-engineering/${item.id}`);
              pushedOverlayUrl.current = true;
            }}
          />
        ))}
      </div>
    );

  return (
    <div
      ref={rootRef}
      className={"workRoot workUniform" + (layout === "split" ? "" : ` workLayout-${layout}`)}
    >
      <aside className={"workPanel" + (hoverOn ? " is-project-hover" : "")}>
        <div className="workPanelTop">
          <div className="workBrandRow">
            <h1 className="workBrand">
              Mayank Kinger
              <span className="workBrandDot workBrandDotBounce">.</span>
            </h1>
            <SocialMenu />
          </div>
          <p className="workSubtitle">
            I’m a <strong>product designer</strong> and builder specializing in complex
            B2B systems, turning fragmented tools into cohesive, scalable product
            experiences through strategy, craft, and code.
          </p>

          <div className="workFit">
            <div className="workFitActions">
              <HoverLinkPreview
                href="/about"
                target={undefined}
                rel={undefined}
                previewImage={ABOUT_INTRO.hero.src}
                previewWidth={112.32}
                previewPlacement="top"
                imageAlt={ABOUT_INTRO.hero.alt}
                imageWidth={904}
                imageHeight={1024}
                className="workFitBtn workFitBtnGhost"
                onPreviewActivate={(event, preview) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  open("/about", {
                    title: "About Me",
                    subtitle: "Mayank Kinger",
                    source: preview ?? event.currentTarget,
                  });
                }}
              >
                {WORK_FIT_CTA.aboutLabel}
              </HoverLinkPreview>
              <HoverTextPreview text={WORK_FIT_CTA.email} flash={emailCopiedAt}>
                <CopyEmailButton
                  email={WORK_FIT_CTA.email}
                  label={WORK_FIT_CTA.contactLabel}
                  copiedLabel="Email copied"
                  className="workFitBtn workFitBtnSolid"
                  onCopy={() => setEmailCopiedAt(Date.now())}
                />
              </HoverTextPreview>
            </div>
          </div>

          <div className="workSocials">
            {ABOUT_INTRO.links.map((link) => (
              <HoverLinkPreview
                key={link.label}
                className="workSocial"
                href={link.href}
                {...SOCIAL_LINK_PREVIEWS[link.label]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  if (link.label === "Resume" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); openResume(); }
                  posthog.capture("social_link_opened", {
                    social_network: link.label,
                  });
                }}
              >
                <span className="workSocialLabel">
                  {link.label}
                  <svg
                    className="workSocialArrow"
                    viewBox="0 0 12 12"
                    aria-hidden
                  >
                    <path
                      d="M3.5 8.5 8.5 3.5M4.25 3.5H8.5V7.75"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </HoverLinkPreview>
            ))}
          </div>
        </div>

        {showingProjects && (
          <div
            className={"workHoverInfo" + (hoverOn ? " on" : "")}
          >
            <div className="workHoverDescWrap">
              {cards.map((c, i) => (
                <div
                  key={c.slug}
                  className="workHoverDescLayer"
                  style={{
                    "--project-accent": c.accent ?? c.shade,
                    opacity: i === activeIdx ? 1 : 0,
                    transition: TEXT_FADE,
                    transitionDelay: i === activeIdx ? "333ms" : "0ms",
                  } as CSSProperties}
                >
                  <div className="workDescriptionGlow" aria-hidden="true" />
                  <p className="workHoverDesc">{c.description}</p>
                  <div className="workHoverMeta">
                    <div
                      className="workHoverThumb"
                      style={c.logo ? undefined : { background: c.shade }}
                    >
                      {c.logo || c.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.logo || c.thumb}
                          alt=""
                          decoding="async"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="workHoverName">{c.title}</div>
                      <div className="workHoverYear">
                        {c.year}, {c.category.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="workMain" onMouseLeave={() => setHoverCard(null)}>
        <nav ref={lensNavRef} className="workLenses" aria-label="Work categories">
          <span ref={lensDotRef} className="workLensDot" aria-hidden="true" />
          {WORK_LENSES.map((l) => {
            const active = lens === l.id;
            return (
              <button
                key={l.id}
                type="button"
                className={"workLens" + (active ? " on" : "")}
                aria-current={active ? "true" : undefined}
                onClick={() => selectLens(l.id)}
              >
                <span className="workLensLabel">
                  <span>{l.label}</span>
                  <span className="workLensLabelSizer" aria-hidden="true">{l.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <WorkLensTransition lens={lens}>
          {body}
        </WorkLensTransition>
      </div>


      {engActive ? (
        <EngDetailModal item={engActive} onClose={() => {
          setEngActive(null);
          if (pushedOverlayUrl.current) {
            pushedOverlayUrl.current = false;
            window.history.back();
          } else {
            window.history.replaceState(null, "", "/design-engineering");
          }
        }} />
      ) : null}
      {systemsActive ? (
        <SystemsDetailOverlay
          item={systemsActive}
          onClose={() => {
            setHoverIdx(-1);
            setSystemsActive(null);
            if (pushedOverlayUrl.current) {
              pushedOverlayUrl.current = false;
              window.history.back();
            } else {
              window.history.replaceState(null, "", "/product-strategy");
            }
          }}
        />
      ) : null}
    </div>
  );
}
