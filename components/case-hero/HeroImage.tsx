import type { CSSProperties } from "react";

export type HeroImageProps = {
  /** Image or video in /public, or an absolute URL. */
  src?: string;
  alt?: string;
  /** Render a looping muted video instead of an image. */
  video?: boolean;
  /** Poster frame for the video. */
  poster?: string;
  /**
   * width / height. Sizes the frame to the art so it runs full-bleed and
   * uncropped; omit only when the ratio genuinely isn't known.
   */
  ratio?: number;
  /** Fill shown before the media paints (and behind transparent art). */
  shade?: string;
  /** Flat black overlay. `true` = 80%; a number is opacity 0–1. */
  scrim?: boolean | number;
  rounded?: boolean;
  className?: string;
};

/**
 * Full-width hero media. The frame takes the art's own aspect ratio, so it
 * bleeds edge to edge at whatever height that works out to — never cropped,
 * never capped — and the height is known before load, so nothing shifts.
 */
export default function HeroImage({
  src,
  alt = "",
  video,
  poster,
  ratio,
  shade,
  scrim,
  rounded,
  className,
}: HeroImageProps) {
  const style: CSSProperties & Record<string, string | undefined> = {};
  if (ratio) style["--ch-hero-ratio"] = String(ratio);
  if (shade) style["--ch-shade"] = shade;
  if (typeof scrim === "number") {
    style["--ch-scrim-opacity"] = String(scrim);
  } else if (scrim) {
    style["--ch-scrim-opacity"] = "0.8";
  }

  return (
    <figure
      className={
        "chMedia" +
        // Without a known ratio, let the art size itself rather than crop it.
        (ratio ? "" : " chMediaAuto") +
        // No art yet — collapse to a tinted band instead of a viewport-tall void.
        (src ? "" : " chMediaEmpty") +
        (scrim ? " chMediaScrim" : "") +
        (rounded ? " chMediaRounded" : "") +
        (className ? ` ${className}` : "")
      }
      style={style}
    >
      {src ? (
        video ? (
          <video
            className="chMediaFill"
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="chMediaFill" src={src} alt={alt} />
        )
      ) : null}
    </figure>
  );
}
