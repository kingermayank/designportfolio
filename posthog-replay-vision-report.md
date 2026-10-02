# Replay Vision Setup Report

## Recording status

Session Replay was already enabled on the PostHog project, and your Next.js client init (`instrumentation-client.ts`) has no `disable_session_recording` override, so nothing is blocking capture. **Recordings are flowing now** — no action needed here.

## Scanners created

Three Replay Vision scanners were set up to watch your portfolio (Visual Craft / Product Strategy / Design & Engineering lenses, case-study detail pages, and the interactive labs). All were checked against your existing scanner ("Visual Craft – Case study button discoverability") first — no naming or query collisions.

### 1. Broken case studies (monitor)
- **Watches:** Visitors browsing the home grid, the two lens pages (`/product-strategy`, `/design-engineering`), and any case-study detail page (`/work/...`, `/product-strategy/...`, `/design-engineering/...`) — your site's core "view a case study" flow, including hero/walkthrough videos, the media lightbox, and embedded interactive demos.
- **Query scope:** URL-matched to those page groups, 50% sampling.
- **Model:** gemini-3-flash-preview
- **Status:** Created **disabled** — recommended to preview its findings against real sessions before turning it on.
- **Estimated spend:** Negligible (0 matched sessions in the test window; project has 7,485 of 7,500 monthly credits free).
- **Link:** https://us.posthog.com/project/630673/replay-vision/01a0e691-d54a-79eb-9880-f385c4b69f1d

### 2. Case study & lab rage clicks (monitor)
- **Watches:** Rage-click signals anywhere on the site — lightbox media that won't enlarge, the Copy Email button not confirming, lens tabs not switching, lab controls (search field, lot-age slider) not responding, overlays not dismissing.
- **Query scope:** Gated only on the `$rageclick` event (no URL scope, kept disjoint from the broken-case-studies monitor), 100% sampling.
- **Model:** gemini-3-flash-preview
- **Status:** Created **disabled** — preview first, then enable.
- **Estimated spend:** Negligible (same quota headroom as above).
- **Link:** https://us.posthog.com/project/630673/replay-vision/01a0e690-7a56-75da-8216-ce2dfa948e12

### 3. Portfolio session recaps (summarizer)
- **Watches:** Every session, unscoped — summarizes what a visitor did using your real product vocabulary (case studies, the three work lenses, portfolio items, the showreel, contact-email copy).
- **Query scope:** Unscoped, 10% sampling.
- **Model:** gemini-3-flash-preview
- **Status:** Created **enabled** (summarizers default on).
- **Estimated spend:** ~165 credits/month — a small fraction of the 7,500/month quota.
- **Link:** https://us.posthog.com/project/630673/replay-vision/01a0e690-9abf-744e-ae60-381c868a1c99

## Skipped / deferred

Nothing was skipped — this is a browser-based Next.js app (not backend/mobile-only), so all three scanner types applied. The two monitor scanners were left **disabled by design** so you can review their first observations before they start actively flagging sessions; enable them once you're happy with what they surface.

## Where to look

- All scanners and their observations: **Replay Vision** page in PostHog (project 630673) — https://us.posthog.com/project/630673/replay-vision
- First observations will appear as new recordings complete and get scanned (summarizer runs immediately since it's enabled; the two monitors will start producing observations once you flip them on).
