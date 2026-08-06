# Design System — Mayank Kinger Portfolio

A dark, typographic canvas in the spirit of [koto.com](https://koto.com): near-black stage,
architectural negative space, flat surfaces (no shadows), and a single warm accent.
Content comes from [kingermayank.com](https://www.kingermayank.com); the shell, motion,
and interaction language are custom.

---

## 1. Typography

Two families, strictly separated by role and size.

| Family | Role | Source | Weights |
| --- | --- | --- | --- |
| **Cesare** | Short display text only — project titles, "Our work", About greeting | `public/fonts/Cesare-Regular.woff2`, self-hosted via `next/font/local` | 400 (single cut) |
| **Geist** | Everything else — body, UI, navigation, labels, captions, metadata | Google Fonts via `next/font/google` | 300, 400, 500 |

Cesare is a condensed display serif by Alan Madić (X Cicéro), released under the
SIL Open Font License — free for personal and commercial use. It ships as a single
regular cut, so **display hierarchy is expressed through size and color, never weight.**

> **Constraint — incomplete character set.** Cesare is a revival of an *incomplete*
> metal set. It has no `%`, `→`, `{`, `}` and renders some figures blank. Use it only
> for short, letter-driven display text: project titles, "Our work", the About greeting.
> Any sentence containing numbers, percentages, or symbols is set in Geist.

### CSS variables

```css
--font-display: var(--font-cesare), "Times New Roman", serif;
--font-body:    var(--font-geist), ui-sans-serif, system-ui, sans-serif;
```

### Type scale

| Token | Size / Leading / Tracking | Family | Used for |
| --- | --- | --- | --- |
| `--text-display` | 48px / 1.0 / −0.01em | Cesare | Hero statement |
| `--text-display-sm` | 34px / 1.1 / −0.01em | Cesare | Project titles, "Our work" |
| `--text-heading` | 17px / 1.4, weight 500 | Geist | Section headings inside case studies |
| `--text-body` | 15px / 1.6 | Geist | Case study body copy |
| `--text-body-sm` | 13.5px / 1.5 | Geist | List descriptions, secondary copy |
| `--text-ui` | 13px / 1.4 | Geist | Nav items, taglines |
| `--text-caption` | 11px / 1.5 / 0.08em, uppercase | Geist | Captions, meta, credits, controls |

**Rules**
- Never set body copy in Cesare. Sentence-length display text uses Geist (see constraint above).
- Uppercase + letter-spacing is reserved for the caption tier (mono-flavored labels).
- Numerals in live/changing UI (the UTC clock) use `font-variant-numeric: tabular-nums`.

---

## 2. Color

Grayscale by design. The only chromatic element in the entire system is the wordmark.

| Token | Value | Role |
| --- | --- | --- |
| `--color-canvas` | `#161616` | Page background — the stage everything floats on |
| `--color-surface` | `#242424` | Raised surfaces: tiles, cards, media placeholders |
| `--color-border` | `#303030` | Hairlines, dividers, control outlines |
| `--color-faint` | `#595959` | Tertiary text: captions, meta, inactive nav |
| `--color-muted` | `#989898` | Secondary text: taglines, inactive titles |
| `--color-body` | `#b4b4b4` | Body copy — softer than white for long-form reading |
| `--color-text` | `#ffffff` | Headings, active states, key borders |
| `--color-accent` | `#ffe800` | **Wordmark only.** Never in UI, buttons, or text |

**Rules**
- Elevation is a lightness shift (`#161616 → #242424`), never a shadow or gradient.
- Placeholder media uses a graphite band `#202020`–`#2a2a2a` so blocks read against canvas.
- No color outside this scale. Real project screenshots supply all the color the page gets.

---

## 3. Spacing & shape

Base unit **4px**. Compact at the micro level, generous between sections.

| Token | Value |
| --- | --- |
| `--space-1` … `--space-12` | 4, 8, 12, 16, 24, 36, 48px |
| `--radius-sm` | 2px — controls, buttons, chips |
| `--radius-md` | 4px — media blocks, tiles |
| `--radius-lg` | 6px — grid tiles |

Section gap inside case studies: **90px**. Media gap: **14px**.

---

## 4. Motion

All motion is `transform`/`opacity` only, and every animated element collapses under
`prefers-reduced-motion: reduce`.

| Interaction | Spec |
| --- | --- |
| **Ripple zoom** (grid) | Focal tile springs to center (stiffness 520, damping 42); neighbors scatter radially — `d × 0.85 + 220 × e^(−d/380)` — with an 80µs/px stagger so displacement ripples outward. Settles ~250ms. |
| **Mode switch** (tabs) | Spatial shift: incoming view slides from its side, 400ms in / 300ms out, `cubic-bezier(0.23, 1, 0.32, 1)`. |
| **Title roll** (work list) | Masked vertical roll — incoming 333ms `cubic-bezier(0, 0, 0, 1)`, outgoing 133ms `cubic-bezier(0.75, 0, 0.85, 1)`. |
| **Description crossfade** | 167ms linear, incoming delayed 333ms so it lands after the title. |
| **Tile → hero morph** | 900ms `cubic-bezier(0.8, 0, 0.2, 1)`; the tile visibly enlarges because the list panel (36%) is wider than the case panel (24%). |
| **Text entrance** | Masked line rises from 110% below, 650ms `cubic-bezier(0.36, 0.54, 0, 0.99)`, staggered 70–80ms per line. |
| **Back navigation** | Detail fades out 200ms; list fades in rising 16px over 420ms, pre-scrolled to the case you left. |

Durations follow the page-transition band (300–400ms) for view changes and the
micro-interaction band (150–250ms) for controls.

---

## 5. Layout

- **Full-bleed canvas.** No max-width wrapper, no window chrome, no sidebar.
- **Fixed top bar** (60px): yellow wordmark left, live UTC clock right, over a canvas scrim.
- **Floating bottom control**: `GRID | CASE STUDY | ABOUT` segmented tabs, centered.
- **Work list**: sticky 36% text panel left, 16:9 tiles right.
- **Case detail**: sticky 24% panel (title, meta, section nav, credits) left, 76% content right.
- Everything is left-aligned. Negative space carries the composition.

---

## 6. Media

Case study media renders at its **natural aspect ratio** (declared per asset in
`lib/caseStudies.ts`), never cropped to a fixed frame — screenshots of UI must stay
readable. Only tiles, heroes, and next-up cards are locked to 16:9.

Videos autoplay muted and looped, inline. Assets live in `public/<slug>/`.

---

## 7. File map

| File | Contains |
| --- | --- |
| `app/globals.css` | All tokens + every component style |
| `app/layout.tsx` | Font loading (Cesare local, Geist Google) |
| `lib/tiles.ts` | Grid tile layout + graphite shade band |
| `lib/caseStudies.ts` | All case study content and media manifests |
| `lib/about.ts` | About page content |
| `components/GridCanvas.tsx` | Ripple zoom grid + tab shell |
| `components/CaseStudies.tsx` | Work list, case detail, morph transitions |
| `components/About.tsx` | About view |
| `components/TopNav.tsx` | Wordmark + UTC clock |
