"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CopyEmailButton from "@/components/CopyEmailButton";
import DataDictionaryThumbnail from "@/components/DataDictionaryThumbnail";
import DeferredVideo from "@/components/DeferredVideo";
import EngCardPreview from "@/components/EngCardPreview";
import EngDetailModal from "@/components/EngDetailModal";
import SiteFooter from "@/components/SiteFooter";
import SocialMenu from "@/components/SocialMenu";
import SystemsDetailOverlay from "@/components/SystemsDetailOverlay";
import { usePageTransition } from "@/components/PageTransition";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { WORK_FIT_CTA } from "@/lib/letter";
import { ABOUT_INTRO } from "@/lib/about";
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

const LENS_INDEX: Record<WorkLensId, number> = {
  visual: 0,
  systems: 1,
  engineering: 2,
};

const LENS_EASE = [0.22, 1, 0.36, 1] as const;

/** Even gutter revealed on Systems card hover, in px on every side. */
const SYS_HOVER_INSET = 12;

// Lens panes travel along the nav: moving right in the list slides the new pane
// in from the right while the old one leaves to the left, and vice versa.
const lensPaneVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 28 : -28,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -20 : 20,
  }),
};

const lensPaneReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

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

function thumbFor(src?: string): string | undefined {
  if (!src) return undefined;
  // Nested paths like /toolbox/new/cover.mp4 → /toolbox/thumbs/cover.jpg
  const nested = src.match(
    /^\/([^/]+)\/(?:new\/)?([^/.]+)\.(mp4|png|jpg|jpeg|webp)$/i,
  );
  if (nested) {
    const [, folder, name] = nested;
    return `/${folder}/thumbs/${name}.jpg`;
  }
  return src.startsWith("/") ? src : undefined;
}

function isVideoSrc(src?: string): boolean {
  return Boolean(src && /\.(mp4|webm|mov)$/i.test(src));
}

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
  rolipoli: "/logos/rolipoli.png",
};

type Card = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: number;
  category: string;
  shade: string;
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
    "/pathai/thumbs/work-cover-1200.jpg 1200w, /pathai/thumbs/work-cover.jpg 2400w",
  walkity:
    "/walkity/thumbs/work-cover-1200.jpg?v=1 1200w, /walkity/thumbs/work-cover.jpg?v=1 2400w",
  bigbasket:
    "/bigbasket/thumbs/work-cover-1200.jpg?v=5 1200w, /bigbasket/thumbs/work-cover.jpg?v=5 2400w",
};

// Visual Craft shows project work only — studies flagged `inWorkGrid: false`
// (the Ikon PM systems artifacts) live under Product Thinking instead.
const PROJECTS: Card[] = CASE_STUDIES.filter(
  (s) => s.inWorkGrid !== false,
).map((s, i) => {
  const cover = s.workCover;
  const coverVideo = isVideoSrc(cover);
  // A workCover is a purpose-built card asset (thumbnail.png / .mp4) — use it
  // as given. Only fall back to the derived /thumbs/ path when there isn't one.
  const thumb =
    s.workPoster ??
    (cover && !coverVideo ? cover : undefined) ??
    (coverVideo ? thumbFor(cover) : undefined) ??
    thumbFor(s.hero?.src) ??
    s.hero?.src;
  // Still cover image locks the card to a photo; video covers (and hero) can loop.
  const still = Boolean((cover && !coverVideo) || s.workStill);
  return {
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    description: s.workSummary ?? s.description,
    year: s.year,
    category: s.category,
    shade: s.shade,
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
        className="workCardMediaWrap"
        style={{ background: card.shade }}
      >
        {gridSrc ? (
          <DeferredVideo
            className="workCardMedia"
            src={gridSrc}
            poster={card.thumb}
            activation="eager"
            posterPriority={priority}
          />
        ) : card.thumb || card.media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="workCardMedia"
            src={card.thumb || card.media}
            srcSet={card.thumbSrcSet}
            sizes={
              card.thumbSrcSet
                ? "(max-width: 720px) 100vw, (max-width: 900px) 50vw, 36vw"
                : undefined
            }
            alt=""
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
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
    onMouseEnter: () => onHover?.(card),
    onFocus: () => onHover?.(card),
    onBlur: () => onHover?.(null),
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
        open(`/work/${card.slug}`, {
          title: card.title,
          subtitle: `${card.category}, ${card.year}`,
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
          onOpen();
        }
      }}
    >
      <EngCardPreview item={item} />
      <span className="engCardBar">
        <span className="engCardName">{item.title}</span>
        <span className="engCardKind">{item.kind}</span>
      </span>
    </div>
  );
}

export default function Work({ initialLens, initialOpenItem }: { initialLens?: WorkLensId; initialOpenItem?: string }) {
  const isNarrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const [lens, setLens] = useState<WorkLensId>(initialLens ?? "visual");
  const [lensDir, setLensDir] = useState(1);
  const [hoverIdx, setHoverIdx] = useState(-1);
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
  const { open } = usePageTransition();
  // The panel's hover rail belongs to the project grid — only while Visual Craft.
  const showingProjects = lens === "visual";
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
    if (lensRef.current !== "visual" || !card) {
      setHoverIdx(-1);
      return;
    }
    const idx = cards.findIndex((c) => c.slug === card.slug);
    if (idx < 0) return;
    setHoverIdx(idx);
    setLastHoverIdx(idx);
  };

  const selectLens = (id: WorkLensId) => {
    if (id === lens) return;
    const next = WORK_LENSES.find((l) => l.id === id);
    setLensDir(LENS_INDEX[id] - LENS_INDEX[lens] || 1);
    setLens(id);
    setEngActive(null);
    setSystemsActive(null);
    setHoverIdx(-1);
    if (next) window.history.replaceState(null, "", next.path);
    rootRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Deep link — /product-thinking or legacy /#product-thinking opens that lens.
  useEffect(() => {
    if (initialLens) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const match = WORK_LENSES.find((l) => l.anchor === hash);
    if (!match || match.id === "visual") return;
    setLensDir(LENS_INDEX[match.id] - LENS_INDEX.visual || 1);
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
              setHoverIdx(-1);
              setSystemsActive(item);
              const slug = item.slug ?? item.id;
              window.history.pushState(null, "", `/product-thinking/${slug}`);
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
              setEngActive(item);
              window.history.pushState(null, "", `/design-engineering/${item.id}`);
              pushedOverlayUrl.current = true;
            }}
          />
        ))}
      </div>
    );

  return (
    <div ref={rootRef} className="workRoot workUniform">
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
            I&apos;m a <strong>product designer</strong>{" "}
            and high agency builder with a founder&apos;s mindset who ships
            experiences with speed, taste, and judgement.
          </p>

          <div className="workFit">
            <div className="workFitActions">
              <button
                type="button"
                className="workFitBtn workFitBtnGhost"
                onClick={() =>
                  open("/about", {
                    title: "About Me",
                    subtitle: "Mayank Kinger",
                  })
                }
              >
                {WORK_FIT_CTA.aboutLabel}
              </button>
              <CopyEmailButton
                email={WORK_FIT_CTA.email}
                label={WORK_FIT_CTA.contactLabel}
                copiedLabel="Email copied"
                className="workFitBtn workFitBtnSolid"
              />
            </div>
          </div>

          <div className="workSocials">
            {ABOUT_INTRO.links.map((link) => (
              <a
                key={link.label}
                className="workSocial"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
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
              </a>
            ))}
          </div>
        </div>

        {showingProjects && (
          <div className={"workHoverInfo" + (hoverOn ? " on" : "")}>
            <div className="workHoverDescWrap">
              {cards.map((c, i) => (
                <div
                  key={c.slug}
                  className="workHoverDescLayer"
                  style={{
                    opacity: i === activeIdx ? 1 : 0,
                    transition: TEXT_FADE,
                    transitionDelay: i === activeIdx ? "333ms" : "0ms",
                  }}
                >
                  <p className="workHoverDesc">{c.description}</p>
                  <div className="workHoverMeta">
                    <div
                      className="workHoverThumb"
                      style={c.logo ? undefined : { background: c.shade }}
                    >
                      {c.logo || c.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={i === activeIdx ? c.logo || c.thumb : undefined}
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
        <nav className="workLenses" aria-label="Work categories">
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
                {l.label}
                <span
                  className={"workLensDot" + (active ? " show" : "")}
                  aria-hidden
                />
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait" initial={false} custom={lensDir}>
          <motion.div
            key={lens}
            className="workLensPane"
            custom={lensDir}
            variants={reduceMotion ? lensPaneReduced : lensPaneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: reduceMotion ? 0.12 : 0.38,
              ease: LENS_EASE,
            }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </div>

      <SiteFooter />

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
              window.history.replaceState(null, "", "/product-thinking");
            }
          }}
        />
      ) : null}
    </div>
  );
}
