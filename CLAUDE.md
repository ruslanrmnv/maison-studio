# MAISON Studio — Design & Code Rules

Portfolio demo site for a fictional beauty salon. Second piece in the portfolio — it must NOT look like a re-skinned version of the dental site (dark grotesk editorial), and it must NOT look AI-generated. Reference screenshots: `reference/beauty-ref-1.png` … `beauty-ref-5.png` (Essense template style — study them BEFORE writing any CSS). Quality bar: a site people would pay for.

## 1. Hard bans — signs of "AI template" style (never do these)

- NO fonts: Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, Raleway, Playfair Display.
- NO pink/rose-gold gradients, no glassmorphism, no gradient blobs, no ✨.
- NO emoji as icons. Inline SVG only, one consistent set, 1.5px stroke.
- NO 3-column feature-card grids with icon + title + paragraph.
- NO box-shadows for depth. Depth = photography, hairlines, scale contrast, the dark section.
- NO stock 3D or flat illustrations. Real photography only (Unsplash: salon, hair, hands, texture).
- NO copy clichés: "Indulge", "Pamper yourself", "Unleash/Elevate/Transform", "Where beauty meets...".

## 2. Art direction (from the reference)

Warm cream editorial with one heavy dark break — a printed fashion-magazine feel:

- **Base:** warm cream `#EFE9E0`. **Dark break:** warm near-black `#171412` (brown-black, NOT blue-black) for the services section and footer. Cream dominates; dark is the middle act.
- **Text:** warm ink `#1E1A16` on cream, `#EDE7DC` on dark. Secondary ~55% opacity.
- **Accent:** burnt terracotta `#B4593A`, used rarely (links, focus, small details).
- **Photography:** warm-toned, slightly desaturated. Photos sit in LARGE ROUNDED rectangles (radius 16–24px) — radius is allowed on media only; UI elements stay radius 0 or pill. One full-width hero image under the headline, edge-to-edge with side margins.
- Subtle film grain overlay on the dark section is allowed (CSS, cheap) — it kills the "flat template" look.

## 3. Typography — the signature device

Mixed-type headlines, exactly like the reference: one line in high-contrast SERIF ITALIC, the next in heavy UPPERCASE SANS. Example: *"Good hair,"* (serif italic) / "NO GUESSWORK." (heavy sans).

- **Serif (display accents only):** "Zodiak" from Fontshare or "Bodoni Moda" from Google Fonts — italic, 400–500.
- **Sans (everything else):** "General Sans" from Fontshare — 600/700 uppercase for headline parts, 400 for body.
- Headline scale `clamp(2.8rem, 7.5vw, 6.5rem)`. Italic serif words may also appear inside section titles ("OUR *SERVICES*", "SEE THE *RESULTS*").
- **Labels:** tiny `• About us` dot-labels, 11px, 0.15em tracking. Under the hero, a row of service links carrying their real duration ("BALAYAGE 165 min"). NOT curly-brace `{Balayage}` micro-tags — braces are code syntax used as decoration and read as AI-template; the duration is the salon's actual argument.
- **Body:** 16px, line-height 1.7, max-width 58ch.

## 4. Layout (section by section, from the reference)

1. **Hero (cream):** two-line mixed-type headline, left-aligned with the second line indented right; full-width rounded photo below; a row of `{service}` micro-tags under the photo.
2. **About (cream):** centered quote-style paragraph with 4 small rounded images floating at the corners around it; 2–3 pill "sticker" badges (one rotated a few degrees, dark pill) — "12 YEARS", "3 CHAIRS, NO WAITING".
3. **Services (dark):** huge ghost-type list — numbers `(01)`–`(05)`, uppercase titles in low-contrast warm gray that brighten on hover, small rounded photo appears next to the hovered row, arrow icon right. Price + duration on each row (e.g. "90 min — from $140"). This is the menu, not cards.
4. **Results (dark→cream):** before/after slider — TWO images in a rounded frame with a draggable vertical divider (vanilla JS, pointer events). For a salon: hair color/style before-after. This is the page's interactive signature — build it well: keyboard accessible (arrow keys), touch-friendly.
5. **Testimonials (cream):** one quote at a time, prev/next dots, and a plain circular portrait of whoever is speaking. NO rotating circular text badge — it is the single clearest "Framer/Webflow template" tell, none of the leading salons audited use one, and "TRUSTED — BY CLIENTS" is exactly the puffery §6 bans. Aggregate rating stays a quiet one-line fact, never a big-number stat block.
6. **CTA (cream):** centered mixed-type headline "TAKE THE *FIRST STEP*..." style, one pill button.
7. **Footer (dark):** link columns with `( Pages )` bracket labels, contact large, then the oversized wordmark "MAISON." cropped at the bottom edge.
8. **Marquee:** one horizontal auto-scrolling photo strip between sections (CSS animation, pausable, respects reduced-motion).

Container 1200px; section padding 120–160px desktop; hairlines `1px rgba(30,26,22,.15)`. Mobile-first, 375/768/1024/1440, no horizontal scroll (marquee excepted, overflow hidden).

## 5. Motion (required — this is what makes it feel expensive)

GSAP + ScrollTrigger from CDN. Vanilla JS, no build step. Reuse dental-demo patterns where they fit.

- Smooth scroll: Lenis from CDN (lerp ~0.075 — soft edge of the editorial range) — wheel glides, touch stays native, in-page anchors ride the same easing (with focus moved to the target). Grounded in real beauty businesses (Ceremonia runs Lenis; Hershesons uses Locomotive-style scroll). Progressive enhancement: CDN failure or reduced-motion = plain native scroll. Do NOT remove.
- Scroll reveals, three voices per section: section titles wipe up out of a clip mask (`inset(0 0 100% 0)`→0 + small y); photos uncover bottom-to-top (clip wipe + settle from scale 1.06); everything else fades + rises (40px), 60ms stagger, at 20% viewport, once. Base CSS state is fully visible — clip masks exist only as `gsap.from` values.
- Scroll depth (scrub, transform-only): hero photo trails at ~6%; about floats drift at three speeds (desktop only, via `gsap.matchMedia` — create these BEFORE the reveal tweens or its revert snapshots the wipe's from-state); footer wordmark rises into its bottom crop.
- Hero: masked line reveal for both headline lines (translateY 100%→0, stagger 100ms, power3.out); hero photo settles 1.06→1; micro-tags fade in one by one after.
- Services list: rows reveal with stagger; on hover the ghost text brightens 250ms and the thumbnail scales in from 0.9.
- Before/after divider: drag with pointer events, subtle inertia; the handle scales 1.1 while dragging.
- Marquee: constant slow scroll, duplicated track for the loop.
- Rules: transform/opacity only; micro-interactions 150–400ms; exits faster than entrances; ALL of it disabled under `prefers-reduced-motion` (marquee and badge stop, content static and visible); `gsap.from` only so JS failure leaves content visible.

## 6. Copy rules (humanizer — the text must not read AI-written)

- Concrete over abstract: durations, prices, counts ("90 minutes, silence optional" — not "a luxurious experience").
- Ban the puffery list in §1 plus: "seamless", "journey", "vibrant", "nestled", "boasts".
- No fake-depth "-ing" endings ("...ensuring a radiant glow", "...reflecting our commitment"). Cut them.
- No "not just X, but Y" constructions. No rule-of-three everywhere (two items or four beat three).
- Vary sentence length; short sentences are allowed to stand alone. Like this.
- The salon's angle: respects your time — exact durations, exact prices, no upsell in the chair, "tell us if you don't want small talk". Every line should sound like a specific owner wrote it, not a brand.
- Testimonials: write 3 believable ones — specific details (what was done, how long it took), no superlatives.

## 7. Quality checklist (before "done")

- Contrast ≥4.5:1 body text (terracotta on cream fails at small sizes — large text/graphics only).
- Ghost-type services list: resting state may be low-contrast (decorative), but each row must be a real link with accessible name + visible focus state.
- Before/after slider: works with keyboard (arrows), `role="slider"` + aria attributes, touch targets ≥44px.
- Visible labels on form fields, semantic input types, one h1, sequential headings, alt text everywhere, lazy-load below fold, width/height set (zero CLS).
- Test 375px and 1440px. No horizontal scroll.
- Final pass against https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

## 8. Stack & workflow

- Plain HTML + CSS + vanilla JS: `index.html`, `styles.css`, `main.js`. GSAP CDN only.
- CSS custom properties at `:root`, no raw hex in rules.
- Copy in English. Footer note: "Fictional salon — a portfolio piece."
- Build one section → show → continue. Time budget for the whole page: half a day.
