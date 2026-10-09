# Visual Craft transition review — October 8, 2026

## Release validation

The scoped release was validated on top of the latest main in an isolated
checkout. The production build, TypeScript, and transition lint pass. Local browser access was denied earlier in
this session, so no per-project click-through, frame-rate measurement, or device
test is claimed here. Source review cannot certify the absence of pixel shifts.

## Scope

Reviewed the shared transition controller, its CSS layers, routing integration,
thumbnail capture, scroll restoration, and case-study cover styling.

| Project | Source path reviewed | Live entry / return |
| --- | --- | --- |
| Toolbox | Shared controller; video thumbnail | Not verified |
| WarpBnB | Shared controller; hover-loaded video thumbnail | Not verified |
| PathAI | Shared controller; responsive still thumbnail | Not verified |
| Walkity | Shared controller; responsive still thumbnail | Not verified |
| Bigbasket | Shared controller; responsive still thumbnail | Not verified |
| Rolipoli | External YouTube link; intentionally bypasses case-study transition | Not verified |

## Design and motion

Production polish is the primary criterion (Jakub); expressive portfolio motion
is secondary (Jhey). Frequent-use speed is a constraint, but the requested
Metalab-like choreography, sped up to 1.25 seconds at the user’s request, is intentional, not automatically a defect.

- Opening and return sample the same timeline in opposite directions.
- Media and page content share the rounded inner mask. A separate solid
  background supplies the outer padding, avoiding homepage bleed-through.
- Cover endpoints use 8px padding and 16px corners from the rendered cover.
- Homepage copy is covered by the moving mask rather than separately faded.
- Reduced-motion users bypass the large project transition.
- Missing source pixels or unavailable destination media fall back to navigation.

Remaining visual questions: the handoff from a saved video frame to live media,
pointer/keyboard hover at the return endpoint, Back from a scrolled case study,
partially visible cards, and browser chrome changes on mobile. These require
observation; they are not marked passed by the source review.

## Fixes made during this final review

1. Measure the actual cover geometry instead of assuming `innerHeight` matches
   its CSS `svh` height. Account for the case-study scroller offset.
2. Capture video pixels only for videos intersecting the viewport. Preserve
   posters for unloaded/offscreen videos, with a 1920px cap on captured frames.
3. Pause original videos while a frozen page is shown; resume connected videos
   on cleanup. This avoids playing invisible media beneath a snapshot.
4. Remove inherited `will-change` hints from frozen descendants and narrow the
   transition's layer hints to properties that actually animate.
5. Refresh the saved homepage scroll position when browser Forward starts a new
   entry from the restored grid.
6. Add a 10-second cancellation watchdog so a suspended animation cannot leave
   the page permanently inert. Existing cleanup removes layers and restores
   clipping, visibility, media playback, and interaction state.

## Code quality and remaining debt

The implementation is centralized, adds no dependency, and shares one geometry
path between entry and return. It still has meaningful technical debt:

- `freezePage` clones a complete page and reads computed styles for descendants.
  That is work on the click path, proportional to page size. Visible-video-only
  capture reduces raster work, but a trace is needed to quantify total cost.
- DOM snapshots are coupled to CSS selectors, hover styles, and element types.
  Canvas pixels and local SVG references are now preserved, but embedded iframe
  content and other interactive rendering surfaces still need explicit support.
- Full-screen animated clipping and multiple composited layers need measurement
  on mobile Safari and a slower device. `will-change` is not proof of 60fps.
- Existing tests mainly assert source/CSS structure. The eight added geometry
  tests execute the actual interpolation functions. Neither group exercises this
  controller's actual browser history, media readiness, cancellation, or paint.
  Browser regression coverage is the most valuable next addition.
- Direct case-study loads and next-project links use the generic transition,
  because they have no originating homepage thumbnail. That fallback is intentional.

## Checks executed

| Check | Result |
| --- | --- |
| `npm run build` | Passed; all 29 pages generated |
| `npx tsc --noEmit` | Passed |
| ESLint: controller, PageTransition, layout, instrumentation | Passed |
| ESLint: Work / CaseStudies | 7 errors, 2 warnings; same counts and rules on HEAD |
| `git diff --check` | Passed |
| Node tests after follow-up fixes | 52 passed, 10 failed out of 62 |
| New geometry tests | All 8 passed |
| Same tests against HEAD source in a temporary directory | Same 10 failures |

The baseline test run used HEAD source files and current public assets. Existing
failures concern tool-logo sizing, Apex copy, caption behavior, About status
logos, engineering CTA styling, WarpBnB process assets, SEO title expectations,
mobile body type, and inactive lens colors. They were not silently rewritten to
make the transition review green.

## Remaining release gate

On desktop and mobile, open and return from each of the five internal projects
at several grid scroll positions. Include pointer Back, browser Back/Forward,
keyboard activation, reduced motion, slow media, rapid repeated navigation,
resize, and returning from deep within a case study. Confirm no shifting target,
blank sibling thumbnail, square-corner flash, gutter bleed, focus jump, or stuck
overlay. Record a performance trace on a slower device.

The release scope includes only transition code, cover styles, regression tests,
the audit report, and the local analytics initialization fix. Unrelated workspace
changes are excluded. The existing main press-release button update is preserved.

## Follow-up fixes

- Extracted pure geometry calculations into `lib/projectTransitionGeometry.ts`.
  Tests cover exact endpoints, reverse sampling, easing symmetry, monotonic
  downward travel, rounded corners, and coverage of the opaque backing layer.
- Preserve negative clip insets for partly offscreen cards; clamping them moved
  the rounded edge onto the viewport boundary and could create a visible jump.
- Copy canvas pixels into page snapshots and remap SVG IDs with their local
  references instead of removing IDs and breaking gradients or clip paths.
- Clear the restored-grid marker on section changes so subsequent entrances
  are not permanently suppressed.
- Re-ran the production build, transition/geometry/test lint, and regression
  suite. Build and focused lint pass; the same 10 baseline tests still fail.

These checks do not replace the outstanding browser visual/performance pass.

## Release checkout checks

- Based on `c4e5c88` (latest main when prepared).
- `npm run build -- --webpack`: passed, including TypeScript and all 29 pages.
- Focused ESLint: passed.
- Geometry tests: 8/8 passed; full suite: 52 passed, the same 10 baseline failures.
- No browser visual pass or frame-rate trace is claimed.
