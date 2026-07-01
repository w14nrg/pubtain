(() => {
  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];

  /* Loading screen */
  const loader = $(".loader");

  const finishLoading = () => {
    document.body.classList.add("is-loaded");
    loader?.classList.add("is-hidden");
  };

  window.addEventListener("load", () => {
    window.setTimeout(finishLoading, 500);
  });

  window.setTimeout(finishLoading, 2600);

  /* Footer year */
  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Menu */
  const menu = $("#menu");
  const menuToggle = $(".menu-toggle");
  const menuBackdrop = $(".menu__backdrop");

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menu?.classList.remove("is-open");
    menu?.setAttribute("aria-hidden", "true");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const willOpen = !menu?.classList.contains("is-open");

    document.body.classList.toggle("menu-open", willOpen);
    menu?.classList.toggle("is-open", willOpen);
    menu?.setAttribute("aria-hidden", String(!willOpen));
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  $$(".menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  menuBackdrop?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* Header colour after leaving the hero */
  const siteHeader = $(".site-header");

  const updateHeader = () => {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* Scroll story — desktop, tablet and mobile */
  const storySteps = $$(".story__step");
  const storyFrames = $$(".story__frame");
  const sceneNumber = $("#scene-number");

  let storyObserver = null;
  let storyResizeTimer = null;

  const activateStoryScene = (sceneIndex) => {
    storySteps.forEach((step, index) => {
      step.classList.toggle(
        "is-active",
        index === sceneIndex
      );
    });

    storyFrames.forEach((frame, index) => {
      frame.classList.toggle(
        "is-active",
        index === sceneIndex
      );
    });

    if (sceneNumber) {
      sceneNumber.textContent =
        String(sceneIndex + 1).padStart(2, "0");
    }
  };

  const createStoryObserver = () => {
    if (!storySteps.length || !storyFrames.length) {
      return;
    }

    storyObserver?.disconnect();

    const isMobile =
      window.matchMedia("(max-width: 900px)").matches;

    storyObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleEntries.length) {
          return;
        }

        const sceneIndex =
          Number(
            visibleEntries[0].target.dataset.scene
          ) || 0;

        activateStoryScene(sceneIndex);
      },
      {
        root: null,
        rootMargin: isMobile
          ? "-54% 0px -30% 0px"
          : "-35% 0px -45% 0px",
        threshold: [0, 0.05, 0.15, 0.3, 0.5]
      }
    );

    storySteps.forEach((step) => {
      storyObserver.observe(step);
    });
  };

  activateStoryScene(0);
  createStoryObserver();

  window.addEventListener("resize", () => {
    window.clearTimeout(storyResizeTimer);

    storyResizeTimer = window.setTimeout(() => {
      createStoryObserver();
    }, 180);
  });

  /* Service image switching */
  const serviceRows = $$(".service-row");
  const serviceImages = $$(".service-image");

  const activateService = (selectedIndex) => {
    serviceRows.forEach((row, index) => {
      row.classList.toggle(
        "is-active",
        index === selectedIndex
      );
    });

    serviceImages.forEach((image, index) => {
      image.classList.toggle(
        "is-active",
        index === selectedIndex
      );
    });
  };

  serviceRows.forEach((row, index) => {
    [
      "mouseenter",
      "focus",
      "click",
      "touchstart"
    ].forEach((eventName) => {
      row.addEventListener(
        eventName,
        () => activateService(index),
        eventName === "touchstart"
          ? { passive: true }
          : undefined
      );
    });
  });

  /* Reveal animations */
  const revealTargets = $$(
    ".section-head, " +
      ".cover-card, " +
      ".mini-card, " +
      ".process__steps article, " +
      ".contact__lead, " +
      ".contact-form"
  );

  revealTargets.forEach((element) => {
    element.dataset.reveal = "";
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealTargets.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* Parallax only on larger screens */
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion) {
    const parallaxImages = $$(".parallax-media img");
    let ticking = false;

    const updateParallax = () => {
      if (window.innerWidth <= 900) {
        parallaxImages.forEach((image) => {
          image.style.transform = "";
        });

        ticking = false;
        return;
      }

      parallaxImages.forEach((image) => {
        const container = image.parentElement;

        if (!container) {
          return;
        }

        const rect = container.getBoundingClientRect();

        const progress =
          (window.innerHeight - rect.top) /
          (window.innerHeight + rect.height);

        const movement = (progress - 0.5) * 13;

        image.style.transform =
          `translate3d(0, ${movement}%, 0) scale(1.05)`;
      });

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(
            updateParallax
          );

          ticking = true;
        }
      },
      {
        passive: true
      }
    );

    window.addEventListener(
      "resize",
      updateParallax
    );

    updateParallax();
  }

  /* Desktop cursor */
  const cursor = $(".cursor");

  const finePointer =
    window.matchMedia("(pointer: fine)").matches;

  if (cursor && finePointer) {
    const cursorText =
      cursor.querySelector("span");

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.classList.add("is-visible");
      }
    );

    window.addEventListener(
      "mouseleave",
      () => {
        cursor.classList.remove("is-visible");
      }
    );

    const moveCursor = () => {
      cursorX += (mouseX - cursorX) * 0.14;
      cursorY += (mouseY - cursorY) * 0.14;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      window.requestAnimationFrame(moveCursor);
    };

    moveCursor();

    $$("[data-cursor]").forEach((element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          if (cursorText) {
            cursorText.textContent =
              element.dataset.cursor || "View";
          }
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          if (cursorText) {
            cursorText.textContent = "View";
          }
        }
      );
    });
  }

  /* Magnetic desktop buttons */
  if (finePointer) {
    $$(".magnetic").forEach((element) => {
      element.addEventListener(
        "mousemove",
        (event) => {
          const rect =
            element.getBoundingClientRect();

          const horizontal =
            event.clientX -
            (rect.left + rect.width / 2);

          const vertical =
            event.clientY -
            (rect.top + rect.height / 2);

          element.style.transform =
            `translate(` +
            `${horizontal * 0.12}px, ` +
            `${vertical * 0.12}px` +
            `)`;
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          element.style.transform = "";
        }
      );
    });
  }

  /* Contact form */
  const contactForm = $("#contact-form");

  contactForm?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const data =
        new FormData(event.currentTarget);

      const subject = encodeURIComponent(
        `Pubtain enquiry — ${data.get("venue")}`
      );

      const body = encodeURIComponent(
        `Name: ${data.get("name")}\n` +
          `Pub/company: ${data.get("venue")}\n` +
          `Email: ${data.get("email")}\n` +
          `Telephone: ${
            data.get("phone") || "Not provided"
          }\n\n` +
          `What they need help with:\n` +
          `${data.get("message")}`
      );

      window.location.href =
        `mailto:hello@pubtain.com` +
        `?subject=${subject}` +
        `&body=${body}`;
    }
  );
})();
