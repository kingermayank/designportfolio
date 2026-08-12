"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_INTRO } from "@/lib/about";
import AboutContent from "@/components/AboutContent";
import EngCardPreview from "@/components/EngCardPreview";
import EngDetailModal from "@/components/EngDetailModal";
import { usePageTransition } from "@/components/PageTransition";
import { CASE_STUDIES } from "@/lib/caseStudies";
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

/* Page-stack handoff between work lenses — same cover ease as PageTransition.
   Each lens is a full viewport “page”; scrolling past its edge slides the next
   page up over it (and peels back on scroll up), so you never see two sections
   as one continuous landing page. */
const PAGE_DUR = 0.55;
const PAGE_EASE = [0.55, 0, 0.15, 1] as const;
/** Rest at the edge this long before overscroll can start a page flip. */
const EDGE_ARM_MS = 480;
/** Deliberate pull past a tall page’s end (e.g. Visual Craft masonry). */
const OVERSCROLL_TALL_PX = 280;
/** Pull past a short page that already fits the viewport. */
const OVERSCROLL_SHORT_PX = 240;
/** When peeling back to a page left at its bottom, land above the hair-trigger. */
const EDGE_RESTORE_PAD = 160;
/** Show the handoff cue once within this distance of the bottom. */
const CUE_SHOW_PX = 88;
/** Hide the cue only after scrolling this far back up (hysteresis → no flicker). */
const CUE_HIDE_PX = 200;
/** How far the real next page peeks up — about half a cue-tall strip. */
const NEXT_PEEK_PX = 112;
const PAGE_COUNT = WORK_LENSES.length;

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

// Rows read "Company · Discipline" — the trailing year is dropped, since the
// case study itself carries the date.
const META_YEAR = /\s*·\s*\d{4}\s*$/;

function WorkListRow({ item }: { item: WorkListItem }) {
  const { open } = usePageTransition();
  const meta = item.meta.replace(META_YEAR, "");
  const body = (
    <>
      <span className="workListThumb" style={{ background: item.shade }}>
        {item.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumb} alt="" />
        ) : null}
      </span>
      <span className="workListCopy">
        <span className="workListTitle">{item.title}</span>
        <span className="workListMeta">{meta}</span>
        <span className="workListBody">{item.body}</span>
      </span>
      {item.slug ? (
        <span className="workListArrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M3.5 10.5 10.5 3.5M5.5 3.5h5v5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </>
  );

  if (!item.slug) {
    return (
      <div className="workListRow workListRowStatic" aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/work/${item.slug}`}
      className="workListRow"
      onNavigate={(e) => {
        e.preventDefault();
        open(`/work/${item.slug}`, { title: item.title, subtitle: meta });
      }}
    >
      {body}
    </Link>
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
  const { open } = usePageTransition();
  const isNarrow = useIsNarrow();
  const reduce = useReducedMotion();
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [lastHoverIdx, setLastHoverIdx] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [engActive, setEngActive] = useState<EngComponent | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [edgeCueOn, setEdgeCueOn] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef(new Map<number, HTMLElement>());
  const scrollPosRef = useRef(new Map<number, number>());
  const pageBusyRef = useRef(false);
  const settleUntilRef = useRef(0);
  const overscrollRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchPullRef = useRef(0);
  /** performance.now() when the active page first hit a flip edge; 0 = not at edge. */
  const edgeSinceRef = useRef(0);
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;
  // The panel's hover rail belongs to the project grid — it only reads while
  // Visual Craft is the section in view.
  const showingProjects = activeSection === 0;

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

  const goToSection = useCallback(
    (i: number, smooth: boolean) => {
      if (i < 0 || i >= PAGE_COUNT) return false;
      const from = activeSectionRef.current;
      if (i === from) {
        sectionRefs.current.get(i)?.focus({ preventScroll: true });
        return true;
      }
      if (pageBusyRef.current) return false;

      const cur = sectionRefs.current.get(from);
      if (cur) scrollPosRef.current.set(from, cur.scrollTop);

      const animate = smooth && !reduce;
      if (animate) {
        pageBusyRef.current = true;
        window.setTimeout(() => {
          pageBusyRef.current = false;
        }, PAGE_DUR * 1000 + 40);
      }

      setActiveSection(i);
      overscrollRef.current = 0;
      touchPullRef.current = 0;
      edgeSinceRef.current = 0;
      setEdgeCueOn(false);
      // Ignore residual wheel/touch momentum so one flick can't chain pages.
      settleUntilRef.current =
        performance.now() + (animate ? PAGE_DUR * 1000 + 220 : 180);

      // Forward = fresh page at top; back = restore where you left off
      // (nudged up if you left at the bottom, so you aren't on the flip edge).
      const forward = i > from;
      requestAnimationFrame(() => {
        const el = sectionRefs.current.get(i);
        if (!el) return;
        if (forward) {
          el.scrollTop = 0;
        } else {
          const saved = scrollPosRef.current.get(i) ?? 0;
          const max = Math.max(0, el.scrollHeight - el.clientHeight);
          const pad = saved >= max - 24 ? EDGE_RESTORE_PAD : 0;
          el.scrollTop = Math.max(0, saved - pad);
        }
        el.focus({ preventScroll: true });
      });
      return true;
    },
    [reduce],
  );

  const selectSection = useCallback(
    (i: number, anchor: string) => {
      if (!goToSection(i, !reduce)) return;
      window.history.replaceState(null, "", `#${anchor}`);
      setNavOpen(false);
    },
    [goToSection, reduce],
  );

  // Wheel/touch anywhere on the work shell (incl. the left rail) drives the
  // active page — scroll its content, and at the edges flip the page stack.
  // Flips require a dwell at the edge, then a deliberate extra pull, so natural
  // scrolling through Visual Craft doesn't accidentally jump sections.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const page = () => sectionRefs.current.get(activeSectionRef.current);

    const atTop = (el: HTMLElement) => el.scrollTop <= 0;
    const atBottom = (el: HTMLElement) =>
      el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const edgeThreshold = (el: HTMLElement) =>
      el.scrollHeight <= el.clientHeight + 1
        ? OVERSCROLL_SHORT_PX
        : OVERSCROLL_TALL_PX;

    const edgeArmed = () =>
      edgeSinceRef.current > 0 &&
      performance.now() - edgeSinceRef.current >= EDGE_ARM_MS;

    const markEdge = (onEdge: boolean) => {
      if (!onEdge) {
        edgeSinceRef.current = 0;
        overscrollRef.current = 0;
        touchPullRef.current = 0;
        return;
      }
      if (!edgeSinceRef.current) edgeSinceRef.current = performance.now();
    };

    const updateCue = (el: HTMLElement) => {
      const canNext = activeSectionRef.current < PAGE_COUNT - 1;
      if (!canNext) {
        setEdgeCueOn(false);
        return;
      }
      const room = el.scrollHeight - el.clientHeight;
      if (room <= 0) {
        setEdgeCueOn(true);
        return;
      }
      const fromBottom = room - el.scrollTop;
      // Hysteresis: once shown, stay until you've clearly scrolled back up.
      setEdgeCueOn((was) =>
        was ? fromBottom <= CUE_HIDE_PX : fromBottom <= CUE_SHOW_PX,
      );
    };

    const flip = (dir: 1 | -1) => {
      const from = activeSectionRef.current;
      const next = from + dir;
      if (next < 0 || next >= PAGE_COUNT) return;
      const lens = WORK_LENSES[next];
      selectSection(next, lens.anchor);
    };

    const blockedTarget = (t: EventTarget | null) => {
      const node = t as Node | null;
      if (!node || !root.contains(node)) return true;
      // Eng detail modal / drawers handle their own scroll.
      return Boolean(
        (node as Element).closest?.(".engModal, .workNavDrawer"),
      );
    };

    const onWheel = (e: WheelEvent) => {
      if (reduce || pageBusyRef.current || e.ctrlKey) return;
      if (performance.now() < settleUntilRef.current) return;
      if (blockedTarget(e.target)) return;

      const el = page();
      if (!el) return;

      const fromPage = el.contains(e.target as Node);
      const down = e.deltaY > 0;
      const up = e.deltaY < 0;
      const canNext = activeSectionRef.current < PAGE_COUNT - 1;
      const canPrev = activeSectionRef.current > 0;
      const need = edgeThreshold(el);

      if (down && atBottom(el) && canNext) {
        markEdge(true);
        // Dwell first — don't kill the wheel or it feels stuck/jittery at the edge.
        if (!edgeArmed()) return;
        e.preventDefault();
        overscrollRef.current += e.deltaY;
        if (overscrollRef.current >= need) flip(1);
        return;
      }
      if (up && atTop(el) && canPrev) {
        markEdge(true);
        if (!edgeArmed()) return;
        e.preventDefault();
        overscrollRef.current += -e.deltaY;
        if (overscrollRef.current >= need) flip(-1);
        return;
      }

      markEdge(false);

      // Left rail (and anything outside the active page): proxy scroll into it.
      if (!fromPage && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollTop += e.deltaY;
        updateCue(el);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (blockedTarget(e.target)) return;
      touchStartYRef.current = e.touches[0]?.clientY ?? 0;
      touchPullRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (reduce || pageBusyRef.current) return;
      if (performance.now() < settleUntilRef.current) return;
      if (blockedTarget(e.target)) return;

      const el = page();
      if (!el) return;

      const y = e.touches[0]?.clientY ?? touchStartYRef.current;
      const dy = touchStartYRef.current - y; // finger up → positive (scroll down)
      touchStartYRef.current = y;
      if (dy === 0) return;

      const fromPage = el.contains(e.target as Node);
      const canNext = activeSectionRef.current < PAGE_COUNT - 1;
      const canPrev = activeSectionRef.current > 0;
      const need = edgeThreshold(el);

      if (dy > 0 && atBottom(el) && canNext) {
        markEdge(true);
        if (!edgeArmed()) return;
        touchPullRef.current += dy;
        if (touchPullRef.current >= need) flip(1);
        return;
      }
      if (dy < 0 && atTop(el) && canPrev) {
        markEdge(true);
        if (!edgeArmed()) return;
        touchPullRef.current += -dy;
        if (touchPullRef.current >= need) flip(-1);
        return;
      }

      markEdge(false);

      // Touch on the left rail — drag the active page.
      if (!fromPage) {
        el.scrollTop += dy;
        updateCue(el);
      }
    };

    const onPageScroll = () => {
      const el = page();
      if (!el) return;
      const canNext = activeSectionRef.current < PAGE_COUNT - 1;
      const canPrev = activeSectionRef.current > 0;
      const onFlipEdge =
        (atBottom(el) && canNext) || (atTop(el) && canPrev);
      markEdge(onFlipEdge);
      updateCue(el);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });

    const el = page();
    el?.addEventListener("scroll", onPageScroll, { passive: true });
    if (el) onPageScroll();

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      el?.removeEventListener("scroll", onPageScroll);
    };
  }, [reduce, selectSection, activeSection]);

  // Close the mobile section menu on Escape / outside tap / desktop resize.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      const root = navMenuRef.current;
      if (root && !root.contains(e.target as Node)) setNavOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 901px)").matches) setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [navOpen]);

  // Deep link — /#systems-thinking opens on that section.
  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (!anchor) return;
    const i = WORK_LENSES.findIndex((l) => l.anchor === anchor);
    if (i <= 0) return;
    // A frame late, so the masonry columns have laid out and offsetTop is real.
    const t = window.setTimeout(() => goToSection(i, false), 0);
    return () => window.clearTimeout(t);
  }, [goToSection]);

  // Pause loops that aren't on the active page; within the page, gate by
  // visibility against that page's own scroller.
  useEffect(() => {
    const sc = sectionRefs.current.get(activeSection);
    if (!sc) return;

    sectionRefs.current.forEach((section, i) => {
      if (i === activeSection) return;
      section.querySelectorAll<HTMLVideoElement>("video").forEach((v) => v.pause());
    });

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
  }, [activeSection, isNarrow]);

  const sectionBody = (id: WorkLensId) => {
    if (id === "visual") {
      return isNarrow ? (
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
      );
    }
    if (id === "systems") {
      return (
        <div className="workList">
          {SYSTEMS_LIST.map((item) => (
            <WorkListRow key={item.id} item={item} />
          ))}
        </div>
      );
    }
    if (id === "engineering") {
      return (
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
    }
    // About Me — the same right-column content the /about route renders.
    return (
      <div className="workAbout">
        <AboutContent />
      </div>
    );
  };

  const pageTransition = reduce
    ? { duration: 0 }
    : { duration: PAGE_DUR, ease: PAGE_EASE };

  return (
    <div ref={rootRef} className="workRoot workUniform">
      <aside className="workPanel">
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

          <nav className="workLenses" aria-label="Work sections">
            {WORK_LENSES.map((l, i) => {
              const active = i === activeSection;
              return (
                <a
                  key={l.id}
                  href={`#${l.anchor}`}
                  className={"workLens" + (active ? " on" : "")}
                  aria-current={active ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    selectSection(i, l.anchor);
                  }}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
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
        ref={navMenuRef}
        className={"workNavMenu" + (navOpen ? " open" : "")}
      >
        <button
          type="button"
          className="workNavToggle"
          aria-expanded={navOpen}
          aria-controls="work-nav-drawer"
          aria-label={navOpen ? "Close sections menu" : "Open sections menu"}
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <span className="workNavToggleBars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <nav
          id="work-nav-drawer"
          className="workNavDrawer"
          aria-label="Work sections"
          hidden={!navOpen}
        >
          {WORK_LENSES.map((l, i) => {
            const active = i === activeSection;
            return (
              <a
                key={l.id}
                href={`#${l.anchor}`}
                className={"workNavDrawerLink" + (active ? " on" : "")}
                aria-current={active ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  selectSection(i, l.anchor);
                }}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div
        className="workMain"
        onMouseLeave={() => {
          if (showingProjects) setHoverCard(null);
        }}
      >
        {WORK_LENSES.map((l, i) => {
          const on = i === activeSection;
          const peek = edgeCueOn && i === activeSection + 1;
          const y =
            i <= activeSection
              ? "0%"
              : peek
                ? `calc(100% - ${NEXT_PEEK_PX}px)`
                : "100%";
          return (
            <motion.section
              key={l.id}
              id={l.anchor}
              className={
                "workSection" + (on ? " on" : "") + (peek ? " peek" : "")
              }
              tabIndex={-1}
              // No visible heading — the panel rail is the label on screen, so
              // the section carries its name for assistive tech instead.
              aria-label={l.label}
              aria-hidden={on ? undefined : true}
              inert={on ? undefined : true}
              initial={false}
              animate={{ y }}
              transition={
                i === activeSection + 1
                  ? reduce
                    ? { duration: 0 }
                    : { duration: 0.32, ease: PAGE_EASE }
                  : pageTransition
              }
              style={{ zIndex: i + 1 }}
              ref={(el) => {
                if (el) sectionRefs.current.set(i, el);
                else sectionRefs.current.delete(i);
              }}
            >
              {sectionBody(l.id)}
              {l.nextCue ? (
                <div className="workPageCuePad" aria-hidden="true" />
              ) : null}
            </motion.section>
          );
        })}

        {WORK_LENSES[activeSection]?.nextCue ? (
          <div
            className={"workPageCue" + (edgeCueOn ? " show" : "")}
            aria-hidden="true"
          >
            <p className="workPageCueLabel">
              {WORK_LENSES[activeSection].nextCue}
            </p>
            <span className="workPageCueChevron">
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.5 6.25 8 10.75l4.5-4.5"
                />
              </svg>
            </span>
          </div>
        ) : null}
      </div>

      {engActive ? (
        <EngDetailModal item={engActive} onClose={() => setEngActive(null)} />
      ) : null}
    </div>
  );
}
