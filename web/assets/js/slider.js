export function initSlider() {
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const arrowPrev = slider.closest('.slider-container').querySelector('.arrow-prev');
        const arrowNext = slider.closest('.slider-container').querySelector('.arrow-next');

        function scrollSlider(offset) {
            const currentScrollLeft = slider.scrollLeft + offset;
            slider.scrollTo({
                left: currentScrollLeft,
                behavior: 'smooth'
            });
            toggleArrows();
        }

        function toggleArrows() {
            const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
            const nearStart = slider.scrollLeft <= 1;
            const nearEnd = slider.scrollLeft >= (maxScrollLeft - 1);

            if (arrowPrev && arrowNext) {
                arrowPrev.classList.toggle('disabled', nearStart);
                arrowNext.classList.toggle('disabled', nearEnd);
            }
        }

        if (arrowPrev && arrowNext) {
            arrowPrev.addEventListener('click', () => {
                if (!arrowPrev.classList.contains('disabled')) {
                    scrollSlider(-1 * slider.clientWidth);
                }
            });

            arrowNext.addEventListener('click', () => {
                if (!arrowNext.classList.contains('disabled')) {
                    scrollSlider(1 * slider.clientWidth);
                }
            });

            toggleArrows();
        }

        slider.addEventListener('scroll', toggleArrows);
        window.addEventListener('resize', toggleArrows);
    });
}