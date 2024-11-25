import { initNavigation } from './navigation.js';
import { logoColor } from './logo.js';
import { initProjectOverview } from './projectOverview.js';
import { initPress } from './press.js';
import { initSlider } from './slider.js';
import { initLandingFeatured } from './landingFeatured.js';
import { initProject } from './project.js';
import { initLoad } from './load.js';
import { initScroll } from './scroll.js';
import { initContact } from './contact.js';
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
    // initLoad(); commenting out until further experimentation with logo animation on page load
    const namespace = document.querySelector('main').dataset.barbaNamespace;
    initializeComponents(document, namespace);
});

function initializeComponents(container, namespace) {
    initScroll();
    body.classList.remove('red');
    nav.classList.remove('border');
    const video = container.querySelector('video');
    if (video) {
        video.play();
        video.addEventListener('playing', () => {
            setTimeout(logoColor, 100); // Ensure logo color adjustment after video starts
        });
    } else {
        setTimeout(logoColor, 100); // Delay to ensure content is fully loaded
    }
    switch (namespace) {
        case 'projectCategory':
            initProjectOverview();
            nav.classList.add('border');
            break;
        case 'project':
            initProject(container);
            initSlider();
            setTimeout(logoColor, 100);
            break;
        case 'story':
            nav.classList.add('border');
            initSlider();
            break;
        case 'contact':
            initContact();
            break;
        case 'company':
            nav.classList.add('border');
            initSlider();
            break;
        case 'blog':
            nav.classList.add('border');
            initSlider();
            break;
        case 'website':
            nav.classList.add('border');
            initSlider();
            break;
        case 'magazine':
            nav.classList.add('border');
            initSlider();
            const pdfViewer = container.querySelector('#pdf-viewer');
            if (pdfViewer) {
                const pdfUrl = pdfViewer.dataset.url;
                initPress(pdfUrl);
            }
            break;
        case 'career':
            body.classList.add('red');
            break;
        default:
            const carousel = container.querySelector('.carousel');
            const slider = container.querySelector('.slider');
            if (carousel) {
                initLandingFeatured('.carousel', '.progress-bar .progress');
            }
            if (slider) {
                initSlider();
            }
            setTimeout(logoColor, 100); // Delay to ensure content is fully loaded
            break;
    }
}

let clickedButton = null;

document.addEventListener("click", function (event) {
    // Check if the clicked element or any parent has `data-project-id`
    let clickedElement = event.target.closest("[data-project-id]");
    if (clickedElement) {
        clickedButton = clickedElement;
    }
});

barba.init({
    transitions: [{
        name: 'zoom-transition',
        leave(data) {
            return new Promise((resolve) => {
                if (!clickedButton) {
                    resolve();
                    return;
                }

                const projectId = clickedButton.getAttribute('data-project-id');
                const clickedImage = data.current.container.querySelector(`.project-image[data-project-id="${projectId}"] img`);
                
                // Check if the clicked button is within the "more projects" slider or the main project list
                const isFromMoreProjectsSlider = clickedButton.closest('#more-projects');
                const projectContainer = isFromMoreProjectsSlider
                    ? clickedImage.closest('.project-image')  // Use `.project-image` height for more projects slider
                    : clickedImage.closest('.project');  // Use `.project` height for project list

                if (!clickedImage || !projectContainer) {
                    resolve();
                    return;
                }

                if (isFromMoreProjectsSlider) {
                    const landingElement = data.current.container.querySelector('.landing');
                    if (landingElement) {
                        landingElement.classList.add('hidden');
                    }
                }

                // Create a wrapper container to match the initial dimensions
                const wrapperClone = document.createElement('div');
                wrapperClone.classList.add('gradient', 'gradient-top');
                wrapperClone.style.position = 'fixed';
                wrapperClone.style.overflow = 'hidden';
                wrapperClone.style.zIndex = 99999;

                const projectRect = projectContainer.getBoundingClientRect();
                gsap.set(wrapperClone, {
                    top: projectRect.top,
                    left: projectRect.left,
                    width: projectRect.width,
                    height: projectRect.height,
                    zIndex: 1,
                    opacity: 0
                });

                document.body.appendChild(wrapperClone);

                // Clone the clicked image and place inside the wrapper
                const imageClone = clickedImage.cloneNode(true);
                wrapperClone.appendChild(imageClone);

                gsap.set(imageClone, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                });

                // Animate the wrapper to full screen
                gsap.to(wrapperClone, {
                    opacity: 1,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.to(wrapperClone, {
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            duration: 0.7,
                            ease: 'power3.inOut',
                            onComplete: () => {
                                resolve();
                            }
                        });
                    }
                });

                // Store the wrapper for later removal
                data.current.wrapperClone = wrapperClone;
                nav.classList.remove('scrolled');
            });
        },
        enter(data) {
            gsap.from(data.next.container, { opacity: 0, duration: 0.5 });
            body.classList.remove('no-scroll'); // Ensure 'no-scroll' class is removed on enter
        },
        afterEnter(data) {
            const { wrapperClone } = data.current;
            clickedButton = null;

            // Delay removal of the wrapperClone slightly after the new page loads
            setTimeout(() => {
                if (wrapperClone) {
                    gsap.to(wrapperClone, { opacity: 0, duration: 0.2, onComplete: () => wrapperClone.remove() });
                }
            }, 400);

            const namespace = data.next.container.dataset.barbaNamespace;
            initializeComponents(data.next.container, namespace);
            window.scrollTo(0, 0);
            body.classList.remove('no-scroll'); // Ensure 'no-scroll' class is removed on afterEnter
            initScroll();
            initAnchor();
            setTimeout(logoColor, 100)
        }
    }]
});