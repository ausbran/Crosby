import { nav } from "./globals.js";

export function initNavigation() {
  let lastScrollY = window.scrollY; // Store the last scroll position
  const navHeight = nav.offsetHeight; // Get the height of the nav
  let activePrimary = null; // Track the currently active primary link

  // Handle scroll events for hiding/showing the nav
  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > navHeight) {
      // Scrolling down
      nav.style.transform = "translateY(-125px)";
    } else {
      // Scrolling up
      nav.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY; // Update the last scroll position
  }

  // Throttling function to improve performance
  function throttle(func, limit) {
    let inThrottle = false;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Apply throttling to the scroll handler
  const throttledScroll = throttle(handleScroll, 10);
  window.addEventListener("scroll", throttledScroll);

  // Handle hover interactions for primary and secondary links
  const primaryLinks = document.querySelectorAll(".primary-links > li");
  const navContainer = document.getElementById("main-nav");

  primaryLinks.forEach((primary) => {
    const secondaryLinks = primary.querySelector(".secondary-links");

    if (secondaryLinks) {
      // Handle hover on primary links
      primary.addEventListener("mouseenter", () => {
        if (activePrimary && activePrimary !== primary) {
          activePrimary.classList.remove("active");
        }
        primary.classList.add("active");
        document.querySelector("main").classList.add("blur-md");
        activePrimary = primary; // Set the current active primary link

        // Add opacity-30 to non-active list items
        primaryLinks.forEach((link) => {
          if (link !== activePrimary) {
            link.classList.add("opacity-30");
          } else {
            link.classList.remove("opacity-30");
          }
        });
      });
    }
  });

  // Handle mouseleave for the entire navigation container
  navContainer.addEventListener("mouseleave", () => {
    if (activePrimary) {
      activePrimary.classList.remove("active");
      activePrimary = null;
    }
    primaryLinks.forEach((link) => link.classList.remove("opacity-30"));
    document.querySelector("main").classList.remove("blur-md");
  });

  // Reset nav visibility and hover state on resize
  window.addEventListener("resize", () => {
    if (activePrimary) {
      activePrimary.classList.remove("active");
      activePrimary = null;

      // Remove opacity-30 from all list items
      primaryLinks.forEach((link) => link.classList.remove("opacity-30"));
    }
  });
}
