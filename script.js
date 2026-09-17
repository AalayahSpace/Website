(function () {
  "use strict";

  // Flip to true once partner agreements are signed and real logos are in place.
  var SHOW_PARTNERS = false;

  if (SHOW_PARTNERS) {
    document.querySelectorAll("[data-partners-section], [data-partners-footer]").forEach(function (el) {
      el.hidden = false;
    });
  }

  // Scroll reveal — light fade/slide-in for elements marked [data-reveal].
  // Never hides content already in view, and always resolves visible even if
  // IntersectionObserver or requestAnimationFrame timing goes wrong.
  function initScrollReveal() {
    var show = function (el) {
      el.classList.remove("is-hidden");
    };
    var showAll = function () {
      document.querySelectorAll("[data-reveal]").forEach(show);
    };

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return showAll();
    }
    if (!("IntersectionObserver" in window)) {
      return showAll();
    }

    var hidden = new Set();
    var reveal = function (el) {
      show(el);
      hidden.delete(el);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });

    var sweep = function () {
      hidden.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.98) reveal(el);
      });
    };

    var scan = function () {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        if (hidden.has(el) || el.dataset.revealSeen) return;
        el.dataset.revealSeen = "1";
        if (el.getBoundingClientRect().top < window.innerHeight * 0.98) return; // already in view: never hide
        el.classList.add("is-hidden");
        hidden.add(el);
        io.observe(el);
      });
    };

    requestAnimationFrame(function () {
      requestAnimationFrame(scan);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sweep);
    window.addEventListener("load", sweep);
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);

    // Safety net: nothing should stay invisible for long.
    setTimeout(showAll, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollReveal);
  } else {
    initScrollReveal();
  }
})();
