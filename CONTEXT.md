# Project Context: MAISON Studio (portfolio demo #2)
Updated: 2026-07-11 | Chat topic: shipped + outreach

## State
- MAISON Studio = fictional hair salon, portfolio piece #2. Angle: "respects your time" — exact durations, exact prices, no upsell. Full design/copy rules in beauty-demo/CLAUDE.md.
- SHIPPED AND LIVE: https://maison-studio-476.netlify.app (Netlify). Stack: plain HTML/CSS/vanilla JS + GSAP CDN. Files in C:\Users\User\Desktop\beauty-demo: index.html, styles.css, main.js, assets/. Deployed via GitHub + Netlify like the dental site.
- All 8 sections built and polished: Hero, About, Services (dark), Results (before/after slider), Testimonials, Marquee, CTA, Footer. Full-page rating ~8.6/10. Ceiling ~9, remaining gap = brief-locked AI-default palette + conventional CTA/footer-top — NOT worth another pass.
- Performance done: images optimized 86MB -> 1.16MB (-98.7%, PNG->WebP/JPEG). Zero-CLS, fail-safe GSAP motion, keyboard-accessible signatures (before/after slider + testimonials).
- Testimonials (Section 5): 3 real Unsplash portraits (NOT Higgsfield — balance was 0), unified by one warm CSS filter, in round avatars centered in a rotating SVG textPath "trust ring". Copy = 3 humanized quotes (Hannah R./balayage, Daniel M./cut, Claire T./colour correction) — verbatim, specific, no superlatives.
- Results section: 3 working before/after tabs (balayage effe0fbc/1473c6f1, colour-correction copper pair 6fcfd5b4/289d1f10, cut df1a28f2/9a8dd1ac). Film borders trimmed, rest point 58% (off-face). Six clean images: assets/results-{balayage,color,cut}-{before,after}.png.

## Decisions
- Money-first, anti-perfectionism. Repeated pattern this project: user re-reviews finished sections; rule enforced = ship the 8.6 live + case study + outreach beats chasing 9.0 in a folder. Site is a MEANS to clients, not the goal.
- Each portfolio project gets its OWN art direction (dental = dark grotesk; salon = warm cream) so portfolio isn't one reskinned template.
- Testimonial avatars: pivoted Higgsfield -> Unsplash after balance hit 0 credits. Reusing the same 3 Results faces was rejected — reads as "salon has only 3 clients" + staged. Unsplash gives real, DIFFERENT faces, free, allowed by CLAUDE.md.
- WORKFLOW SPLIT still holds: Claude Code writes/edits code on the user's machine; Cowork (this chat) = advisor + copy/writing + (when credits exist) Higgsfield images.
- CAVEAT on final quality: entire final polish was rated BLIND — screenshot tool was down, ratings came from geometry+code, About cluster nudge was a blind change. Nobody eyeballed final pixels yet. User was asked to open the live URL on desktop+phone and check hero baseline / About cluster / testimonials quote-mark before sending to any prospect.

## Next steps
1. OUTREACH — the only money move now. First cold email decided: target = local salons, offer/CTA = short 15-min call, channel = email. cold-email skill already read this chat. NEXT ACTION: draft the first cold email (Observation -> Problem -> Proof[link MAISON demo] -> soft ask). Subject 2-4 words lowercase. Lead with their world, "you" over "I", one low-friction CTA.
2. Write English case study for MAISON (problem -> solution -> result) to link/attach in outreach.
3. Build a small prospect list of local salons (name + email) to send against.

## Open questions
- User was mid-check: opening the live site on desktop+phone to confirm the 3 blind-polished spots look right. Waiting on his "looks good" before finalizing outreach.
- Project #1 (BrightSmile Dental) follow-ups still pending: AI chat (Netlify serverless), lead capture + Slotly booking link, case-study page. Not started — dental outreach angle weaker until done.
