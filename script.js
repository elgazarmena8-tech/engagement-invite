/* =========================================================
   AHMED & RAWAN
   ENGAGEMENT INVITATION
========================================================= */

(function () {

  "use strict";


  /* =====================================================
     SETTINGS
  ===================================================== */

  // Engagement date & time
  // 13 September 2026 — 9:00 PM Egypt time
  const TARGET_DATE =
    "2026-09-13T21:00:00+03:00";


  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =====================================================
     LOADER / OPENING
  ===================================================== */

  function initLoader() {

    const loader =
      document.getElementById("loader");

    if (!loader) return;


    // Prevent scrolling while opening screen is visible
    document.body.style.overflow = "hidden";


    // How long the opening screen stays
    const delay =
      prefersReducedMotion
        ? 700
        : 4200;


    setTimeout(function () {

      loader.classList.add("is-hidden");

      // Give the fade-out time to finish
      setTimeout(function () {

        document.body.style.overflow = "";

      }, 1300);

    }, delay);

  }


  /* =====================================================
     REVEAL ON SCROLL
  ===================================================== */

  function initReveal() {

    const elements =
      document.querySelectorAll(".reveal");


    if (!elements.length) return;


    // If the user prefers reduced motion
    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {

      elements.forEach(function (element) {

        element.classList.add("visible");

      });

      return;

    }


    const observer =
      new IntersectionObserver(

        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.15,
          rootMargin: "0px 0px -50px 0px"
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

    const days =
      document.getElementById("cd-days");

    const hours =
      document.getElementById("cd-hours");

    const minutes =
      document.getElementById("cd-minutes");

    const seconds =
      document.getElementById("cd-seconds");


    if (
      !days ||
      !hours ||
      !minutes ||
      !seconds
    ) {
      return;
    }


    const target =
      new Date(TARGET_DATE).getTime();


    function pad(number) {

      return String(number)
        .padStart(2, "0");

    }


    function updateCountdown() {

      const now =
        Date.now();


      const difference =
        target - now;


      // Event has started
      if (difference <= 0) {

        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        return;

      }


      const totalSeconds =
        Math.floor(
          difference / 1000
        );


      const d =
        Math.floor(
          totalSeconds / 86400
        );


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


      days.textContent =
        pad(d);

      hours.textContent =
        pad(h);

      minutes.textContent =
        pad(m);

      seconds.textContent =
        pad(s);

    }


    // First update immediately
    updateCountdown();


    // Update every second
    const countdownInterval =
      setInterval(
        updateCountdown,
        1000
      );


    // Stop timer after the event
    window.addEventListener(
      "beforeunload",
      function () {

        clearInterval(
          countdownInterval
        );

      }
    );

  }


  /* =====================================================
     FLOATING PETALS
  ===================================================== */

  function initPetals() {

    const field =
      document.getElementById(
        "petalsField"
      );


    if (!field) return;


    // Don't create animated petals
    // when reduced motion is enabled
    if (prefersReducedMotion) {
      return;
    }


    const amount =
      window.innerWidth < 600
        ? 8
        : 15;


    for (
      let i = 0;
      i < amount;
      i++
    ) {

      const petal =
        document.createElement(
          "div"
        );


      petal.className =
        "petal";


      // Random horizontal position
      petal.style.left =
        Math.random() * 100 + "vw";


      // Random animation speed
      petal.style.animationDuration =
        12 +
        Math.random() * 12 +
        "s";


      // Start at different points
      petal.style.animationDelay =
        "-" +
        Math.random() * 15 +
        "s";


      // Random transparency
      petal.style.opacity =
        0.25 +
        Math.random() * 0.45;


      // Random size
      petal.style.scale =
        0.6 +
        Math.random() * 0.8;


      field.appendChild(
        petal
      );

    }

  }


  /* =====================================================
     MUSIC
  ===================================================== */

  function initMusic() {

    const audio =
      document.getElementById(
        "bgMusic"
      );

    const button =
      document.getElementById(
        "musicToggle"
      );


    if (
      !audio ||
      !button
    ) {
      return;
    }


    audio.volume = 0.30;


    function setState(
      playing
    ) {

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

          // Browser blocked autoplay
          setState(false);

        });

    }


    /*
      Try autoplay.

      Some mobile browsers will block this.
      In that case, the first user interaction
      will start the music.
    */

    playMusic();


    /* =================================================
       FIRST USER INTERACTION
    ================================================= */

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


      document.removeEventListener(
        "keydown",
        firstInteraction
      );

    }


    document.addEventListener(
      "click",
      firstInteraction,
      {
        passive: true
      }
    );


    document.addEventListener(
      "touchstart",
      firstInteraction,
      {
        passive: true
      }
    );


    document.addEventListener(
      "keydown",
      firstInteraction,
      {
        passive: true
      }
    );


    /* =================================================
       MUSIC BUTTON
    ================================================= */

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


    /* =================================================
       AUDIO EVENTS
    ================================================= */

    audio.addEventListener(
      "play",
      function () {

        setState(true);

      }
    );


    audio.addEventListener(
      "pause",
      function () {

        setState(false);

      }
    );

  }


  /* =====================================================
     BUTTON MICRO INTERACTION
  ===================================================== */

  function initButtons() {

    const buttons =
      document.querySelectorAll(
        ".outline-btn"
      );


    if (!buttons.length) return;


    buttons.forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          button.style.transform =
            "scale(.96)";


          setTimeout(function () {

            button.style.transform =
              "";

          }, 150);

        }
      );

    });

  }


  /* =====================================================
     SMOOTH SCROLL
  ===================================================== */

  function initSmoothScroll() {

    const scrollIndicator =
      document.querySelector(
        ".scroll-indicator"
      );


    if (!scrollIndicator) return;


    scrollIndicator.addEventListener(
      "click",
      function () {

        const celebration =
          document.querySelector(
            ".celebration"
          );


        if (celebration) {

          celebration.scrollIntoView({
            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth"
          });

        }

      }
    );


    scrollIndicator.style.cursor =
      "pointer";

  }


  /* =====================================================
     PREVENT DOUBLE TAP / MOBILE ISSUES
  ===================================================== */

  function initMobile() {

    // Prevent accidental zoom on buttons
    const buttons =
      document.querySelectorAll(
        "button"
      );


    buttons.forEach(function (button) {

      button.addEventListener(
        "touchstart",
        function () {},
        {
          passive: true
        }
      );

    });

  }


  /* =====================================================
     INIT
  ===================================================== */

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      initLoader();

      initReveal();

      initCountdown();

      initPetals();

      initMusic();

      initButtons();

      initSmoothScroll();

      initMobile();

    }
  );


})();
