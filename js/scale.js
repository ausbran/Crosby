export function initScale() {
  const scaleUp = document.querySelector(".scale-up");
  const initialScale = 0.9; // Starting scale
  const maxScale = 1.2; // Maximum scale when at the top of the viewport

  if (scaleUp) {
    const onScroll = () => {
      const blockRect = scaleUp.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate the scale based on the distance from the top of the viewport
      const distanceFromTop = Math.max(0, viewportHeight - blockRect.top);
      const progress = Math.min(1, distanceFromTop / viewportHeight); // Normalize to 0-1

      // Interpolate between initialScale and maxScale
      const scale = initialScale + (maxScale - initialScale) * progress;

      // Apply the scale transformation
      scaleUp.style.transform = `scale(${scale})`;
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", onScroll);

    // Run once to initialize the scale
    onScroll();
  }
}
