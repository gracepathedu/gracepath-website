(function () {
  "use strict";

  // Hero video: only autoplay if the visitor hasn't asked for reduced motion.
  // Otherwise the poster image (a still frame of the same footage) is shown instead.
  var heroVideo = document.getElementById("hero-video");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroVideo && !prefersReducedMotion) {
    heroVideo.setAttribute("autoplay", "");
    heroVideo.play().catch(function () {
      // Autoplay blocked by the browser; poster image remains visible.
    });
  }

  // Gallery videos: only play the ones currently in view, and only if the
  // visitor hasn't asked for reduced motion (poster image shows otherwise).
  var galleryVideos = document.querySelectorAll(".gallery-item video");

  if (galleryVideos.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var galleryObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    galleryVideos.forEach(function (video) {
      galleryObserver.observe(video);
    });
  }

  // Mobile nav toggle
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Enquiry form: validates, then submits to Formspree (or whatever URL
  // is set as the form's `action`) via fetch so we can show an inline
  // confirmation instead of redirecting the visitor away.
  var form = document.getElementById("enquiry-form");
  var success = document.getElementById("form-success");
  var error = document.getElementById("form-error");

  if (form && success && error) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      error.classList.remove("visible");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            success.classList.add("visible");
            form.reset();
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            error.classList.add("visible");
            error.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        })
        .catch(function () {
          error.classList.add("visible");
          error.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });
  }
})();
