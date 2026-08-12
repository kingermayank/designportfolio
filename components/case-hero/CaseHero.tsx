import type { CSSProperties } from "react";
import ContentCard from "./ContentCard";
import HeroImage, { type HeroImageProps } from "./HeroImage";
import HeroTitle from "./HeroTitle";
import MetadataList, { type MetadataItem, type MetadataTags } from "./MetadataList";
import PrimaryButton from "./PrimaryButton";

export type CaseHeroTone = "neutral" | "light" | "dark";

export type CaseHeroBack = {
  /** Accessible name for the chevron — it has no visible label. */
  label: string;
  href?: string;
  onClick?: () => void;
};

export type CaseHeroProps = {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  /**
   * Substring of `title` rendered in the brand accent color.
   * Matched case-insensitively; first occurrence wins.
   */
  titleAccent?: string;
  description?: string;
  media: Omit<HeroImageProps, "children">;
  /** CTA — omitted entirely when there's no link. */
  ctaHref?: string;
  ctaLabel?: string;
  meta?: MetadataItem[];
  metaTags?: MetadataTags;
  /** Brand colour for the CTA. Label colour is derived for contrast. */
  accent?: string;
  tone?: CaseHeroTone;
  /** Minimal back control fixed to the top-left of the viewport. */
  back?: CaseHeroBack;
  className?: string;
};

/**
 * Picks black or white for text sitting on `hex`, using WCAG relative
 * luminance — so a mint accent gets dark text and a crimson one gets light.
 */
export function onAccent(hex?: string): string | undefined {
  if (!hex) return undefined;
  const raw = hex.replace("#", "").trim();
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return undefined;

  const channel = (i: number) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.4 ? "#111111" : "#ffffff";
}

const TONE_CLASS: Record<CaseHeroTone, string> = {
  neutral: "",
  light: " chToneLight",
  dark: " chToneDark",
};

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M10 3.5 5.5 8l4.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Wrap the first case-insensitive match of `accent` in `.chTitleAccent`. */
function titleWithAccent(title: string, accent?: string) {
  if (!accent) return title;
  const idx = title.toLowerCase().indexOf(accent.toLowerCase());
  if (idx < 0) return title;
  const end = idx + accent.length;
  return (
    <>
      {title.slice(0, idx)}
      <span className="chTitleAccent">{title.slice(idx, end)}</span>
      {title.slice(end)}
    </>
  );
}

/**
 * One continuous hero: the cover fills the first viewport, and the content
 * group (company + title) sits centered over the media.
 */
export default function CaseHero({
  eyebrow,
  title,
  titleAccent,
  description,
  media,
  ctaHref,
  ctaLabel = "View Website",
  meta,
  metaTags,
  accent,
  tone = "neutral",
  back,
  className,
}: CaseHeroProps) {
  const style: CSSProperties & Record<string, string | undefined> = {};
  if (accent) {
    style["--ch-accent"] = accent;
    const label = onAccent(accent);
    if (label) style["--ch-on-accent"] = label;
  }

  const aside =
    meta?.length || metaTags?.values.length ? (
      <MetadataList items={meta ?? []} tags={metaTags} />
    ) : null;

  return (
    <section className={"chHero" + TONE_CLASS[tone] + (className ? ` ${className}` : "")} style={style}>
      {back ? (
        back.href ? (
          <a className="chBack" href={back.href} aria-label={back.label}>
            <Chevron />
          </a>
        ) : (
          <button
            className="chBack"
            type="button"
            onClick={back.onClick}
            aria-label={back.label}
          >
            <Chevron />
          </button>
        )
      ) : null}

      <HeroImage {...media} />

      <ContentCard aside={aside}>
        {eyebrow ? <p className="chEyebrow">{eyebrow}</p> : null}
        <HeroTitle>{titleWithAccent(title, titleAccent)}</HeroTitle>
        {description ? <p className="chDesc">{description}</p> : null}
        {ctaHref ? (
          <div className="chActions">
            <PrimaryButton href={ctaHref}>{ctaLabel}</PrimaryButton>
          </div>
        ) : null}
      </ContentCard>
    </section>
  );
}
