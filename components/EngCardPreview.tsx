"use client";

import type { EngComponent } from "@/lib/workLenses";

/** Card covers for Design Engineering entries — static capture or looping video. */
export default function EngCardPreview({ item }: { item: EngComponent }) {
  const hasMedia = Boolean(item.video ? item.src : item.thumb || item.src);
  const frame = item.frame ?? "cover";
  const mediaClass =
    "engCardMedia" +
    (frame === "site" ? " engCardMediaSite" : "") +
    (frame === "center" ? " engCardMediaCenter" : "");

  return (
    <span
      className={mediaClass}
      style={{
        background: item.matte ?? item.shade,
      }}
    >
      {item.video && item.src ? (
        <video
          src={item.src}
          poster={item.thumb}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      ) : hasMedia ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.thumb || item.src} alt="" />
      ) : (
        <span className="engCardPlaceholder">
          {item.kind === "Website" || item.href ? "↗" : item.embedUrl ? "▸" : "◇"}
        </span>
      )}
    </span>
  );
}
