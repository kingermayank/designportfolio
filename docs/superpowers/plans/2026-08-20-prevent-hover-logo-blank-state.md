# Prevent Visual Craft Hover Logo Blank State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep every Visual Craft hover logo loaded so logo and description changes never pass through a blank image state.

**Architecture:** Preserve the existing layered hover renderer and its opacity timing. Change only the image-source assignment so every mounted layer has a stable source, and protect that contract with a focused Node source-level regression test.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node.js built-in test runner

## Global Constraints

- Preserve the active-layer opacity, timing, layout, metadata, and image assets.
- Do not add preload state, load handlers, placeholders, or another logo transition.
- Apply the fix uniformly to every Visual Craft case study.
- Leave the larger description and previously restored card captions unchanged.

---

### Task 1: Keep hover logos loaded across project transitions

**Files:**
- Create: `tests/visual-craft-hover-logos.test.mjs`
- Modify: `components/Work.tsx:679-683`

**Interfaces:**
- Consumes: `Card.logo?: string` and `Card.thumb?: string`
- Produces: a stable `img.src` for every mounted `.workHoverDescLayer`

- [x] **Step 1: Write the failing regression test**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every Visual Craft hover layer keeps its logo source loaded", async () => {
  const source = await readFile(
    new URL("../components/Work.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /src=\{c\.logo \|\| c\.thumb\}/);
  assert.doesNotMatch(
    source,
    /src=\{i === activeIdx \? c\.logo \|\| c\.thumb : undefined\}/,
  );
});
```

- [x] **Step 2: Run the focused test and verify the expected failure**

Run: `node --test tests/visual-craft-hover-logos.test.mjs`

Expected: FAIL because the current image source is gated by `i === activeIdx`.

- [x] **Step 3: Restore a stable source on every mounted logo image**

In `components/Work.tsx`, change only the hover-logo image source:

```tsx
<img
  src={c.logo || c.thumb}
  alt=""
  decoding="async"
/>
```

- [x] **Step 4: Run focused regression tests**

Run: `node --test tests/visual-craft-hover-logos.test.mjs tests/visual-craft-hover-captions.test.mjs`

Expected: two passing tests and zero failures.

- [x] **Step 5: Verify the production build and rendered logo sources**

Run: `npm run build`

Expected: exit code 0 and a successful Next.js production build.

Run:

```bash
node -e 'const response = await fetch("http://localhost:3001/"); const html = await response.text(); const logos = ["toolbox", "warpbnb", "pathai", "bigbasket", "walkity", "rolipoli"]; const missing = logos.filter((name) => !html.includes(`/logos/${name}.png`)); console.log(`HTTP ${response.status}`); console.log(`Missing logos: ${missing.join(", ") || "none"}`); if (!response.ok || missing.length) process.exit(1)'
```

Expected: `HTTP 200` and `Missing logos: none`.

- [x] **Step 6: Commit the implementation**

```bash
git add -- components/Work.tsx tests/visual-craft-hover-logos.test.mjs docs/superpowers/plans/2026-08-20-prevent-hover-logo-blank-state.md
git commit -m "Prevent Visual Craft hover logo flicker"
```
