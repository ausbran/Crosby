import { nav, navState, mapWrapper } from "./globals.js";

export function initNavigation() {
  const navHeight = nav.offsetHeight;
  let lastScrollY = window.scrollY;
  let activePrimary = null;
  let activeSecondary = null;
  let timeoutId = null;

  const primaryMenu = document.getElementById("mobile-primary");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeButton = document.getElementById("close-menu");
  const backButtons = document.querySelectorAll(".back-button");
  const secondaryMenus = document.querySelectorAll(".mobile-secondary");
  const primaryLinks = document.querySelectorAll(".primary-link");
  const primaryNavLinks = document.querySelectorAll(".primary-links > li");
  const navContainer = document.getElementById("main-nav");

  // ✅ Desktop: Scroll logic (UNCHANGED)
  function handleScroll() {
    if (!navState.allowNavScrollLogic) return;

    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > navHeight) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    lastScrollY = currentScrollY;
  }

  // ✅ Desktop: Fix Hover Glitch & Smoothly Animate Color Banner
   function initDesktopMenu() {
    primaryNavLinks.forEach((primary) => {
      const secondaryMenu = primary.querySelector(".secondary-links");
      const colorBanner = secondaryMenu?.querySelector(".color-banner");

      primary.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId); // Prevents flicker when switching quickly

        if (activePrimary && activePrimary !== primary) {
          activePrimary.classList.remove("active");
        }

        if (activeSecondary && activeSecondary !== secondaryMenu) {
          activeSecondary.classList.add("fade-out");

          setTimeout(() => {
            activeSecondary.classList.remove(
              "visible",
              "opacity-100",
              "pointer-events-auto",
              "fade-out"
            );
          }, 150);
        }

        primary.classList.add("active");

        if (secondaryMenu) {
          secondaryMenu.classList.remove("fade-out");
          secondaryMenu.classList.add("visible", "opacity-100", "pointer-events-auto");

          // ✅ Instead of instantly setting height to 0, keep it consistent while switching
          if (colorBanner) {
            requestAnimationFrame(() => {
              colorBanner.style.transition = "height 0.3s ease-in-out";
              colorBanner.style.height = `${secondaryMenu.scrollHeight}px`;
            });
          }

          activeSecondary = secondaryMenu;
        }

        activePrimary = primary;
      });
    });

    // ✅ Only hide menus when leaving nav entirely
    navContainer.addEventListener("mouseleave", () => {
      timeoutId = setTimeout(() => {
        if (activePrimary) activePrimary.classList.remove("active");
        if (activeSecondary) {
          activeSecondary.classList.add("fade-out");
          setTimeout(() => {
            activeSecondary.classList.remove("visible", "opacity-100", "pointer-events-auto", "fade-out");
          }, 150);
        }

        // ✅ Prevent height flicker when switching menus
        document.querySelectorAll(".color-banner").forEach((banner) => {
          banner.style.transition = "none"; // Temporarily disable transition
          banner.style.height = "0";
          setTimeout(() => {
            banner.style.transition = "height 0.3s ease-in-out"; // Re-enable transition after reset
          }, 50);
        });

        activePrimary = null;
        activeSecondary = null;
      }, 250);
    });
  }

  // ✅ Mobile: Slide menu logic (UNCHANGED)
  function initMobileMenu() {
    const toggleMobileMenu = () => {
      mobileMenu.classList.toggle("translate-x-full");
      mobileMenu.classList.toggle("translate-x-0");

      if (hamburger.classList.contains("animate")) {
        hamburger.classList.remove("animate");
        hamburger.classList.add("animate-reverse");
      } else {
        hamburger.classList.remove("animate-reverse");
        hamburger.classList.add("animate");
      }
    };

    const resetMobileMenu = () => {
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      hamburger.classList.remove("animate");
      hamburger.classList.add("animate-reverse");

      primaryMenu.classList.remove("translate-x-full");
      secondaryMenus.forEach((menu) => {
        menu.classList.add("hidden");
        menu.classList.remove("translate-x-0");
      });
      primaryLinks.forEach((primary) => primary.classList.remove("hidden"));
    };

    hamburger.addEventListener("click", () => {
      toggleMobileMenu();
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        resetMobileMenu();
      });
    }

    primaryLinks.forEach((button) => {
      const secondaryMenu = document.querySelector(button.dataset.secondary);
      button.addEventListener("click", () => {
        primaryLinks.forEach((primary) => primary.classList.add("opacity-0"));
        secondaryMenu.classList.add("translate-x-0");
        activeSecondary = secondaryMenu;
      });
    });

    backButtons.forEach((backButton) => {
      backButton.addEventListener("click", () => {
        if (activeSecondary) {
          activeSecondary.classList.remove("translate-x-0");
          primaryMenu.classList.remove("translate-x-full");
          activeSecondary = null;
        }
        primaryLinks.forEach((primary) => primary.classList.remove("opacity-0"));
      });
    });
  }

  function initializeMenu() {
    if (window.innerWidth >= 768) {
      initDesktopMenu();
    } else {
      initMobileMenu();
    }
  }

  initializeMenu();
  window.addEventListener("resize", initializeMenu);
  window.addEventListener("scroll", handleScroll);
}