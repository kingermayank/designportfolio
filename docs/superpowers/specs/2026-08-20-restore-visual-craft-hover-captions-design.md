# Restore Visual Craft Hover Captions

## Goal

Restore the right-side text in every Visual Craft thumbnail's revealed hover strip to the wording used before commit `b69e100`.

## Scope

- In the Visual Craft project-card mapping, source the right-side hover text from each case study's existing `tagline`.
- Keep the company/project name on the left unchanged.
- Keep the hover animation, layout, typography, media, ordering, and larger sidebar hover summary unchanged.
- Apply the restoration to every case study included in the Visual Craft grid.

## Implementation

Update the shared `PROJECTS` mapping in `components/Work.tsx` so `Card.tagline` uses `s.tagline` instead of `s.workCaption ?? s.tagline`. No case-study copy is duplicated or rewritten.

## Verification

- Add a focused source-level regression check that fails while the newer `workCaption` mapping is active and passes after the restoration.
- Run lint and a production build.
- Verify the local homepage responds successfully and the rendered Visual Craft cards expose their original taglines in the hover caption strip.

