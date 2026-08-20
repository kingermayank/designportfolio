# Restore Visual Craft Hover Captions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore every Visual Craft thumbnail's right-side hover caption to its original case-study tagline.

**Architecture:** Keep the existing card and hover-caption rendering unchanged. Adjust only the shared `PROJECTS` data mapping so every Visual Craft `Card.tagline` consumes `CaseStudy.tagline`, and protect that mapping with a focused Node source-level regression test.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node.js built-in test runner

## Global Constraints

- Keep the company/project name on the left unchanged.
- Keep the hover animation, layout, typography, media, ordering, and larger sidebar hover summary unchanged.
- Apply the restoration to every case study included in the Visual Craft grid.
- Do not duplicate or rewrite case-study copy.

---

### Task 1: Restore the shared Visual Craft caption source

**Files:**
- Create: `tests/visual-craft-hover-captions.test.mjs`
- Modify: `components/Work.tsx:221`

**Interfaces:**
- Consumes: `CaseStudy.tagline: string` from `lib/caseStudies.ts`
- Produces: `Card.tagline: string` consumed by `<OverflowTicker text={card.tagline} />`

- [x] **Step 1: Write the failing regression test**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Visual Craft hover captions use the original case-study tagline", async () => {
  const source = await readFile(new URL("../components/Work.tsx", import.meta.url), "utf8");

  assert.match(source, /tagline:\s*s\.tagline,/);
  assert.doesNotMatch(source, /tagline:\s*s\.workCaption\s*\?\?\s*s\.tagline,/);
});
```

- [x] **Step 2: Run the focused test and verify the expected failure**

Run: `node --test tests/visual-craft-hover-captions.test.mjs`

Expected: FAIL because `components/Work.tsx` still contains `tagline: s.workCaption ?? s.tagline`.

- [x] **Step 3: Restore the original shared mapping**

In `components/Work.tsx`, change only the `tagline` property in `PROJECTS`:

```ts
tagline: s.tagline,
```

Keep the adjacent sidebar mapping unchanged:

```ts
description: s.workSummary ?? s.description,
```

- [x] **Step 4: Run the focused regression test**

Run: `node --test tests/visual-craft-hover-captions.test.mjs`

Expected: one passing test and zero failures.

- [x] **Step 5: Run repository verification**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

Run: `npm run build`

Expected: exit code 0 and a successful Next.js production build.

Run: `curl --fail --silent --show-error --max-time 15 --output /dev/null --write-out 'HTTP %{http_code}\n' http://localhost:3001/`

Expected: `HTTP 200` from the local development server.

Execution note: the focused test, production build, and HTTP/content checks
passed. Repository-wide lint remains blocked by 18 pre-existing React hook
errors outside this caption mapping.

- [x] **Step 6: Commit the implementation**

```bash
git add components/Work.tsx tests/visual-craft-hover-captions.test.mjs docs/superpowers/plans/2026-08-20-restore-visual-craft-hover-captions.md
git commit -m "Restore Visual Craft hover captions"
```
