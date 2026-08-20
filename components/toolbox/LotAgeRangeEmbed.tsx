"use client";

import { useEffect, useState } from "react";

const SHADE = "#222627";
const CAPTION =
  "Letting each dealer set their own definition of fresh, aging, and at-risk inventory.";

export default function LotAgeRangeEmbed() {
  const [iframeH, setIframeH] = useState(280);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (
        e.data?.type === "lot-age-embed:height" &&
        typeof e.data.height === "number"
      ) {
        setIframeH(e.data.height);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <figure className="csFigure">
      <div
        className="csMedia csMediaHover"
        style={{ aspectRatio: 16 / 9 }}
        tabIndex={0}
      >
        <div className="csMediaHoverWrap" style={{ background: SHADE }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iframe
              src="/toolbox/project/lot-age-range-card.html"
              title="Lot Age Range"
              loading="lazy"
              style={{
                border: 0,
                width: "100%",
                maxWidth: 836,
                height: iframeH,
                background: "transparent",
              }}
            />
          </div>
          <span
            className="engCardKind"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              pointerEvents: "none" as const,
            }}
          >
            Interactive
          </span>
        </div>
        <span className="csMediaHoverCaption">{CAPTION}</span>
      </div>
    </figure>
  );
}
