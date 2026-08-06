# MAISON Studio

A landing page for a fictional hair salon. Portfolio piece — built to look like a
paying client's site, not a template.

**Live:** https://mmaison-studio.netlify.app

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
- **A menu that behaves** — full-screen overlay on the site's dark break, with
  `inert` doing the focus trapping, Escape and outside state handled, and the
  scroll held still underneath. The header is fixed and reveals on scroll-up so
  the menu and the booking pill are reachable from anywhere on the page.
- **Motion that fails safe** — Lenis smooth scroll plus GSAP scroll choreography:
  masked title reveals, bottom-to-top photo wipes, and three scrub-driven
  parallax layers (hero photo, about cluster, footer wordmark). Everything is
  built with `gsap.from` and a visible resting state, so if a CDN or JS fails
  the content simply sits there un-animated. All of it respects
  `prefers-reduced-motion`, and touch scrolling stays native.

## Researched against real salons, not templates

The second pass was built by auditing five working salon sites — Hershesons,
Larry King, Blue Tit London, Josh Wood Colour and Dear Sundays — and taking the
patterns all of them share:

- **Booking is the product, not a contact link.** Every site audited keeps a
  booking CTA permanently in reach. Ours had been hidden below 560 px, leaving
  phones with no way to book above the fold. It is now visible at every width,
  backed by a sticky mobile bar that retreats once the form is on screen, and the
  `mailto:` was replaced with a real, labelled, keyboard-accessible form.
- **Price follows the stylist.** Blue Tit prices across five stylist levels; Josh
  Wood grades its team by title. Scaled to a three-chair salon: three named
  stylists, each with a level and a stated difference from the list price.
- **Salons publish their rules.** Allergy tests, cancellation windows and deposits
  are standard on real sites and absent from templates — so the booking form sits
  beside a "Before you book" column covering all four.
- **Social proof carries a source.** An aggregate rating sits with the reviews.

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
