import { initNavigation } from "./navigation.js";
import { initSlider } from "./slider.js";
import { initLanding } from "./landing.js";
import { initScroll } from "./scroll.js";
import { initTestimonials } from "./testimonials.js";
import { initContact } from "./contact.js";
import { initServices } from "./services.js";
import { initAnchor } from "./anchor.js";
import { initMap } from "./map.js";
import { body, nav, navHeight } from "./globals.js";

document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  const namespace = document.querySelector("main").dataset.barbaNamespace;
  initializeComponents(document, namespace);
});

function initializeComponents(container, namespace) {
  initScroll();
  const video = container.querySelector("video");
  if (video) {
    video.play();
  }
  switch (namespace) {
    case "story":
      initSlider();
      break;
    case "contact":
      initContact();
      break;
    case "company":
      initAnchor();
      initServices();
      initLanding(".carousel", ".progress-bar .progress");
      initTestimonials(".carousel", ".progress-bar .progress");
      break;
    case "blog":
      initSlider();
      break;
    case "realEstate":
      initMap();
      break;
    case "landOwnership":
      initMap();
      break;
    default:
      const carousel = container.querySelector(".carousel");
      const slider = container.querySelector(".slider");
      if (carousel) {
        initLanding(".carousel", ".progress-bar .progress");
      }
      if (slider) {
        initSlider();
      }
      break;
  }
}

barba.init({
  transitions: [
    {
      name: "fade-transition",
      leave(data) {
        const primaryLinks = document.querySelectorAll(".primary-links > li");

        // Clean up classes before starting the animation
        primaryLinks.forEach((link) =>
          link.classList.remove("opacity-30", "active")
        );

        // Return the GSAP animation
        return gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
      },
      enter(data) {
        gsap.from(data.next.container, { opacity: 0, duration: 0.5 });
      },
      afterEnter(data) {
        const namespace = data.next.container.dataset.barbaNamespace;
        pageInit(namespace, data.next.container); // Page-specific initialization
        window.scrollTo(0, 0); // Reset scroll position
      },
    },
  ],
});
