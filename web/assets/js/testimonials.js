export function initTestimonials(carouselSelector, progressBarSelector) {
    const carousels = document.querySelectorAll(carouselSelector);

    if (!carousels.length) return;

    carousels.forEach((carousel) => {
        const progressBar = carousel.closest('.testimonials')?.querySelector(progressBarSelector);
        const items = carousel.querySelectorAll('.carousel-item');

        if (!items.length) return;

        const slideTime = parseInt(carousel.dataset.slideTime, 10) * 1000 || 15000;
        const pauseTime = 400;
        let index = 0;
        let interval;

        function showNextSlide() {
            items[index].classList.remove('active');
            index = (index + 1) % items.length;
            items[index].classList.add('active');

            if (progressBar) {
                // Reset and animate the progress bar
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = `width ${slideTime}ms linear`;
                    progressBar.style.width = '100%';
                }, 100);
            }
        }

        function startCarousel() {
            interval = setInterval(() => {
                showNextSlide();
            }, slideTime + pauseTime);
        }

        // Initialize the first slide and progress bar
        items[index].classList.add('active');
        if (progressBar) {
            progressBar.style.transition = `width ${slideTime}ms linear`;
            progressBar.style.width = '100%';
        }

        startCarousel();
    });
}