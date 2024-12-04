import { initNavigation } from './navigation.js';
import { initSlider } from './slider.js';
import { initLanding } from './landing.js';
import { initScroll } from './scroll.js';
import { initTestimonials } from './testimonials.js';
import { initContact } from './contact.js';
import { initServices } from './services.js';
import { initAnchor } from './anchor.js';
import { body, nav, navHeight } from './globals.js';

// loading screen
// window.addEventListener('DOMContentLoaded', () => {
//     const loadingScreen = document.getElementById('loading-screen');
//     loadingScreen.classList.add('visible');
//     body.classList.add('hidden-content');
// });

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    const namespace = document.querySelector('main').dataset.barbaNamespace;
    initializeComponents(document, namespace);
});

function initializeComponents(container, namespace) {
    initScroll();
    const video = container.querySelector('video');
    if (video) {
        video.play();
    }
    switch (namespace) {
        case 'story':
            initSlider();
            break;
        case 'contact':
            initContact();
            break;
        case 'company':
            initAnchor();
            initServices();
            initLanding('.carousel', '.progress-bar .progress');
            initTestimonials('.carousel', '.progress-bar .progress');
            break;
        case 'blog':
            initSlider();
            break;
        case 'career':
            break;
        default:
            const carousel = container.querySelector('.carousel');
            const slider = container.querySelector('.slider');
            if (carousel) {
                initLanding('.carousel', '.progress-bar .progress');
            }
            if (slider) {
                initSlider();
            }
            break;
    }
}

barba.init({
    transitions: [{
        name: 'fade-transition',
        leave(data) {
            return gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
        },
        enter(data) {
            gsap.from(data.next.container, { opacity: 0, duration: 0.5 });
        },
        afterEnter(data) {
            const namespace = data.next.container.dataset.barbaNamespace;
            initCommon(); // Run common initialization
            pageInit(namespace, data.next.container); // Page-specific initialization
            window.scrollTo(0, 0); // Reset scroll position
        },
    }],
});