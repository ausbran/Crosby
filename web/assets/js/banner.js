export function initBanner(carouselSelector, progressBarSelector) {
  const carousel = document.querySelector(carouselSelector);
  const progressBar = document.querySelector(progressBarSelector);
  if (!carousel) return;

  const items = carousel.querySelectorAll(".carousel-item");
  if (!items.length) return;

  const slideTime = parseInt(carousel.dataset.slideTime, 10) * 1000 || 15000;
  const pauseTime = 400;
  let index = 0;

  if (items.length === 1) {
    // If there's only one asset, make it visible and skip carousel logic
    items[0].classList.add("active");
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "100%"; // Show progress bar if desired for single asset
    }
    return;
  }

  // Carousel logic for multiple assets
  function showNextImage() {
    items[index].classList.remove("active");
    index = (index + 1) % items.length;
    items[index].classList.add("active");

    // Reset and animate the progress bar
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      setTimeout(() => {
        progressBar.style.transition = `width ${slideTime}ms linear`;
        progressBar.style.width = "100%";
      }, 100);
    }
  }

  function startCarousel() {
    setInterval(() => {
      showNextImage();
    }, slideTime + pauseTime);
  }

  // Initialize the carousel
  items[index].classList.add("active");
  if (progressBar) {
    progressBar.style.transition = `width ${slideTime}ms linear`;
    progressBar.style.width = "100%";
  }

  startCarousel();
}
