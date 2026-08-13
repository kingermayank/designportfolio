"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CopyEmailButton from "@/components/CopyEmailButton";
import EngCardPreview from "@/components/EngCardPreview";
import EngDetailModal from "@/components/EngDetailModal";
import LogoTicker from "@/components/LogoTicker";
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

const lensPaneVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? 28 : -28,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? -20 : 20,
  }),
};

const lensPaneReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const SOCIAL_ICONS: Record<string, ReactNode> = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"
      />
    </svg>
  ),
  "X (Twitter)": (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.81-5.96 6.81H1.69l7.73-8.84L1.25 2.25h6.81l4.71 6.23 5.47-6.23zm-1.16 17.52h1.83L7.01 4.06H5.05l12.03 15.71z"
      />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"
      />
    </svg>
  ),
  Resume: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L18.5 9H15zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h5v1.5H8V10z"
      />
    </svg>
  ),
  Substack: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.45 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
      />
    </svg>
  ),
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
  const mql = window.matchMedia("(max-width: 560px)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useIsNarrow() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia("(max-width: 560px)").matches,
    () => false,
  );
}

/** Square brand marks for the Work hover meta thumb. */
const LOGO_BY_SLUG: Record<string, string> = {
  toolbox: "/logos/toolbox.png?v=2",
  warpbnb: "/logos/warpbnb.png?v=2",
  pathai: "/logos/pathai.png?v=2",
  bigbasket: "/logos/bigbasket.png?v=2",
  walkity: "/logos/walkity.png?v=2",
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
  logo?: string;
  aspect: Aspect;
  linkable: boolean;
  externalUrl?: string;
};

// Visual Craft shows project work only — studies flagged `inWorkGrid: false`
// (the Ikon PM systems artifacts) live under Systems Thinking instead.
const PROJECTS: Card[] = CASE_STUDIES.filter(
  (s) => s.inWorkGrid !== false,
).map((s, i) => {
  const cover = s.workCover;
  const coverVideo = isVideoSrc(cover);
  // A workCover is a purpose-built card asset (thumbnail.png / .mp4) — use it
  // as given. Only fall back to the derived /thumbs/ path when there isn't one.
  const thumb =
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
    description: s.description,
    year: s.year,
    category: s.category,
    shade: s.shade,
    media: coverVideo ? cover : still ? thumb : s.hero?.src,
    video: coverVideo ? true : still ? false : s.hero?.video,
    thumb,
    logo: LOGO_BY_SLUG[s.slug],
    aspect: ASPECT_BY_SLUG[s.slug] ?? ASPECTS[i % ASPECTS.length],
    linkable: s.linkable !== false,
    externalUrl: s.externalUrl,
  };
});

function WorkCard({
  card,
  onHover,
}: {
  card: Card;
  onHover?: (card: Card | null) => void;
}) {
  const { open } = usePageTransition();
  // Video covers play from the path as authored — the old /grid/ rewrite only
  // ever applied to assets that already lived under /grid/ or /new/.
  const gridSrc = card.video ? card.media : undefined;

  const inner = (
    <div className="workCardInner">
      <div className="workCardMediaWrap" style={{ background: card.shade }}>
        {gridSrc ? (
          <video
            className="workCardMedia"
            src={gridSrc}
            poster={card.thumb}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : card.thumb || card.media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="workCardMedia"
            src={card.thumb || card.media}
            alt=""
          />
        ) : (
          <span className="workCardPlaceholder">{card.title}</span>
        )}
      </div>
      <span className="workCardCaption">
        <span className="workCardName">{card.title}</span>
        <span className="workCardTagline">{card.tagline}</span>
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
        style={{ aspectRatio: card.aspect }}
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
        style={{ aspectRatio: card.aspect }}
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
      style={{ aspectRatio: card.aspect }}
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
  return (
    <button
      type="button"
      className="sysCard"
      onClick={onOpen}
      aria-haspopup="dialog"
    >
      <span className="sysCardMedia" style={{ background: item.shade }}>
        {item.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumb} alt="" />
        ) : null}
      </span>
      <span className="sysCardCopy">
        <span className="sysCardTitle">{item.title}</span>
        <span className="sysCardBody">{item.body}</span>
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

export default function Work() {
  const isNarrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const [lens, setLens] = useState<WorkLensId>("visual");
  const [lensDir, setLensDir] = useState(1);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [lastHoverIdx, setLastHoverIdx] = useState(0);
  const [engActive, setEngActive] = useState<EngComponent | null>(null);
  const [systemsActive, setSystemsActive] = useState<WorkListItem | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { open } = usePageTransition();
  // The panel's hover rail belongs to the project grid — only while Visual Craft.
  const showingProjects = lens === "visual";

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
  const hoverOn = hoverIdx >= 0;

  const setHoverCard = (card: Card | null) => {
    if (!card) {
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
    if (next) window.history.replaceState(null, "", `#${next.anchor}`);
    rootRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Deep link — /#systems-thinking opens that lens.
  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (!anchor) return;
    const match = WORK_LENSES.find((l) => l.anchor === anchor);
    if (!match || match.id === "visual") return;
    setLensDir(LENS_INDEX[match.id] - LENS_INDEX.visual || 1);
    setLens(match.id);
  }, []);

  // Keep off-screen loops paused — same gate GridCanvas uses for its tiles.
  useEffect(() => {
    const sc = rootRef.current;
    if (!sc) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { root: sc, rootMargin: "300px 0px" },
    );
    sc.querySelectorAll<HTMLVideoElement>("video").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [isNarrow, lens]);

  const body =
    lens === "visual" ? (
      isNarrow ? (
        <div className="workGrid workGridFlat">
          {cards.map((card) => (
            <WorkCard key={card.slug} card={card} onHover={setHoverCard} />
          ))}
        </div>
      ) : (
        <div className="workGrid">
          {columns.map((col, ci) => (
            <div className="workCol" key={ci}>
              {col.map((card) => (
                <WorkCard key={card.slug} card={card} onHover={setHoverCard} />
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
            onOpen={() => setSystemsActive(item)}
          />
        ))}
      </div>
    ) : (
      <div className="engGrid">
        {ENG_COMPONENTS.map((item) => (
          <EngCard
            key={item.id}
            item={item}
            onOpen={() => setEngActive(item)}
          />
        ))}
      </div>
    );

  return (
    <div ref={rootRef} className="workRoot workUniform">
      <aside className={"workPanel" + (hoverOn ? " is-project-hover" : "")}>
        <div className="workPanelTop">
          <h1 className="workBrand">
            Mayank Kinger<span className="workBrandDot">.</span>
          </h1>
          <p className="workSubtitle">
            I&apos;m a product designer and high agency builder with a
            founder&apos;s mindset who ships experiences with speed, taste,
            and judgement.
          </p>

          <div className="workSocials">
            {ABOUT_INTRO.links.map((link) => (
              <a
                key={link.label}
                className="workSocial"
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={link.label}
              >
                {SOCIAL_ICONS[link.label]}
              </a>
            ))}
          </div>

          <div className="workFit">
            <div className="workFitCopy">
              <p className="workFitTitle">{WORK_FIT_CTA.title}</p>
              <p className="workFitBody">{WORK_FIT_CTA.body}</p>
            </div>
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

          <LogoTicker />
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
                        <img src={c.logo || c.thumb} alt="" />
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

      <div
        className="workMain"
        onMouseLeave={() => {
          if (showingProjects) setHoverCard(null);
        }}
      >
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

      {engActive ? (
        <EngDetailModal item={engActive} onClose={() => setEngActive(null)} />
      ) : null}
      {systemsActive ? (
        <SystemsDetailOverlay
          item={systemsActive}
          onClose={() => setSystemsActive(null)}
        />
      ) : null}
    </div>
  );
}
