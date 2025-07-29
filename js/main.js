import { initNavigation, resetNav } from "./navigation.js";
import { initSlider } from "./slider.js";
import { initBanner } from "./banner.js";
import { initScroll } from "./scroll.js";
import { initTestimonials } from "./testimonials.js";
import { initContact } from "./contact.js";
import { initScale } from "./scale.js";
import { initServices } from "./services.js";
import { initAnchor } from "./anchor.js";
import { initMap } from "./map.js";
import { initSliderFixed } from "./sliderFixed.js";
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
    case "home":
      initSliderFixed();
      initSlider();
      initBanner(".banner .carousel", ".banner .progress-bar .progress", ".banner .background");
      break;
    case "history":
      initSlider();
      break;
    case "contact":
      initSlider();
      initContact();
      initBanner(".banner .carousel", ".banner .progress-bar .progress", ".banner .background");
      break;
    case "team":
      initSlider();
      initContact();
      initBanner(".banner .carousel", ".banner .progress-bar .progress", ".banner .background");
      break;
    case "landServices":
      initScale();
      initBanner(".banner .carousel", ".banner .progress-bar .progress", ".banner .background");
    case "company":
      initAnchor();
      initServices();
      initSlider();
      initBanner(".banner .carousel", ".banner .progress-bar .progress", ".banner .background");
      initTestimonials(".testimonials .carousel", ".testimonials .progress-bar .progress");
      break;
    case "blog":
      initSlider();
      break;
    case "landSales":
      initMap();
      break;
    case "huntingLeases":
      initMap();
      break;
    case "landOwnership":
      initMap();
      break;
    default:
      const carousel = container.querySelector(".carousel");
      const slider = container.querySelector(".slider");
      const sliderFixed = container.querySelector('.fixed-slider')
      if (carousel) {
        initBanner(".carousel", ".progress-bar .progress");
      }
      if (slider) {
        initSlider();
      }
      if (sliderFixed) {
        initSliderFixed();
      }
      break;
  }
}

barba.init({
  transitions: [
    {
      name: "fade-transition",

      beforeLeave(data) {
        resetNav(); // Trigger fade-out animation
      },

      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.5
        });
      },

      enter(data) {
        gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.5
        });
      },

      afterEnter(data) {
        const namespace = data.next.container.dataset.barbaNamespace;
        pageInit(namespace, data.next.container);
        window.scrollTo(0, 0);
        initNavigation();
      },
    },
  ],
});