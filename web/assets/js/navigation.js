import { body, nav, links, navIcon } from './globals.js';

export function initNavigation() {

    // navIcon.addEventListener('click', function () {
    //     nav.classList.toggle('menu-opened');
    //     body.classList.toggle('no-scroll');
    //     if (document.querySelector('.back')) {
    //         document.querySelector('.back').classList.add('hidden');
    //     }
    // });

    function closeMenu() {
        nav.classList.remove('menu-opened');
        body.classList.remove('no-scroll');
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.close')) {
            closeMenu();
            if (document.querySelector('.back')) {
                document.querySelector('.back').classList.remove('hidden');
            }
        }
    });

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    function throttle(func) {
        let inThrottle;
        return function () {
            const context = this;
            const args = arguments;

            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;

                requestAnimationFrame(function () {
                    inThrottle = false;
                });
            }
        };
    }

    function handleScroll() {
        const scrolledClass = 'scrolled';
        if (window.scrollY > 10) {
            nav.classList.add(scrolledClass);
        } else {
            nav.classList.remove(scrolledClass);
        }
    }

    const throttledHandleScroll = throttle(handleScroll);
    window.addEventListener('scroll', throttledHandleScroll);   
}
