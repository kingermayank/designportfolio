"use client";

import { useState } from "react";
import type { EngComponent } from "@/lib/workLenses";
import DeferredVideo from "@/components/DeferredVideo";

/** Card covers for Design Engineering entries — static capture or looping video. */
export default function EngCardPreview({ item }: { item: EngComponent }) {
  const hasMedia = Boolean(item.video ? item.src : item.thumb || item.src);
  const frame = item.frame ?? "cover";
  const mediaClass =
    "engCardMedia" +
    (frame === "site" ? " engCardMediaSite" : "") +
    (frame === "center" ? " engCardMediaCenter" : "");
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const showStill = Boolean(item.video && item.thumb) && (!live || failed);

  return (
    <span
      className={mediaClass}
      style={{
        background: item.matte ?? item.shade,
      }}
    >
      {item.video && item.src ? (
        <span className="engCardClip">
          <DeferredVideo
            src={item.src}
            poster={item.thumb || item.src}
            activation="visible"
            onPlaybackStart={() => {
              setLive(true);
              setFailed(false);
            }}
            onPlaybackError={() => setFailed(true)}
          />
          {showStill ? <img src={item.thumb} alt="" /> : null}
        </span>
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
