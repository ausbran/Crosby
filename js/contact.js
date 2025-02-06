import { body } from "./globals.js";

export function initContact() {
  // Function to open the modal
  const openContactModal = (contactId) => {
    const contact = contactData.find((c) => c.id === contactId);

    if (!contact) {
      console.error(`Contact with ID ${contactId} not found.`);
      return;
    }

    // Populate modal content
    const modal = document.getElementById("contact-modal");
    const modalContent = modal.querySelector("#modal-content");

    // Clear existing content
      modalContent.innerHTML = `
        <div class="col-span-6 rounded-xl overflow-hidden mr-4 h-3/4">
        ${
          contact.asset
            ? `<img src="${contact.asset}" alt="${contact.title}" class="modal-asset" />`
            : ""
        }
        </div>
        <div class="col-span-6 flex flex-col justify-center">
            <h2 class="mb-4 text-white">${contact.title || "No Title"}</h2>
            <p class="text-white">${contact.bio || "No Bio Available"}</p>
        </div>
    `;

    // Show modal
    modal.classList.remove("translate-y-full");
    body.classList.add("no-scroll");

    // Add close event
    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => closeContactModal());
  };

  // Function to close the modal
  const closeContactModal = () => {
    const modal = document.getElementById("contact-modal");
    modal.classList.add("translate-y-full");
    body.classList.remove("no-scroll");
  };

    
    document.querySelectorAll(".bio-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const contactId = button.getAttribute("data-id");
            openContactModal(contactId);
        });
    });
}