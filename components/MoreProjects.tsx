"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { usePageTransition } from "@/components/PageTransition";
import {
  VISUAL_CRAFT_STUDIES,
  type CaseStudy,
} from "@/lib/caseStudies";

const ASPECT = "3 / 2";

const THUMB_SRCSET: Partial<Record<string, string>> = {
  pathai:
    "/pathai/thumbs/work-cover-1200.jpg 1200w, /pathai/thumbs/work-cover.jpg 2400w",
  walkity:
    "/walkity/thumbs/work-cover-1200.jpg?v=1 1200w, /walkity/thumbs/work-cover.jpg?v=1 2400w",
  bigbasket:
    "/bigbasket/thumbs/work-cover-1200.jpg?v=5 1200w, /bigbasket/thumbs/work-cover.jpg?v=5 2400w",
};

function thumbFor(src?: string): string | undefined {
  if (!src) return undefined;
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

type Card = {
  slug: string;
  title: string;
  tagline: string;
  year: number;
  category: string;
  shade: string;
  media?: string;
  video?: boolean;
  thumb?: string;
  thumbSrcSet?: string;
  linkable: boolean;
  externalUrl?: string;
};

function cardFromStudy(s: CaseStudy): Card {
  const cover = s.workCover;
  const coverVideo = isVideoSrc(cover);
  const thumb =
    (cover && !coverVideo ? cover : undefined) ??
    (coverVideo ? thumbFor(cover) : undefined) ??
    thumbFor(s.hero?.src) ??
    s.hero?.src;
  const still = Boolean((cover && !coverVideo) || s.workStill);
  return {
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    year: s.year,
    category: s.category,
    shade: s.shade,
    media: coverVideo ? cover : still ? thumb : s.hero?.src,
    video: coverVideo ? true : still ? false : s.hero?.video,
    thumb,
    thumbSrcSet: THUMB_SRCSET[s.slug],
    linkable: s.linkable !== false,
    externalUrl: s.externalUrl,
  };
}

function MoreProjectCard({ card }: { card: Card }) {
  const { open } = usePageTransition();
  const gridSrc = card.video ? card.media : undefined;

  const cardStyle = {
    aspectRatio: ASPECT,
    ["--work-card-ar"]: ASPECT,
  } as CSSProperties;

  const inner = (
    <div className="workCardInner">
      <div
        className="workCardMediaWrap"
        style={{ background: card.shade }}
      >
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
            srcSet={card.thumbSrcSet}
            sizes={
              card.thumbSrcSet
                ? "(max-width: 720px) 100vw, 50vw"
                : undefined
            }
            alt=""
            decoding="async"
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
    >
      {inner}
    </Link>
  );
}

export default function MoreProjects({ currentSlug }: { currentSlug: string }) {
  const cards = VISUAL_CRAFT_STUDIES.filter((s) => s.slug !== currentSlug).map(
    cardFromStudy,
  );

  if (cards.length === 0) return null;

  return (
    <section className="moreProjects" aria-labelledby="more-projects-heading">
      <h2 id="more-projects-heading" className="moreProjectsTitle">
        More projects<span className="moreProjectsDot">.</span>
      </h2>
      <div className="moreProjectsGrid">
        {cards.map((card) => (
          <MoreProjectCard key={card.slug} card={card} />
        ))}
      </div>
    </section>
  );
}
