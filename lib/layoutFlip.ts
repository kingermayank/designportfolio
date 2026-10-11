// FLIP for in-place layout swaps (split ⇄ editorial): the same DOM nodes are
// measured before and after a class change, then each one animates from where
// it was to where it now sits, so the page rearranges instead of being swapped.

const TEXT = ".workBrand, .workSubtitle, .workFitBtn, .workSocial, .workLens, .workLensDot";
const BOXES = ".workCard, .sysCard, .engCard";

const DURATION = 560;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Snap = { el: HTMLElement; rect: DOMRect; font: number; box: boolean };

export type LayoutSnapshot = Snap[];

function collect(root: ParentNode): { el: HTMLElement; box: boolean }[] {
  return [
    ...[...root.querySelectorAll<HTMLElement>(TEXT)].map((el) => ({ el, box: false })),
    ...[...root.querySelectorAll<HTMLElement>(BOXES)].map((el) => ({ el, box: true })),
  ];
}

/** First: record where everything sits before the layout changes. */
export function captureLayout(root: ParentNode): LayoutSnapshot {
  return collect(root).map(({ el, box }) => ({
    el,
    box,
    rect: el.getBoundingClientRect(),
    font: parseFloat(getComputedStyle(el).fontSize) || 1,
  }));
}

/** Last, Invert, Play: animate each surviving node from its old box. */
export function playLayout(snapshot: LayoutSnapshot) {
  const vh = window.innerHeight;
  for (const { el, rect: a, font, box } of snapshot) {
    if (!el.isConnected) continue;
    const b = el.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    // Nodes off screen both before and after would only cost frames.
    const seen = (r: DOMRect) => r.bottom > -vh * 0.25 && r.top < vh * 1.25;
    if (!seen(a) && !seen(b)) continue;

    let from: string;
    if (box) {
      // Cards: corner-anchored move + resize.
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      from = `translate(${dx}px, ${dy}px) scale(${a.width / b.width}, ${a.height / b.height})`;
    } else {
      // Text: move by center, scale only with the font so it never stretches.
      const dx = a.left + a.width / 2 - (b.left + b.width / 2);
      const dy = a.top + a.height / 2 - (b.top + b.height / 2);
      const s = font / (parseFloat(getComputedStyle(el).fontSize) || font);
      from = `translate(${dx}px, ${dy}px) scale(${s})`;
    }
    if (from === "translate(0px, 0px) scale(1)" || from === "translate(0px, 0px) scale(1, 1)") continue;

    el.animate(
      [
        { transform: from, transformOrigin: box ? "0 0" : "50% 50%" },
        { transform: "none", transformOrigin: box ? "0 0" : "50% 50%" },
      ],
      { duration: DURATION, easing: EASE },
    );
  }
}
