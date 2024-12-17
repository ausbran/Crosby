export function initLanding(carouselSelector, progressBarSelector) {
  const carousel = document.querySelector(carouselSelector);
  const progressBar = document.querySelector(progressBarSelector);
  if (!carousel || !progressBar) return;

  const slideTime = parseInt(carousel.dataset.slideTime, 10) * 1000 || 15000;
  const pauseTime = 400;
  const items = carousel.querySelectorAll(".carousel-item");
  let index = 0;

  function showNextImage() {
    items[index].classList.remove("active");
    index = (index + 1) % items.length;
    items[index].classList.add("active");

    // Reset and animate the progress bar
    progressBar.style.transition = "none";
    progressBar.style.width = "0%";
    setTimeout(() => {
      progressBar.style.transition = `width ${slideTime}ms linear`;
      progressBar.style.width = "100%";
    }, 100);

    // Recalculate logo color based on new active background
  }

  function startCarousel() {
    setInterval(() => {
      showNextImage();
    }, slideTime + pauseTime);
  }

  items[index].classList.add("active");
  progressBar.style.transition = `width ${slideTime}ms linear`;
  progressBar.style.width = "100%";

  startCarousel();

  const backgroundContainer = document.querySelector(".background");

  const animateBackground = () => {
    const containerRect = backgroundContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate progress based on scroll position
    const progress = Math.min(
      Math.max(1 - containerRect.top / viewportHeight, 0),
      1
    );

    // Interpolate width from current width to 100vw
    const interpolatedWidth = progress * (window.innerWidth - 1600) + 1600;

    // Apply width dynamically
    backgroundContainer.style.maxWidth = `${interpolatedWidth}px`;
    backgroundContainer.style.paddingLeft = `${(1 - progress) * 16}px`; // Adjust padding as needed
    backgroundContainer.style.paddingRight = `${(1 - progress) * 16}px`;
  };

  const handleScroll = () => {
    requestAnimationFrame(animateBackground);
  };

  // Trigger animation on scroll
  window.addEventListener("scroll", handleScroll);
}
