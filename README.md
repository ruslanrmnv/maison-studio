# MAISON Studio

A landing page for a fictional hair salon. Portfolio piece — built to look like a
paying client's site, not a template.

**Live:** _added after deploy_

## The brief

Second site in a portfolio, and the hard rule was that it must not look like the
first (a dark editorial dental site) or like an AI-generated template. Warm-cream
fashion-magazine feel, one heavy dark break, real photography, and copy that reads
like a specific salon owner wrote it — exact durations, exact prices, no upsell.

## What it does

- **One editorial type system** — every headline mixes a serif-italic line with a
  heavy uppercase sans line (Bodoni Moda + General Sans). One device, carried
  through the whole page.
- **Two interactive signatures, hand-built, no libraries:**
  - A before/after slider for colour work — pointer-drag, keyboard-accessible
    (arrow keys, `role="slider"` + ARIA), touch targets ≥44px.
  - A rotating "trusted by clients" ring (SVG `textPath`) with the current
    reviewer's face at its centre.
- **A price-first services menu** on a dark, film-grained break — every row shows
  the exact minutes and price. Terracotta wipe on hover; a persistent terracotta
  cue on touch, where there's no hover to reveal it.
- **Motion that fails safe** — GSAP scroll and load reveals built with `gsap.from`,
  so if the CDN or JS fails the content is still visible. All of it respects
  `prefers-reduced-motion`.

## Results

- **Assets: 86 MB → 1.16 MB (−98.7%).** Source renders were multi-megabyte PNGs;
  converted to right-sized WebP with no visible quality loss.
- **Zero layout shift** — width/height on every image, lazy-loading below the fold.
- **Accessible** — one `h1`, sequential headings, visible focus states, real
  buttons with accessible names, 4.5:1 body contrast, and no horizontal scroll
  from 375 px up.

## Stack

Plain HTML, CSS, and vanilla JS — no build step. GSAP (+ ScrollTrigger) from CDN
for motion. Deployed as a static site on Netlify.

## Notes

Fictional salon; all copy and services are invented for the demo. `reference/`
holds the art-direction screenshots the design was built against.
