import type { CASE_STUDIES } from "@/lib/caseStudies";

type Study = (typeof CASE_STUDIES)[number];

export function thumbFor(src?: string): string | undefined {
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

export function isVideoSrc(src?: string): boolean {
  return Boolean(src && /\.(mp4|webm|mov)$/i.test(src));
}

/** The still a Visual Craft card shows (its image, or its video's poster). */
export function workCardThumb(s: Study): string | undefined {
  const cover = s.workCover;
  const coverVideo = isVideoSrc(cover);
  // A workCover is a purpose-built card asset (thumbnail.png / .mp4) — use it
  // as given. Only fall back to the derived /thumbs/ path when there isn't one.
  return (
    s.workPoster ??
    (cover && !coverVideo ? cover : undefined) ??
    (coverVideo ? thumbFor(cover) : undefined) ??
    thumbFor(s.hero?.src) ??
    s.hero?.src
  );
}
