(function () {

  "use strict";

  const TARGET_DATE = "2026-09-13T21:00:00+03:00";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* =====================================================
     ENVELOPE OPENING
  ===================================================== */

  function initOpening() {

    const opening = document.getElementById("opening");
    const envelope = document.getElementById("envelope");
    const hint = document.getElementById("openingHint");

    if (!opening || !envelope) {
      console.error("Opening or envelope not found");
      return;
    }

    document.body.style.overflow = "hidden";

    let opened = false;

    function openEnvelope() {

      if (opened) return;

      opened = true;

      envelope.classList.add("is-opening");
      opening.classList.add("is-opening");

      if (hint) {
        hint.style.opacity = "0";
      }

      setTimeout(function () {

        opening.classList.add("is-open");

        document.body.style.overflow = "";

      }, 2000);
    }

    envelope.addEventListener("click", openEnvelope);

  }


  /* =====================================================
     REVEAL ON SCROLL
  ===================================================== */

  function initReveal() {

    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {

      elements.forEach(function (element) {
        element.classList.add("visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });

  }


  /* =====================================================
     COUNTDOWN
  ===================================================== */

  function initCountdown() {

    const days = document.getElementById("cd-days");
    const hours = document.getElementById("cd-hours");
    const minutes = document.getElementById("cd-minutes");
    const seconds = document.getElementById("cd-seconds");

    if (!days || !hours || !minutes || !seconds) {
      return;
    }

    const target = new Date(TARGET_DATE).getTime();

    function pad(number) {
      return String(number).padStart(2, "0");
    }

    function updateCountdown() {

      const difference = target - Date.now();

      if (difference <= 0) {

        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        return;
      }

      const totalSeconds =
        Math.floor(difference / 1000);

      const d =
        Math.floor(totalSeconds / 86400);

      const h =
        Math.floor(
          (totalSeconds % 86400) / 3600
        );

      const m =
        Math.floor(
          (totalSeconds % 3600) / 60
        );

      const s =
        totalSeconds % 60;

      days.textContent = pad(d);
      hours.textContent = pad(h);
      minutes.textContent = pad(m);
      seconds.textContent = pad(s);

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

  }


  /* =====================================================
     FLOATING PETALS
  ===================================================== */

  function initPetals() {

    const field =
      document.getElementById("petalsField");

    if (!field || prefersReducedMotion) return;

    const amount =
      window.innerWidth < 600 ? 8 : 15;

    for (let i = 0; i < amount; i++) {

      const petal =
        document.createElement("div");

      petal.className = "petal";

      petal.style.left =
        Math.random() * 100 + "vw";

      petal.style.animationDuration =
        (12 + Math.random() * 12) + "s";

      petal.style.animationDelay =
        "-" + (Math.random() * 15) + "s";

      petal.style.opacity =
        0.25 + Math.random() * 0.45;

      petal.style.transform =
        `scale(${0.6 + Math.random() * 0.8})`;

      field.appendChild(petal);

    }

  }


  /* =====================================================
     MUSIC
  ===================================================== */

  function initMusic() {

    const audio =
      document.getElementById("bgMusic");

    const button =
      document.getElementById("musicToggle");

    if (!audio || !button) return;

    audio.volume = 0.30;

    function setState(playing) {

      button.classList.toggle(
        "is-playing",
        playing
      );

      button.setAttribute(
        "aria-label",
        playing
          ? "Pause music"
          : "Play music"
      );

    }

    function playMusic() {

      audio.play()
        .then(function () {
          setState(true);
        })
        .catch(function () {
          setState(false);
        });

    }

    // Try autoplay
    playMusic();

    // Play after first interaction
    function firstInteraction() {

      if (audio.paused) {
        playMusic();
      }

      document.removeEventListener(
        "click",
        firstInteraction
      );

      document.removeEventListener(
        "touchstart",
        firstInteraction
      );

    }

    document.addEventListener(
      "click",
      firstInteraction,
      { passive: true }
    );

    document.addEventListener(
      "touchstart",
      firstInteraction,
      { passive: true }
    );

    // Music button
    button.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();

        if (audio.paused) {

          playMusic();

        } else {

          audio.pause();

          setState(false);

        }

      }
    );

    audio.addEventListener(
      "pause",
      function () {
        setState(false);
      }
    );

    audio.addEventListener(
      "play",
      function () {
        setState(true);
      }
    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  function initPage() {

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

  }


  /* =====================================================
     INIT
  ===================================================== */

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      initPage();

      initOpening();

      initReveal();

      initCountdown();

      initPetals();

      initMusic();

    }
  );

})();
