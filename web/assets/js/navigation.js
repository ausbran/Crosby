import { nav } from './globals.js';

export function initNavigation() {
    let lastScrollY = window.scrollY;
    const navHeight = nav.offsetHeight;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > navHeight) {
            // Scrolling down
            nav.style.transform = 'translateY(-125px)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;
    }

    function throttle(func, limit) {
        let inThrottle;
        return function () {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);

    // Handle secondary links on hover
    const primaryLinks = document.querySelectorAll('.primary-links > li');

    primaryLinks.forEach((primary) => {
        const secondaryLinks = primary.querySelector('.secondary-links');
        if (secondaryLinks) {
            primary.addEventListener('mouseenter', () => {
                secondaryLinks.style.display = 'block';
                secondaryLinks.style.opacity = '0';
                secondaryLinks.style.transition = 'opacity 0.3s ease, height 0.3s ease';
                requestAnimationFrame(() => {
                    secondaryLinks.style.opacity = '1';
                    nav.style.height = `${nav.offsetHeight + secondaryLinks.offsetHeight}px`;
                });
            });

            primary.addEventListener('mouseleave', () => {
                secondaryLinks.style.opacity = '0';
                nav.style.height = '';
                setTimeout(() => {
                    secondaryLinks.style.display = 'none';
                }, 300); // Match the transition duration
            });
        }
    });
}