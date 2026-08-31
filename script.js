/* =========================================================
   روان & أحمد — Engagement Invitation
   Behavior: curtain intro, reveal-on-scroll, countdown,
   ambient petals, background music control.
   ========================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Opening curtain ---------- */
  function initCurtain() {
    var curtain = document.getElementById("curtain");
    if (!curtain) return;
    var hide = function () {
      curtain.classList.add("is-hidden");
      document.body.style.overflow = "";
    };
    document.body.style.overflow = "hidden";
    var delay = prefersReducedMotion ? 300 : 2200;
    window.setTimeout(hide, delay);
  }

  /* ---------- 2. Reveal-on-scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var extraDelay = parseInt(el.getAttribute("data-delay") || "0", 10);
            window.setTimeout(function () {
              el.classList.add("is-visible");
            }, extraDelay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });

    // stagger the hero elements slightly on first load
    var heroReveals = document.querySelectorAll(".hero .reveal");
    heroReveals.forEach(function (el, i) {
      el.style.transitionDelay = prefersReducedMotion ? "0ms" : (i * 140) + "ms";
    });
  }

  /* ---------- 3. Countdown timer ---------- */
  function initCountdown() {
    var target = new Date("2026-09-13T18:00:00+03:00").getTime();
    var elDays = document.getElementById("cd-days");
    var elHours = document.getElementById("cd-hours");
    var elMinutes = document.getElementById("cd-minutes");
    var elSeconds = document.getElementById("cd-seconds");
    if (!elDays) return;

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var now = Date.now();
      var diff = target - now;

      if (diff <= 0) {
        elDays.textContent = "00";
        elHours.textContent = "00";
        elMinutes.textContent = "00";
        elSeconds.textContent = "00";
        clearInterval(intervalId);
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      elDays.textContent = pad(days);
      elHours.textContent = pad(hours);
      elMinutes.textContent = pad(minutes);
      elSeconds.textContent = pad(seconds);
    }

    tick();
    var intervalId = window.setInterval(tick, 1000);
  }

  /* ---------- 4. Ambient floating petals ---------- */
  function initPetals() {
    var field = document.getElementById("petalsField");
    if (!field) return;

    var count = window.innerWidth < 600 ? 9 : 16;
    if (prefersReducedMotion) count = 0;

    for (var i = 0; i < count; i++) {
      var petal = document.createElement("div");
      petal.className = "petal";
      var left = Math.random() * 100;
      var duration = 14 + Math.random() * 12;
      var delay = Math.random() * 16;
      var scale = 0.6 + Math.random() * 0.9;
      var rotate = Math.random() * 60 - 30;

      petal.style.left = left + "vw";
      petal.style.animationDuration = duration + "s";
      petal.style.animationDelay = "-" + delay + "s";
      petal.style.transform = "scale(" + scale.toFixed(2) + ") rotate(" + rotate + "deg)";
      petal.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);

      field.appendChild(petal);
    }
  }

  /* ---------- 5. Background music control ---------- */
  function initMusic() {
    var audio = document.getElementById("bgMusic");
    var btn = document.getElementById("musicToggle");
    if (!audio || !btn) return;

    audio.volume = 0.35;

    function setPlayingState(isPlaying) {
      btn.classList.toggle("is-playing", isPlaying);
      btn.setAttribute("aria-label", isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى");
    }

    // Try gentle autoplay; if blocked, just show the control for manual start.
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () { setPlayingState(true); })
        .catch(function () { setPlayingState(false); });
    }

    btn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().then(function () { setPlayingState(true); }).catch(function () {});
      } else {
        audio.pause();
        setPlayingState(false);
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initCurtain();
    initReveal();
    initCountdown();
    initPetals();
    initMusic();
  });
})();
