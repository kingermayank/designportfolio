# Case hero tokens

The case hero owns a `--ch-*` token scope declared on `.chHero` in
`app/globals.css`. Everything the components render reads from these, so a
hero can be retuned per study (or per site) by overriding a handful of custom
properties instead of editing component CSS.

## Structure

One continuous composition, no nested surfaces:

```
.chHero
├── .chMedia          full-bleed cover at the art's own ratio, uncropped
│   └── .chBack       back chevron, pinned top-left inside the image
└── .chCard           unboxed content, pulled up over the image by --ch-overlap
    └── .chCardGrid   lead column (eyebrow/title/description/CTA) | MetadataList
```

The cover runs edge to edge at the art's true aspect ratio — no viewport
height, no `max-height`, nothing trimmed off the bottom. It simply flows to
whatever height the ratio works out to, which is often taller than the fold.
Pass `HeroImage` the art's `ratio` so the frame matches it exactly (the height
is then known before load, so nothing shifts); omit it only when the ratio
genuinely isn't known and the art should size itself.

The content group's position is `--ch-content-offset - --ch-overlap`: it rides
up into the bottom of the cover, then drops back down by the offset.

The content group has no background, border, radius or shadow — it overlaps
the lower part of the image and continues onto the page beneath it. No scrim
is drawn: **the hero asset is expected to carry its own baked-in gradient**
for text legibility.

## Tokens

| Token | Default | What it controls |
| --- | --- | --- |
| `--ch-space-1` … `--ch-space-8` | 4 → 64px | Internal rhythm (4px base) |
| `--ch-radius-sm` / `-md` / `-lg` / `-pill` | 4 / 10 / 16 / 999px | Button, media frame, back control |
| `--ch-font-display` | Cesare | Title |
| `--ch-font-body` | Geist | Everything else |
| `--ch-text-eyebrow` | 11px | Eyebrow + metadata labels |
| `--ch-text-title` | `clamp(2rem, 4.4vw, 3.4rem)` | Title |
| `--ch-text-body` | `clamp(0.95rem, 1.1vw, 1.05rem)` | Description, metadata values |
| `--ch-tracking-label` | `0.09em` | Uppercase label tracking |
| `--ch-measure` | 34rem | Max text width for title + description |
| `--ch-gutter` | `clamp(1rem, 5vw, 5rem)` | Page inset |
| `--ch-max-width` | 71.25rem | Content width (matches the editorial column) |
| `--ch-hero-ratio` | `16 / 9` | Cover ratio — set from the art so nothing is cropped |
| `--ch-overlap` | `clamp(14rem, 38vh, 26rem)` | Negative offset pulling content up into the cover |
| `--ch-content-offset` | `100px` | Downward nudge applied to the content group |
| `--ch-text` / `--ch-muted` / `--ch-faint` | white ramp | Foreground |
| `--ch-border` | hairline | Metadata rules |
| `--ch-surface` | `#161616` | Fallback contrast reference for the accent label |
| `--ch-accent` | `--ch-text` | Primary button fill |
| `--ch-on-accent` | derived | Primary button label (WCAG luminance pick) |
| `--ch-back-color` | `#ffffff` | Back chevron |
| `--ch-shade` | study shade | Fill behind the media while it loads |

## Tones

`.chHero` alone is the **neutral default**. Add `tone="light"` or
`tone="dark"` for the two variants; they only remap the foreground ramp
(`--ch-text`, `--ch-muted`, `--ch-faint`, `--ch-border`, `--ch-back-color`),
so layout and spacing are identical across all three.

## Responsive

- **≤ 900px** — grid collapses to one column, overlap drops to
  `clamp(6rem, 16vh, 10rem)` and the offset to `64px`, title clamp shrinks.
  The cover keeps its own ratio at every width — it is never re-cropped to fit
  a narrow screen.
- **≤ 560px** — overlap `clamp(4rem, 12vh, 7rem)`, offset `40px`, gutter
  `1rem`, CTA goes full width, chevron tucks in.

The overlap deliberately *shrinks* on narrow screens: a deep one would strand
the whole content group on top of the art, with only the art's own baked-in
gradient carrying contrast. A shallow one lets most of it land on the page
background instead.

## Motion

The content group fades and rises 14px on load — `transform` and `opacity`
only, so it can never shift layout. Disabled under
`prefers-reduced-motion: reduce`.
