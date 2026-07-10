# Project Context: MAISON Studio (portfolio demo #2)
Updated: 2026-07-09 | Chat topic: build MAISON

## State
- MAISON Studio = fictional hair salon, portfolio piece #2. Angle: "respects your time" — exact durations, exact prices, no upsell. Full design/copy rules live in beauty-demo/CLAUDE.md (Essense-reference warm-cream editorial; mixed serif-italic + heavy-sans headlines; ghost services list; before/after slider as signature).
- Stack: plain HTML/CSS/vanilla JS + GSAP CDN. Files in C:\Users\User\Desktop\beauty-demo: index.html, styles.css, main.js, assets/. Dev server (Vite) runs at http://localhost:4174/ on the user's machine.
- Built AND reviewed to ~8/10: Hero (asymmetric, headline-left + tall photo column right; headline-clip bug FIXED via .hero__title font cap in the ≥900px grid), About (left quote + tilted 3-photo cluster), Services (dark section, ghost list 0.45 opacity, price = brightest resting element, terracotta hover wipe-fill), Results (before/after compare slider — drag + keyboard + aria, brand-tied "165 min · one appointment" copy).
- Custom photography generated in Cowork via Higgsfield MCP (soul_2 model, "General" style, warm editorial film tone) and wired into assets/: hero, 3 About (foils / tools-with-tea / texture), 5 service thumbs. These look good and de-cloned the site from Essense.
- WORKFLOW SPLIT: Claude Code writes/edits the code on the user's machine. Cowork (this chat) = advisor + generates Higgsfield images, hands rawUrl CDN links to Claude Code, which downloads them into assets/. Higgsfield balance ~19 credits, free plan (max 4 concurrent jobs; images ~0.12 credit each).

## Decisions
- Money-first, anti-perfectionism. User keeps re-reviewing sections 1-3 (already 8/10); repeated reminder: stop polishing, finish sections 5-7, then ONE polish pass, then SHIP + case study + outreach.
- Each portfolio project gets its OWN art direction (dental = dark grotesk; salon = warm cream) so portfolio isn't one reskinned template. De-clone from Essense = 3 structural departures (hero asymmetry, about cluster, services fill) + terracotta as signature; type device + copy kept.
- Higgsfield can NOT improve site motion (it makes mp4/images, not GSAP). Site animation stays GSAP in Claude Code. Higgsfield's real value here = unique on-brand photos that kill the "stock/AI-template" read.
- Results before/after GALLERY (3 examples) is BACK ON — user overrode the "single example" decision (2026-07-09). WORKING METHOD found: (1) generate a CLOTHED base "after" portrait with soul_2 (turtleneck / buttoned collar covering shoulders — bare-shoulder portraits get NSFW-blocked by every editor); (2) edit ONLY the hair to a "before" state with nano_banana_pro passing the base job_id as medias[].value role "image" — this keeps face/pose/clothing locked. Do NOT use separate text-to-image pairs or soul_2 image-to-image (both failed earlier). 3 pairs generated, 3:4, warm cream palette. rawUrls (afters + befores) for Claude Code to download into assets/:
  - Pair1 AFTER hf_20260708_205717_323d2bde-....png / BEFORE hf_20260708_205950_10505324-e855-4658-9762-464ade065ff8.png
  - Pair2 AFTER hf_20260708_210251_6fcfd5b4-e147-4b94-ba1c-e8811c1cdf91.png / BEFORE hf_20260708_210733_289d1f10-01a4-4d95-a194-46dd7797ebdf.png
  - Pair3/Balayage AFTER hf_20260708_210252_effe0fbc-5642-48d2-867e-c265dc791d49.png / BEFORE hf_20260708_210735_1473c6f1-a6e3-414a-8cb7-2f6eabf120a4.png
  - Pair4/CUT (real length change, added 2026-07-09) AFTER hf_20260708_215103_df1a28f2-9021-40de-a95e-dd23c9f675d8.png (de-framed) / BEFORE hf_20260708_214607_9a8dd1ac-ce50-4be0-9d54-1719cc1ee477.png
  - CDN base: https://d8j0ntlcm91z4.cloudfront.net/user_3G9On3jRLvir6D68PoU44nIhcpC/
- REVIEW FIXES (8→8.5, 2026-07-09): (a) soul_2 "General" style randomly bakes a FILM BORDER with garbled sprocket text — rule-#1 AI-tell. Some early pairs have it; crop the edge strips so all pairs read as ONE clean full-bleed system. The CUT "after" was already de-framed via nano_banana (df1a28f2). (b) Old "Precision cut" tab was a no-op (after=before) — replaced by Pair4/CUT above. (c) Rest the compare curtain at ~58%, not 50%, so the divider doesn't bisect the face. (d) If a border can't be cleanly cropped, Cowork can de-frame any pair the same nano_banana way — flag it.
- Deferred to final polish pass (do NOT do piecemeal now): commit Services fill to true terracotta (drop photo opacity) + mobile terracotta cue; hero two-column shared-baseline anchor (kill dead cream); About cluster nudge; Results handle brand detail.

## Next steps
1. Claude Code: RESTORE the [data-gallery] switcher in Results with the 3 NEW working pairs (URLs in Decisions above) — download 6 images into assets/, wire buttons to swap the [data-compare] slider's before/after sources. Keep [data-compare] JS/aria. This replaces the earlier "revert to single slider" plan.
2. Build Section 5 — testimonials: 3 believable quotes + rotating SVG textPath badge + a REAL human avatar (biggest remaining lever = page currently has ZERO human faces; copy is warm but imagery is all hair/hands/texture). Cowork will generate single human portraits in Higgsfield (single portraits work well; NOT pairs) when user says "дальше".
3. Sections 6 (CTA) + 7 (footer with oversized MAISON wordmark) + marquee photo strip.
4. ONE final polish pass (the deferred items above). Then SHIP: deploy (GitHub + Netlify like the dental site), write English case study (problem → solution → result), start client outreach.

## Open questions
- Whether Section 5 avatars should be diverse client faces vs one owner/stylist portrait — lean 3 believable client portraits.
- Whether to keep the terracotta handle branding already added to the compare slider (fine to keep).
- Project #1 (BrightSmile Dental) follow-ups still pending from earlier: AI chat (Netlify serverless), lead capture + Slotly booking link, case-study page. Not started.
