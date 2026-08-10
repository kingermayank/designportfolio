"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ABOUT_INTRO } from "@/lib/about";
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
  Email: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.51l-8 5.33-8-5.33V6h16zM4 18V8.74l7.4 4.93a1 1 0 0 0 1.2 0L20 8.74V18H4z"
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

/** Square brand marks for the Work hover meta thumb. */
const LOGO_BY_SLUG: Record<string, string> = {
  toolbox: "/logos/toolbox.png?v=2",
  warpbnb: "/logos/warpbnb.png?v=2",
  pathai: "/logos/pathai.png?v=2",
  bigbasket: "/logos/bigbasket.png?v=2",
  walkity: "/logos/walkity.png?v=2",
  "ikon-pm": "/logos/ikon.png?v=2",
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
};

const PROJECTS: Card[] = CASE_STUDIES.map((s, i) => {
  const cover = s.workCover;
  const coverVideo = isVideoSrc(cover);
  const thumb =
    (cover && !coverVideo ? thumbFor(cover) ?? cover : undefined) ??
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
  };
});

function WorkCard({
  card,
  onHover,
}: {
  card: Card;
  onHover?: (card: Card | null) => void;
}) {
  const gridSrc =
    card.video && card.media
      ? card.media.includes("/grid/") || card.media.includes("/new/")
        ? card.media
        : card.media.replace(/^\/([^/]+)\//, "/$1/grid/")
      : undefined;

  return (
    <Link
      href={`/work/${card.slug}`}
      className="workCard"
      style={{ aspectRatio: card.aspect }}
      onMouseEnter={() => onHover?.(card)}
      onFocus={() => onHover?.(card)}
      onBlur={() => onHover?.(null)}
    >
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
    </Link>
  );
}

function WorkListRow({ item }: { item: WorkListItem }) {
  const body = (
    <>
      <span className="workListThumb" style={{ background: item.shade }}>
        {item.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumb} alt="" />
        ) : null}
      </span>
      <span className="workListCopy">
        <span className="workListTitle">
          {item.title}
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
        </span>
        <span className="workListMeta">{item.meta}</span>
        <span className="workListBody">{item.body}</span>
      </span>
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
    <Link href={`/work/${item.slug}`} className="workListRow">
      {body}
    </Link>
  );
}

function EngCard({
  item,
  expanded,
  onToggle,
}: {
  item: EngComponent;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={"engCard" + (expanded ? " engCardOpen" : "")}>
      <button
        type="button"
        className="engCardHit"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span className="engCardMedia" style={{ background: item.shade }}>
          {item.video ? (
            <video
              src={item.src}
              poster={item.thumb}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
          ) : item.thumb || item.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.thumb || item.src} alt="" />
          ) : null}
        </span>
        <span className="engCardBar">
          <span className="engCardName">{item.title}</span>
          <span className="engCardKind">{item.kind}</span>
          <span className="engCardChevron" aria-hidden>
            {expanded ? "−" : "+"}
          </span>
        </span>
      </button>
      <div className={"engCardPanel" + (expanded ? " open" : "")}>
        <div className="engCardPanelInner">
          <p className="engCardBody">{item.body}</p>
          {item.slug ? (
            <Link href={`/work/${item.slug}`} className="engCardCase">
              Open case study ↗
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [lastHoverIdx, setLastHoverIdx] = useState(0);
  const [lens, setLens] = useState<WorkLensId>("visual");
  const [engOpen, setEngOpen] = useState<string | null>(null);
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

  return (
    <div className="workRoot workUniform">
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
                onClick={() => {
                  setLens(l.id);
                  setEngOpen(null);
                  setHoverIdx(-1);
                }}
              >
                {l.label}
                <span className={"workLensDot" + (active ? " show" : "")} aria-hidden />
              </button>
            );
          })}
        </nav>

        {showingProjects ? (
          <div className="workGrid" key="visual-masonry">
            {columns.map((col, ci) => (
              <div className="workCol" key={ci}>
                {col.map((card) => (
                  <WorkCard
                    key={card.slug}
                    card={card}
                    onHover={setHoverCard}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : lens === "systems" ? (
          <div className="workList" key="systems">
            {SYSTEMS_LIST.map((item) => (
              <WorkListRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="engGrid" key="engineering">
            {ENG_COMPONENTS.map((item) => (
              <EngCard
                key={item.id}
                item={item}
                expanded={engOpen === item.id}
                onToggle={() =>
                  setEngOpen((cur) => (cur === item.id ? null : item.id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
