(() => {
  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];

  /*
  |--------------------------------------------------------------------------
  | Loading screen
  |--------------------------------------------------------------------------
  */

  const loader = $(".loader");

  const finishLoading = () => {
    document.body.classList.add("is-loaded");
    loader?.classList.add("is-hidden");
  };

  window.addEventListener("load", () => {
    setTimeout(finishLoading, 500);
  });

  setTimeout(finishLoading, 2600);

  /*
  |--------------------------------------------------------------------------
  | Footer year
  |--------------------------------------------------------------------------
  */

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /*
  |--------------------------------------------------------------------------
  | Mobile menu
  |--------------------------------------------------------------------------
  */

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
    const isOpen = !menu?.classList.contains("is-open");

    document.body.classList.toggle("menu-open", isOpen);
    menu?.classList.toggle("is-open", isOpen);
    menu?.setAttribute("aria-hidden", String(!isOpen));
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  menuBackdrop?.addEventListener("click", closeMenu);

  /*
  |--------------------------------------------------------------------------
  | Header appearance while scrolling
  |--------------------------------------------------------------------------
  */

  const siteHeader = $(".site-header");

  const updateHeader = () => {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  updateHeader();

  /*
  |--------------------------------------------------------------------------
  | Scroll story
  |--------------------------------------------------------------------------
  */

  const storySteps = $$(".story__step");
  const storyFrames = $$(".story__frame");
  const sceneNumber = $("#scene-number");

  if (storySteps.length && storyFrames.length) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const scene = Number(entry.target.dataset.scene);

          storySteps.forEach((step, index) => {
            step.classList.toggle("is-active", index === scene);
          });

          storyFrames.forEach((frame, index) => {
            frame.classList.toggle("is-active", index === scene);
          });

          if (sceneNumber) {
            sceneNumber.textContent = String(scene + 1).padStart(2, "0");
          }
        });
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0,
      }
    );

    storySteps.forEach((step) => {
      storyObserver.observe(step);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Service-image switching
  |--------------------------------------------------------------------------
  */

  const serviceRows = $$(".service-row");
  const serviceImages = $$(".service-image");

  const activateService = (selectedIndex) => {
    serviceRows.forEach((row, index) => {
      row.classList.toggle("is-active", index === selectedIndex);
    });

    serviceImages.forEach((image, index) => {
      image.classList.toggle("is-active", index === selectedIndex);
    });
  };

  serviceRows.forEach((row, index) => {
    ["mouseenter", "focus", "click"].forEach((eventName) => {
      row.addEventListener(eventName, () => {
        activateService(index);
      });
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Reveal animations
  |--------------------------------------------------------------------------
  */

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
      threshold: 0.12,
    }
  );

  revealTargets.forEach((element) => {
    revealObserver.observe(element);
  });

  /*
  |--------------------------------------------------------------------------
  | Gentle image movement
  |--------------------------------------------------------------------------
  */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion) {
    const parallaxImages = $$(".parallax-media img");
    let ticking = false;

    const updateParallax = () => {
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
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      {
        passive: true,
      }
    );

    updateParallax();
  }

  /*
  |--------------------------------------------------------------------------
  | Desktop custom cursor
  |--------------------------------------------------------------------------
  */

  const cursor = $(".cursor");
  const cursorText = cursor?.querySelector("span");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && finePointer) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.classList.add("is-visible");
    });

    const moveCursor = () => {
      cursorX += (mouseX - cursorX) * 0.14;
      cursorY += (mouseY - cursorY) * 0.14;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      window.requestAnimationFrame(moveCursor);
    };

    moveCursor();

    $$("[data-cursor]").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        if (cursorText) {
          cursorText.textContent = element.dataset.cursor || "View";
        }
      });

      element.addEventListener("mouseleave", () => {
        if (cursorText) {
          cursorText.textContent = "View";
        }
      });
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Magnetic desktop buttons
  |--------------------------------------------------------------------------
  */

  $$(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const horizontalDistance =
        event.clientX - (rect.left + rect.width / 2);
      const verticalDistance =
        event.clientY - (rect.top + rect.height / 2);

      element.style.transform =
        `translate(${horizontalDistance * 0.12}px, ` +
        `${verticalDistance * 0.12}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Contact form
  |--------------------------------------------------------------------------
  */

  const contactForm = $("#contact-form");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const subject = encodeURIComponent(
      `Pubtain enquiry — ${formData.get("venue")}`
    );

    const body = encodeURIComponent(
      `Name: ${formData.get("name")}\n` +
        `Pub/company: ${formData.get("venue")}\n` +
        `Email: ${formData.get("email")}\n` +
        `Telephone: ${formData.get("phone") || "Not provided"}\n\n` +
        `What they need help with:\n${formData.get("message")}`
    );

    window.location.href =
      `mailto:hello@pubtain.com?subject=${subject}&body=${body}`;
  });
})();
