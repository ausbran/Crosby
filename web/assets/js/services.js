export function initServices() {
    const tabs = document.querySelectorAll('.tab-btn');
    const slideContainers = document.querySelectorAll('.slides-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetService = tab.getAttribute('data-service');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show/Hide slide containers
            slideContainers.forEach(container => {
                if (container.getAttribute('data-service') === targetService) {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            });
        });
    });
}