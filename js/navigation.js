import { nav, navState, mapWrapper } from "./globals.js";

export function initNavigation() {
  const navHeight = nav.offsetHeight;
  let lastScrollY = window.scrollY;
  let activePrimary = null;

  const primaryMenu = document.getElementById("mobile-primary");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeButton = document.getElementById("close-menu");
  const backButtons = document.querySelectorAll(".back-button");
  const secondaryMenus = document.querySelectorAll(".mobile-secondary");
  const primaryLinks = document.querySelectorAll(".primary-link");
  let activeSecondary = null;

  // Desktop: Scroll logic
  function handleScroll() {
    if (!navState.allowNavScrollLogic) return; // Only allow scrolling when `allowNavScrollLogic` is true
    
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > navHeight) {
      nav.classList.add("scrolled");
      // if (mapWrapper) mapWrapper.classList.add("expand");
    } else {
      nav.classList.remove("scrolled");
      // if (mapWrapper) mapWrapper.classList.remove("expand");
    }

    lastScrollY = currentScrollY;
  }

  // Desktop: Hover logic
  function initDesktopMenu() {
    const primaryLinks = document.querySelectorAll(".primary-links > li");
    const navContainer = document.getElementById("main-nav");

    primaryLinks.forEach((primary) => {
      primary.addEventListener("mouseenter", () => {
        if (activePrimary && activePrimary !== primary) {
          activePrimary.classList.remove("active");
        }
        primary.classList.add("active");
        activePrimary = primary;
      });
    });

    navContainer.addEventListener("mouseleave", () => {
      if (activePrimary) activePrimary.classList.remove("active");
      activePrimary = null;
    });
  }

  // Mobile: Slide menu logic
  function initMobileMenu() {
    // Toggle Mobile Menu and Hamburger Animation
    const toggleMobileMenu = () => {
      mobileMenu.classList.toggle("translate-x-full");
      mobileMenu.classList.toggle("translate-x-0");

      // Toggle the animation class
      if (hamburger.classList.contains("animate")) {
        hamburger.classList.remove("animate");
        hamburger.classList.add("animate-reverse");
      } else {
        hamburger.classList.remove("animate-reverse");
        hamburger.classList.add("animate");
      }
    };

    // Close Mobile Menu
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

    // Hamburger Click
    hamburger.addEventListener("click", () => {
      toggleMobileMenu();
    });

    // Close Button Click
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        resetMobileMenu();
      });
    }

    // Show Secondary Menu
    primaryLinks.forEach((button) => {
      const secondaryMenu = document.querySelector(button.dataset.secondary);
      button.addEventListener("click", () => {
        primaryLinks.forEach((primary) => primary.classList.add("opacity-0"));
        // secondaryMenu.classList.remove("hidden");
        secondaryMenu.classList.add("translate-x-0");
        activeSecondary = secondaryMenu;
      });
    });

    // Back Button Functionality
    backButtons.forEach((backButton) => {
      backButton.addEventListener("click", () => {
        if (activeSecondary) {
          // activeSecondary.classList.add("hidden");
          activeSecondary.classList.remove("translate-x-0");
          primaryMenu.classList.remove("translate-x-full");
          activeSecondary = null;
        }
        primaryLinks.forEach((primary) =>
          primary.classList.remove("opacity-0")
        );
      });
    });
  }

  // Initialize based on screen size
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
