/* MAISON Studio — motion
   Initial states come from gsap.from, so if the CDN or JS fails
   the content stays visible and static. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Lenis smooth scroll — the wheel gets a short lerp so the page glides
   instead of stepping. Touch stays native (Lenis default), reduced-motion
   skips it entirely, and a failed CDN just means normal scrolling. */
let lenis = null;
if (window.Lenis && !reduceMotion) {
  // lerp 0.075: each frame closes 7.5% of the remaining distance — the page
  // keeps gliding for a beat after the wheel stops. Lower reads as "floaty",
  // higher as "stiff"; this sits at the soft edge of the editorial range.
  lenis = new Lenis({ lerp: 0.075 });
  // CSS scroll-behavior would double-ease every anchor jump under Lenis
  document.documentElement.style.scrollBehavior = "auto";

  if (window.gsap) {
    // one clock: Lenis rides GSAP's ticker so scrub tweens never drift a frame
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // in-page anchors ride the same easing; focus moves with the scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute("href");
    if (id.length < 2) return; // "#" placeholders (social links)
    link.addEventListener("click", (event) => {
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", id);
      lenis.scrollTo(target, {
        onComplete: () => {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
    });
  });
}

if (window.gsap && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on("scroll", ScrollTrigger.update);

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

  // The about photo cluster drifts at three speeds — desktop only, where the
  // floats are absolutely positioned and free air absorbs the movement.
  // Created BEFORE the reveal timelines: matchMedia's revert restores the
  // inline styles it saw at creation, and the wipe's from-state (scale 1.06)
  // must not be part of that snapshot.
  gsap.matchMedia().add("(min-width: 900px)", () => {
    [[".about__float--a", -28], [".about__float--b", 22], [".about__float--c", -16]]
      .forEach(([float, drift]) => {
        gsap.to(float, {
          y: drift,
          ease: "none",
          scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
  });

  // Scroll reveals: one timeline per group, three voices —
  //   [data-reveal-mask]  titles wipe up out of their own baseline
  //   [data-reveal-wipe]  photos uncover bottom-to-top while settling from a slight zoom
  //   [data-reveal]       everything else rises in, staggered
  gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
    const masks = group.querySelectorAll("[data-reveal-mask]");
    const wipes = group.querySelectorAll("[data-reveal-wipe]");
    const rest = group.querySelectorAll("[data-reveal]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: group, start: "top 80%", once: true },
    });

    if (masks.length) {
      tl.from(masks, {
        y: "0.85em",
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
      }, 0);
    }
    if (wipes.length) {
      tl.from(wipes, {
        clipPath: "inset(100% 0% 0% 0%)",
        scale: 1.06,
        duration: 1.05,
        ease: "power2.out",
        stagger: 0.12,
      }, 0.1);
    }
    if (rest.length) {
      tl.from(rest, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
      }, masks.length ? 0.12 : 0);
    }
  });

  // Scroll depth — three scrub-driven drifts, transform-only.
  // The hero photo trails the scroll a touch, so the page reads as layered.
  gsap.to(".hero__media", {
    yPercent: 6,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // The cropped footer wordmark rises into its crop as the page bottoms out
  gsap.from(".site-footer__wordmark", {
    yPercent: 45,
    ease: "none",
    scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: true },
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

/* Booking form — the site is static, so the submit is answered inline instead of
   posted. Validation leans on the browser's constraint API, but the message is
   rendered into a live region so screen readers get it too. */
document.querySelectorAll("[data-book-form]").forEach((form) => {
  const status = form.querySelector("[data-book-status]");
  if (!status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalid = form.querySelector(":invalid");
    if (invalid) {
      status.classList.add("is-error");
      status.textContent =
        "We need a name and an email that works — the rest we can sort in the reply.";
      invalid.focus();
      return;
    }

    const name = (form.elements.name.value || "").trim().split(/\s+/)[0];
    const service = form.elements.service.value;
    const stylist = form.elements.stylist.value;
    const who =
      stylist === "No preference" ? "the first free chair" : stylist.split("—")[0].trim();

    status.classList.remove("is-error");
    status.textContent =
      (name ? "Thanks, " + name + " — " : "Thanks — ") +
      "that's " + service.split("—")[0].trim().toLowerCase() + " with " + who +
      ". Nothing was actually sent: this is a portfolio demo. The real thing replies with a time and the exact price.";
    form.reset();
  });
});

/* Sticky booking bar (small screens): appears once the hero has scrolled away and
   retreats as soon as the booking section is reached, so it never sits on top of
   the form or the footer. */
(() => {
  const bar = document.querySelector("[data-bookbar]");
  const book = document.getElementById("book");
  const hero = document.querySelector(".hero");
  if (!bar || !book || !hero) return;

  bar.hidden = false;
  let queued = false;

  const update = () => {
    queued = false;
    const heroGone = hero.getBoundingClientRect().bottom < 0;
    const bookInReach = book.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle("is-visible", heroGone && !bookInReach);
  };

  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();

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
