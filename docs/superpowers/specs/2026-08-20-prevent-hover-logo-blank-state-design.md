# Prevent Visual Craft Hover Logo Blank State

## Goal

Ensure the project logo and description switch together when hovering between Visual Craft case studies, with no blank logo frame.

## Root Cause

Each hover-description layer stays mounted, but inactive logo images currently receive an undefined `src`. When a layer becomes active, its logo source is assigned at the same time its transition begins, leaving a visible gap while the small image loads or decodes.

## Design

- Give every mounted hover-logo image its existing `c.logo || c.thumb` source unconditionally.
- Preserve the existing active-layer opacity, timing, layout, metadata, and image assets.
- Do not introduce preload state, load handlers, placeholders, or an additional logo transition.
- Apply the behavior uniformly to every Visual Craft case study.

The six logo assets total roughly 70 KB, making eager availability simpler and more reliable than coordinating source assignment with hover transitions.

## Verification

- Add a focused regression test that rejects active-index-gated logo sources and requires the unconditional source mapping.
- Run the focused test before and after the fix to demonstrate red-green behavior.
- Run the production build and verify that rapid project switching retains a valid image source in every hover layer.

