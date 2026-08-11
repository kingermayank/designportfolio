"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  CASE_STUDIES,
  type CaseMedia,
  type MediaBlock,
} from "@/lib/caseStudies";
import { caseHeroProps } from "@/lib/caseHero";
import { CaseHero, MetadataList, PrimaryButton, onAccent } from "@/components/case-hero";
import CommentFieldStates from "@/components/pathai/CommentFieldStates";
import CommentCardAnatomy from "@/components/pathai/CommentCardAnatomy";
import RegionEdgeCases from "@/components/pathai/region-edge-cases/RegionEdgeCases";
import Rise from "@/components/Rise";

// /toolbox/hero.mp4 -> /toolbox/thumbs/hero.jpg — every asset has one, so a
// video shows its first frame immediately instead of flashing its backdrop.
function posterFor(src: string): string | undefined {
  const m = src.match(/^\/([^/]+)\/([^/]+)\.mp4$/);
  return m ? `/${m[1]}/thumbs/${m[2]}.jpg` : undefined;
}

function youtubeEmbedSrc(src: string): string | undefined {
  const m = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : undefined;
}

// Fills its (positioned, overflow-hidden) parent with the real asset, if any.
function MediaFill({ media }: { media?: CaseMedia }) {
  if (!media?.src) return null;
  if (media.youtube) {
    const embed = youtubeEmbedSrc(media.src);
    if (!embed) return null;
    return (
      <iframe
        className="csFill csYoutube"
        src={embed}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  const contain = media.fit === "contain";
  const fillClass = "csFill" + (contain ? " csFillContain" : "");
  const asset = media.video ? (
    <video
      className={fillClass}
      src={media.src}
      poster={posterFor(media.src)}
      autoPlay
      muted
      loop
      playsInline
      ref={(el) => {
        if (!el) return;
        const rate = media.playbackRate ?? 1;
        if (el.playbackRate !== rate) el.playbackRate = rate;
      }}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={fillClass} src={media.src} alt="" />
  );

  // Contained media sits in a padded stage so object-fit:contain can shrink
  // the frame into the shade — never cover/crop/overflow the outer 3:2 box.
  if (contain) {
    const pad = media.pad;
    const padY = (n?: number) =>
      n != null && n > 0 ? `clamp(1.25rem, 6.5vw, ${n}px)` : "0px";
    const padX = (n?: number) =>
      n != null && n > 0 ? `clamp(0.75rem, 4vw, ${n}px)` : "0px";
    return (
      <div
        className="csMediaStage"
        style={
          {
            "--cs-media-pad-top": padY(pad?.top),
            "--cs-media-pad-bottom": padY(pad?.bottom),
            "--cs-media-pad-left": padX(pad?.left),
            "--cs-media-pad-right": padX(pad?.right),
          } as CSSProperties
        }
      >
        {media.frame === "glass" ? (
          <div className="csMediaGlass">{asset}</div>
        ) : (
          asset
        )}
      </div>
    );
  }

  return asset;
}

function MediaTile({
  media,
  fill,
  bleed,
}: {
  media: CaseMedia;
  /** Stretch to fill a split-cell instead of locking aspect-ratio. */
  fill?: boolean;
  /** Edge-to-edge — breaks out of the editorial content max-width. */
  bleed?: boolean;
}) {
  return (
    <figure className={"csFigure" + (bleed ? " csFigureBleed" : "")}>
      <div
        className={
          "csMedia csMediaHover" +
          (fill ? " csMediaFill" : "") +
          (bleed ? " csMediaBleed" : "")
        }
        style={
          fill
            ? undefined
            : { aspectRatio: media.ar ?? 16 / 9 }
        }
        tabIndex={0}
      >
        <div
          className="csMediaHoverWrap"
          style={{ background: media.shade }}
        >
          <MediaFill media={media} />
        </div>
        <span className="csMediaHoverCaption">Lorem ipsum</span>
      </div>
    </figure>
  );
}

function MediaEmbed({ embed }: { embed: MediaBlock & { type: "embed" } }) {
  if (embed.embed === "pathai-comment-states") {
    return <CommentFieldStates />;
  }
  if (embed.embed === "pathai-comment-anatomy") {
    return <CommentCardAnatomy />;
  }
  if (embed.embed === "pathai-region-edge-cases") {
    return <RegionEdgeCases />;
  }
  return null;
}

function MediaBlocks({
  blocks,
  bare,
}: {
  blocks: MediaBlock[];
  /** Render tiles without an outer stack wrapper (parent supplies the gap). */
  bare?: boolean;
}) {
  const items = blocks.map((block, i) =>
    block.type === "full" ? (
      <MediaTile key={i} media={block.media} bleed={block.bleed} />
    ) : block.type === "embed" ? (
      <MediaEmbed key={i} embed={block} />
    ) : (
      <div
        key={i}
        className={
          "csMediaSplit" + (block.fillLeft === false ? " csMediaSplitNatural" : "")
        }
        style={
          block.columns
            ? {
                gridTemplateColumns: `${block.columns[0]}fr ${block.columns[1]}fr`,
              }
            : undefined
        }
      >
        <MediaTile media={block.left} fill={block.fillLeft !== false} />
        <div className="csMediaSplitRight">
          {block.right.map((m, j) => (
            <MediaTile key={j} media={m} />
          ))}
        </div>
      </div>
    ),
  );
  if (bare) return <>{items}</>;
  return <div className="csMediaStack">{items}</div>;
}

/**
 * Editorial media stack: grid-bound tiles stay in the max-width column;
 * `bleed` full blocks render as siblings at 100% width (same as the hero).
 */
function EditorialMediaFlow({
  blocks,
  fallback,
}: {
  blocks?: MediaBlock[];
  fallback: CaseMedia[];
}) {
  if (!blocks?.length) {
    return (
      <div className="csEditorialMedia">
        {fallback.map((media, i) => (
          <MediaTile key={i} media={media} />
        ))}
      </div>
    );
  }

  const segments: (
    | { kind: "grid"; blocks: MediaBlock[]; key: string }
    | { kind: "bleed"; media: CaseMedia; key: string }
  )[] = [];

  let gridBatch: MediaBlock[] = [];
  const flushGrid = (key: string) => {
    if (!gridBatch.length) return;
    segments.push({ kind: "grid", blocks: gridBatch, key });
    gridBatch = [];
  };

  blocks.forEach((block, i) => {
    if (block.type === "full" && block.bleed) {
      flushGrid(`grid-${i}`);
      segments.push({ kind: "bleed", media: block.media, key: `bleed-${i}` });
      return;
    }
    gridBatch.push(block);
  });
  flushGrid("grid-end");

  return (
    <div className="csEditorialMediaFlow">
      {segments.map((seg) =>
        seg.kind === "bleed" ? (
          <div key={seg.key} className="csEditorialBleed">
            <MediaTile media={seg.media} bleed />
          </div>
        ) : (
          <div key={seg.key} className="csEditorialMedia">
            <MediaBlocks blocks={seg.blocks} bare />
          </div>
        ),
      )}
    </div>
  );
}

// Timings lifted from koto.com's DOM:
// - title roll: incoming 333ms cubic-bezier(0,0,0,1), outgoing 133ms cubic-bezier(0.75,0,0.85,1)
// - description/meta: opacity 167ms linear, incoming delayed 333ms
const TITLE_IN = "transform 333ms cubic-bezier(0, 0, 0, 1)";
const TITLE_OUT = "transform 133ms cubic-bezier(0.75, 0, 0.85, 1)";
const DESC_FADE = "opacity 167ms linear";

type Pending = { type: "close"; idx: number };

/** Open detail from Work — jump straight into the case (no morph). */
export type CaseExternalEntry = {
  slug: string;
  onClose: () => void;
  /** When set, “next case” updates the route instead of swapping in place. */
  onNavigate?: (slug: string) => void;
};


type Props = {
  /** When set, skip the case list and open detail from a Work card. */
  externalEntry?: CaseExternalEntry | null;
  /** Editorial edge-to-edge project detail treatment. */
  layout?: "standard" | "editorial";
};

function indexForSlug(slug: string): number {
  const idx = CASE_STUDIES.findIndex((s) => s.slug === slug);
  return idx >= 0 ? idx : 0;
}

export default function CaseStudies({ externalEntry = null, layout = "standard" }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const detailScrollRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const footerTileRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef(new Map<number, HTMLDivElement>());
  const sectionRefs = useRef(new Map<number, HTMLElement>());
  const pendingRef = useRef<Pending | null>(null);
  const externalRef = useRef(externalEntry);
  externalRef.current = externalEntry;
  const startedExternal = useRef(false);

  const initialIdx = externalEntry ? indexForSlug(externalEntry.slug) : 0;

  const [rootH, setRootH] = useState(600);
  const [view, setView] = useState<"list" | "detail">(externalEntry ? "detail" : "list");
  const [active, setActive] = useState(initialIdx);
  const [detailIdx, setDetailIdx] = useState(initialIdx);
  const [listFade, setListFade] = useState(false);
  const [listEntering, setListEntering] = useState(false);
  const [closing, setClosing] = useState(false);
  const [contentIn, setContentIn] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [footerProgress, setFooterProgress] = useState(0);

  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setRootH(root.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  const showDetail = useCallback((idx: number) => {
    setDetailIdx(idx);
    setActive(idx);
    setView("detail");
    setActiveSection(0);
    setFooterProgress(0);
    setListFade(false);
    setContentIn(true);
    requestAnimationFrame(() => detailScrollRef.current?.scrollTo(0, 0));
  }, []);

  const openCase = useCallback(
    (idx: number, _el?: HTMLElement) => {
      showDetail(idx);
    },
    [showDetail],
  );

  // Work → case: open the matching study immediately (no expand morph).
  useLayoutEffect(() => {
    if (!externalEntry || startedExternal.current) return;
    const idx = CASE_STUDIES.findIndex((s) => s.slug === externalEntry.slug);
    if (idx < 0) {
      externalEntry.onClose();
      return;
    }
    startedExternal.current = true;
    showDetail(idx);
  }, [externalEntry, showDetail]);

  const nextCase = useCallback(() => {
    const nextIdx = (detailIdx + 1) % CASE_STUDIES.length;
    const entry = externalRef.current;
    if (entry?.onNavigate) {
      entry.onNavigate(CASE_STUDIES[nextIdx].slug);
      return;
    }
    showDetail(nextIdx);
  }, [detailIdx, showDetail]);

  // Back to the list, koto-style: the detail page fades out fast, then the
  // list fades in with a subtle rise, pre-scrolled so the case you were
  // reading is centered. From Work, Back dismisses the overlay.
  const closingRef = useRef(false);
  const startClose = useCallback(() => {
    if (viewRef.current !== "detail" || closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    const entry = externalRef.current;
    if (entry) {
      window.setTimeout(() => {
        entry.onClose();
        closingRef.current = false;
      }, 190);
      return;
    }
    pendingRef.current = { type: "close", idx: detailIdx };
    window.setTimeout(() => {
      setView("list");
      setListFade(true);
      setListEntering(true);
      setClosing(false);
      closingRef.current = false;
    }, 190);
  }, [detailIdx]);

  const startCloseRef = useRef(startClose);
  startCloseRef.current = startClose;

  // Once the list mounts hidden, center the source tile, then release the
  // fade/rise in the next tick so the transition actually plays.
  useLayoutEffect(() => {
    const p = pendingRef.current;
    if (view !== "list" || !p || p.type !== "close") return;
    pendingRef.current = null;
    const sc = listScrollRef.current;
    const tile = tileRefs.current.get(p.idx);
    if (sc && tile) {
      sc.scrollTop = Math.max(0, tile.offsetTop - (sc.clientHeight - tile.offsetHeight) / 2);
    }
    setActive(p.idx);
    window.setTimeout(() => {
      setListFade(false);
      setListEntering(false);
    }, 30);
  }, [view]);

  useEffect(() => {
    detailScrollRef.current?.scrollTo(0, 0);
  }, [detailIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") startCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onListScroll = useCallback(() => {
    const sc = listScrollRef.current;
    if (!sc) return;
    const center = sc.scrollTop + sc.clientHeight / 2;
    let idx = -1;
    tileRefs.current.forEach((el, i) => {
      if (el.offsetTop <= center && el.offsetTop + el.offsetHeight > center) idx = i;
    });
    if (idx >= 0) setActive(idx);
  }, []);

  const onDetailScroll = useCallback(() => {
    const sc = detailScrollRef.current;
    if (!sc) return;
    const center = sc.scrollTop + sc.clientHeight / 2;
    let idx = 0;
    sectionRefs.current.forEach((el, i) => {
      if (el.offsetTop <= center) idx = Math.max(idx, i);
    });
    setActiveSection(idx);
    const f = footerRef.current;
    if (f) {
      const p = (sc.scrollTop + sc.clientHeight - f.offsetTop) / f.offsetHeight;
      setFooterProgress(Math.min(1, Math.max(0, p)));
    }
  }, []);

  // Custom "VIEW CASE" cursor chip, driven outside React state.
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const chip = chipRef.current;
    const root = rootRef.current;
    if (!chip || !root) return;
    const over = (e.target as HTMLElement).closest?.("[data-view-cursor]");
    if (over) {
      const rr = root.getBoundingClientRect();
      chip.style.opacity = "1";
      chip.style.transform = `translate(${e.clientX - rr.left}px, ${e.clientY - rr.top}px) translate(-50%, -50%)`;
    } else {
      chip.style.opacity = "0";
    }
  }, []);

  const study = CASE_STUDIES[detailIdx];
  const next = CASE_STUDIES[(detailIdx + 1) % CASE_STUDIES.length];

  const fromWork = !!externalEntry;
  const editorial = layout === "editorial";
  const overview = study.description;
  const heroProps = caseHeroProps(study);
  const {
    meta: heroMeta,
    metaTags: heroMetaTags,
    description: _heroDescription,
    ctaHref: overviewCtaHref,
    ctaLabel: overviewCtaLabel,
    accent: overviewAccent,
    ...heroOnly
  } = heroProps;
  const overviewCtaStyle: CSSProperties | undefined = overviewAccent
    ? {
        ["--ch-accent"]: overviewAccent,
        ["--ch-on-accent"]: onAccent(overviewAccent) ?? "#ffffff",
      }
    : undefined;

  return (
    <div
      ref={rootRef}
      className={
        "csRoot" +
        (fromWork ? " csFromWork" : "") +
        (fromWork && view === "detail" ? " csFromWorkSolid" : "")
      }
      onMouseMove={onMouseMove}
    >
      {fromWork && view === "list" && <div className="csWorkScrim" aria-hidden />}

      {view === "list" && !fromWork && (
        <div
          ref={listScrollRef}
          className={"csList" + (listFade ? " faded" : "") + (listEntering ? " entering" : "")}
          onScroll={onListScroll}
        >
          <div className="csListInner">
            <div className="csPanel" style={{ height: rootH }}>
              <div className="csBrand">
                Mayank Kinger<span className="csDot">.</span>
              </div>
              <p className="csBio">
                I am a product designer and high agency builder with a founder&apos;s
                mindset who ships experiences with speed, taste, and judgment.
              </p>
              <div className="csWorkBlock">
                <div className="csTitleMask">
                  {CASE_STUDIES.map((s, i) => (
                    <div
                      key={s.slug}
                      className="csTitleLayer"
                      style={{
                        position: i === 0 ? "relative" : "absolute",
                        transform: `translateY(${i < active ? -100 : i > active ? 100 : 0}%)`,
                        transition: i === active ? TITLE_IN : TITLE_OUT,
                      }}
                    >
                      {s.title}
                    </div>
                  ))}
                </div>
                <div className="csDescWrap">
                  {CASE_STUDIES.map((s, i) => (
                    <div
                      key={s.slug}
                      className="csDescLayer"
                      style={{
                        opacity: i === active ? 1 : 0,
                        transition: DESC_FADE,
                        transitionDelay: i === active ? "333ms" : "0ms",
                      }}
                    >
                      <p className="csDesc">{s.description}</p>
                      <div className="csMeta">
                        <div className="csThumb" style={{ background: s.shade }} />
                        <div>
                          <div className="csTagline">{s.tagline}</div>
                          <div className="csYear">
                            {s.year}, {s.category.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="csTiles">
              {CASE_STUDIES.map((s, i) => (
                <div
                  key={s.slug}
                  ref={(el) => {
                    if (el) tileRefs.current.set(i, el);
                    else tileRefs.current.delete(i);
                  }}
                  data-view-cursor
                  className="csTile"
                  style={{ background: s.shade }}
                  onClick={(e) => openCase(i, e.currentTarget)}
                >
                  <MediaFill media={s.hero} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "detail" && (
        <div
          ref={detailScrollRef}
          className={"csDetail" + (closing ? " closing" : "")}
          onScroll={onDetailScroll}
        >
          <div className={"csDetailInner" + (editorial ? " csEditorialDetail" : "")}>
            {editorial ? (
              <div className="csEditorialContent">
                <div ref={heroRef}>
                  <CaseHero
                    {...heroOnly}
                    className="csCaseHero"
                    back={{ label: "All projects", onClick: startClose }}
                  />
                </div>

                <section className={"csEditorialIntro csFade" + (contentIn ? " in" : "")}>
                  <div className="csEditorialOverview">
                    <span>Overview</span>
                    <p>{overview}</p>
                    {overviewCtaHref ? (
                      <div className="csEditorialCta" style={overviewCtaStyle}>
                        <PrimaryButton href={overviewCtaHref}>
                          {overviewCtaLabel ?? "View website"}
                        </PrimaryButton>
                      </div>
                    ) : null}
                  </div>
                  {heroMeta?.length || heroMetaTags?.values.length ? (
                    <MetadataList items={heroMeta ?? []} tags={heroMetaTags} />
                  ) : null}
                </section>

                <div className={"csFade" + (contentIn ? " in" : "")}>
                  <EditorialMediaFlow
                    blocks={study.mediaBlocks}
                    fallback={study.sections.flatMap((sec) => sec.media)}
                  />
                </div>
              </div>
            ) : <>
            <div className="csPanel csDetailPanel" style={{ height: rootH }}>
              <button
                className={"csBack csFade" + (contentIn ? " in" : "")}
                onClick={startClose}
                type="button"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M10 3.5 5.5 8l4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>
              <div className="csDetailHead">
                <Rise show={contentIn} delay={0}>
                  <div
                    className={
                      "csDetailTitle" +
                      (study.highlights ? " csDetailTitleCesare" : "")
                    }
                  >
                    {study.tagline}
                  </div>
                </Rise>
                {study.highlights ? (
                  <div className="csHighlights">
                    {study.highlights.map((h, i) => (
                      <Rise key={h.label} show={contentIn} delay={80 + i * 70}>
                        <div className="csHighlight">
                          <div
                            className="csHighlightLabel"
                            style={
                              study.accent
                                ? { color: study.accent }
                                : undefined
                            }
                          >
                            {h.label}
                          </div>
                          <p className="csHighlightBody">{h.body}</p>
                        </div>
                      </Rise>
                    ))}
                  </div>
                ) : (
                  <>
                    <Rise show={contentIn} delay={70}>
                      <div className="csDetailSub">{study.tagline}</div>
                    </Rise>
                    <Rise show={contentIn} delay={120}>
                      <div className="csDetailYear mono">
                        {study.category.toUpperCase()} · {study.year}
                      </div>
                    </Rise>
                    <nav className="csNav">
                      {study.sections.map((sec, i) => (
                        <Rise key={sec.nav} show={contentIn} delay={240 + i * 50}>
                          <div
                            className={
                              "csNavItem" + (i === activeSection ? " on" : "")
                            }
                          >
                            {sec.nav}
                          </div>
                        </Rise>
                      ))}
                    </nav>
                  </>
                )}
                {study.websiteUrl && (
                  <Rise
                    show={contentIn}
                    delay={
                      study.highlights
                        ? 80 + study.highlights.length * 70 + 40
                        : 320
                    }
                  >
                    <a
                      className="csWebsiteCta"
                      href={study.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={
                        study.accent
                          ? { backgroundColor: study.accent }
                          : undefined
                      }
                    >
                      View website
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.5 11.5 11.5 4.5M6.5 4.5h5v5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </Rise>
                )}
              </div>
            </div>
            <div className="csContent">
              {study.mediaOnly ? (
                <div className={"csMediaRail csFade" + (contentIn ? " in" : "")}>
                  <div
                    ref={heroRef}
                    className="csHero"
                    style={{
                      background: study.hero?.shade ?? study.shade,
                      aspectRatio: study.hero?.ar ?? 16 / 9,
                    }}
                  >
                    <MediaFill media={study.hero} />
                  </div>
                  {study.mediaBlocks?.length ? (
                    <MediaBlocks blocks={study.mediaBlocks} bare />
                  ) : (
                    study.sections
                      .flatMap((sec) => sec.media)
                      .map((m, j) => <MediaTile key={j} media={m} />)
                  )}
                  <div
                    ref={footerRef}
                    className="csFooter"
                    style={{ height: Math.round(rootH * 0.94) }}
                  >
                    <div
                      ref={footerTileRef}
                      data-view-cursor
                      className="csNextTile"
                      style={{
                        background: next.shade,
                        transform: `scale(${0.5 + 0.5 * footerProgress})`,
                      }}
                      onClick={nextCase}
                    >
                      <MediaFill media={next.hero} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    ref={heroRef}
                    className="csHero"
                    style={{
                      background: study.hero?.shade ?? study.shade,
                      aspectRatio: study.hero?.ar ?? 16 / 9,
                    }}
                  >
                    <MediaFill media={study.hero} />
                  </div>
                  <div className={"csFade" + (contentIn ? " in" : "")}>
                    {study.sections.map((sec, i) => (
                      <section
                        key={sec.nav}
                        ref={(el) => {
                          if (el) sectionRefs.current.set(i, el);
                          else sectionRefs.current.delete(i);
                        }}
                        className="csSection"
                      >
                        {sec.heading && (
                          <h3 className="csHeading">{sec.heading}</h3>
                        )}
                        {sec.body.map((p, k) => (
                          <p key={k} className="csBody">
                            {p}
                          </p>
                        ))}
                        {sec.media.map((m, j) => (
                          <figure key={j} className="csFigure">
                            <div
                              className="csMedia"
                              style={{
                                background: m.shade,
                                aspectRatio: m.ar ?? 16 / 9,
                              }}
                            >
                              <MediaFill media={m} />
                            </div>
                            {m.caption && (
                              <figcaption className="csCaption mono">
                                {m.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </section>
                    ))}
                    <div
                      ref={footerRef}
                      className="csFooter"
                      style={{ height: Math.round(rootH * 0.94) }}
                    >
                      <div className="csNextLabel mono">NEXT UP</div>
                      <div
                        className={
                          "csNextText" + (footerProgress > 0.2 ? " in" : "")
                        }
                      >
                        <div className="csDetailTitle">{next.title}</div>
                        <div className="csDetailTagline">{next.tagline}</div>
                      </div>
                      <button
                        className="csViewAll mono"
                        onClick={startClose}
                        type="button"
                      >
                        [ VIEW ALL PROJECTS ]{" "}
                        <span>({CASE_STUDIES.length})</span>
                      </button>
                      <div
                        ref={footerTileRef}
                        data-view-cursor
                        className="csNextTile"
                        style={{
                          background: next.shade,
                          transform: `scale(${0.5 + 0.5 * footerProgress})`,
                        }}
                        onClick={nextCase}
                      >
                        <MediaFill media={next.hero} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            </>}
          </div>
        </div>
      )}

      <div ref={chipRef} className="csCursorChip mono">
        ↗ VIEW CASE
      </div>
    </div>
  );
}
