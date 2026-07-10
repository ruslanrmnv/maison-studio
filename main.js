/* MAISON Studio — motion
   Initial states come from gsap.from, so if the CDN or JS fails
   the content stays visible and static. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.gsap && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  const hero = gsap.timeline({ defaults: { ease: "power3.out" } });

  hero
    // masked line reveal — both headline lines rise into view
    .from(".hero__line-inner", {
      yPercent: 115,
      duration: 0.95,
      stagger: 0.1,
    })
    // hero photo settles from a gentle over-scale
    .from(
      ".hero__photo",
      { scale: 1.06, duration: 1.6, ease: "power2.out" },
      "-=0.7"
    )
    // supporting note rises in just before the tags
    .from(
      ".hero__lead-note",
      { y: 16, opacity: 0, duration: 0.55 },
      "-=1"
    )
    // micro-tags fade in one by one after the photo
    .from(
      ".hero__tag",
      { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
      "-=0.75"
    )
    // booking line settles in at the bottom of the column
    .from(
      ".hero__meta",
      { y: 12, opacity: 0, duration: 0.5 },
      "-=0.45"
    )
    // eyebrow + header settle in at the very start
    .from(
      ".hero__eyebrow",
      { y: 12, opacity: 0, duration: 0.6 },
      0
    )
    .from(
      ".site-header",
      { y: -16, opacity: 0, duration: 0.6 },
      0.1
    );

  // Scroll reveals: each group's [data-reveal] children rise in once, staggered
  gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
    gsap.from(group.querySelectorAll("[data-reveal]"), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: group,
        start: "top 80%",
        once: true,
      },
    });
  });
}

/* Before/after compare — pointer drag + click-to-position + keyboard.
   Runs regardless of GSAP so the signature works even if the CDN fails. */
document.querySelectorAll("[data-compare]").forEach((root) => {
  const handle = root.querySelector(".compare__handle");
  if (!handle) return;
  let pos = parseFloat(root.style.getPropertyValue("--pos")) || 50;
  let dragging = false;

  const set = (next) => {
    pos = Math.max(0, Math.min(100, next));
    const rounded = Math.round(pos);
    root.style.setProperty("--pos", pos + "%");
    handle.setAttribute("aria-valuenow", rounded);
    handle.setAttribute(
      "aria-valuetext",
      rounded + " percent — " +
        (rounded < 50 ? "more before showing"
          : rounded > 50 ? "more after showing"
          : "halfway between before and after")
    );
  };

  const posFromX = (clientX) => {
    const r = root.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };

  root.addEventListener("pointerdown", (e) => {
    dragging = true;
    root.classList.add("is-dragging");
    try { root.setPointerCapture(e.pointerId); } catch (_) {}
    set(posFromX(e.clientX));
    handle.focus({ preventScroll: true });
  });

  root.addEventListener("pointermove", (e) => {
    if (dragging) set(posFromX(e.clientX));
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}
  };
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  handle.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 10 : 2;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown": set(pos - step); break;
      case "ArrowRight":
      case "ArrowUp": set(pos + step); break;
      case "PageDown": set(pos - 10); break;
      case "PageUp": set(pos + 10); break;
      case "Home": set(0); break;
      case "End": set(100); break;
      default: return;
    }
    e.preventDefault();
  });

  // expose the setter so the gallery can recentre the curtain on example switch
  root.__setPos = set;

  set(pos);
});

/* Results gallery — swap which before/after pair the shared comparator shows.
   Reuses the [data-compare] component above; only the images + caption change. */
document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const compare = gallery.querySelector("[data-compare]");
  const buttons = gallery.querySelectorAll("[data-example]");
  if (!compare || !buttons.length) return;

  const beforeImg = compare.querySelector(".compare__img--before");
  const afterImg = compare.querySelector(".compare__img--after");
  const caption = gallery.querySelector(".results__caption");

  const show = (btn) => {
    buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
    afterImg.src = btn.dataset.after;
    afterImg.alt = btn.dataset.afterAlt;
    beforeImg.src = btn.dataset.before;
    beforeImg.alt = btn.dataset.beforeAlt;
    if (caption) caption.textContent = btn.dataset.caption;
    // start each new pair a touch right of centre so the divider doesn't bisect the face
    if (typeof compare.__setPos === "function") compare.__setPos(58);
    else compare.style.setProperty("--pos", "58%");
  };

  buttons.forEach((btn) => btn.addEventListener("click", () => show(btn)));

  // Warm the cache for the other examples once the browser is idle, so a
  // switch never flashes a half-loaded frame — without eager-loading up front.
  const preload = () =>
    buttons.forEach((b) =>
      [b.dataset.before, b.dataset.after].forEach((src) => {
        if (src) new Image().src = src;
      })
    );
  if ("requestIdleCallback" in window) requestIdleCallback(preload);
  else window.addEventListener("load", () => setTimeout(preload, 1000));
});

/* Testimonials — one quote at a time, prev/next + dots.
   Renders all stories in the DOM; JS shows one, so a JS failure leaves
   every quote visible (stacked) rather than an empty section. */
document.querySelectorAll("[data-stories]").forEach((root) => {
  const stories = Array.from(root.querySelectorAll("[data-story]"));
  const dots = Array.from(root.querySelectorAll("[data-dot]"));
  const avatar = root.querySelector("[data-avatar-target]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  if (stories.length < 2) return;

  let i = 0;

  const show = (n) => {
    i = (n + stories.length) % stories.length;

    stories.forEach((story, k) => {
      const active = k === i;
      story.hidden = !active;
      if (active) {
        // brief fade so the swap reads as a change, not a jump-cut
        story.classList.add("is-enter");
        requestAnimationFrame(() =>
          requestAnimationFrame(() => story.classList.remove("is-enter"))
        );
      }
    });

    dots.forEach((dot, k) => {
      if (k === i) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    const active = stories[i];
    if (avatar && active.dataset.avatar) {
      avatar.src = active.dataset.avatar;
      avatar.alt = active.dataset.avatarAlt || "";
    }
  };

  if (prev) prev.addEventListener("click", () => show(i - 1));
  if (next) next.addEventListener("click", () => show(i + 1));
  dots.forEach((dot, k) => dot.addEventListener("click", () => show(k)));

  show(0);
});

/* Marquee — CSS drives the scroll; the button just toggles play state.
   Hover/focus pause is pure CSS, so this keeps working if JS never loads. */
document.querySelectorAll("[data-marquee]").forEach((marquee) => {
  const btn = marquee.querySelector("[data-marquee-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const paused = marquee.classList.toggle("is-paused");
    btn.setAttribute("aria-pressed", String(paused));
    btn.setAttribute("aria-label", paused ? "Play the scrolling photos" : "Pause the scrolling photos");
  });
});
