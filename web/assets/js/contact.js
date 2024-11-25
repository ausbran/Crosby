export function initContact() {
    // Select all contact sections
    const contactSections = document.querySelectorAll('.contact');

    contactSections.forEach(contactSection => {
        const formWrapper = contactSection.querySelector('.form-wrapper');
        const openButton = contactSection.querySelector('.btn:not(.close)');
        const closeButton = formWrapper.querySelector('.close');

        // Function to open the form
        function openForm() {
            formWrapper.classList.add('active');
        }

        // Function to close the form
        function closeForm() {
            formWrapper.classList.remove('active');
        }

        // Add click event listener to the open button
        if (openButton) {
            openButton.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent the default link behavior
                openForm();
            });
        }

        // Add click event listener to the close button
        if (closeButton) {
            closeButton.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent any default behavior
                closeForm();
            });
        }
    });
}