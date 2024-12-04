import { body } from './globals.js';

export function initContact() {
    const buttons = document.querySelectorAll('.group button');
    const modal = document.getElementById('contact-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const parent = button.closest('.group');
            const name = parent.querySelector('h3').textContent;
            const position = parent.querySelector('p').textContent;
            const image = parent.querySelector('img').src;

            // Populate Modal Content
            modalContent.innerHTML = `
                <img src="${image}" alt="${name}" class="col-span-6 w-full rounded-md">
                <div class="col-span-6">
                    <h2 class="text-3xl font-bold mb-2">${name}</h2>
                    <h3 class="text-xl font-medium mb-4 text-gray-600">${position}</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet commodo lorem eget gravida.</p>
                </div>
            `;

            // Show Modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            body.classList.add('no-scroll');
        });
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        body.classList.remove('no-scroll');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            body.classList.remove('no-scroll');
        }
    });
}