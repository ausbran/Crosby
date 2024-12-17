import { body } from "./globals.js";

export function initRealEstate() {
  const modal = document.getElementById("modal");
  const modalClose = document.querySelector(".modal-close");
  const modalImageContainer = document.getElementById("modal-image-container");
  const photoModal = document.getElementById("photo-modal");
  const photoModalClose = document.querySelector(".photo-modal-close");
  const photoModalImageContainer = document.getElementById(
    "photo-modal-image-container"
  );
  const viewButtons = document.querySelectorAll(".btn-inline");
  const listingImages = document.querySelectorAll(".listing-image");
  const contactModal = document.getElementById("contact-modal");
  const contactModalClose = document.querySelector(".contact-modal-close");
  const contactButtons = document.querySelectorAll(".btn-contact");

  const openModal = (listingId) => {
    const listing = mapData.listings.find((l) => l.id === listingId);

    if (!listing) {
      console.error(`Listing with ID ${listingId} not found.`);
      return;
    }

    // Populate the main modal
    document.getElementById("modal-title").innerText =
      listing.title || "No title available";
    document.getElementById("modal-description").innerText =
      listing.description || "No description available";
    document.getElementById("modal-address").innerText =
      `${listing.address.locality || "Unknown"}, ${listing.address.administrativeArea || ""}`;
    document.getElementById("modal-price").innerText = listing.price
      ? `$${listing.price}`
      : "Price not available";
    document.getElementById("modal-acreage").innerText =
      `${listing.acreage || "N/A"} Acres`;

    // Populate features
    const featuresList = document
      .getElementById("modal-features")
      .querySelector("ul");
    featuresList.innerHTML = ""; // Clear existing features
    listing.features.forEach((feature) => {
      const li = document.createElement("li");
      li.classList.add("col-span-2");
      li.innerHTML = `<span class="font-medium">${feature.title}:</span> ${feature.text}`;
      featuresList.appendChild(li);
    });

    // Populate images
    modalImageContainer.innerHTML = ""; // Clear existing images
    listing.images.forEach((imageHtml, index) => {
      const imageDiv = document.createElement("div");
      imageDiv.innerHTML = imageHtml;

      // Add base class
      imageDiv.classList.add(
        "slide",
        "flex-span-9",
        "hover:opacity-70",
        "transition-all",
        "cursor-pointer",
        "snap-start",
        "scroll-ml-16"
      );

      // Attach click handler to open the photo modal
      imageDiv.addEventListener("click", () => openPhotoModal(listing, index));

      modalImageContainer.appendChild(imageDiv);
    });

    // Update the "Get in Touch" button
    const contactButton = document.querySelector("email-button");
    // contactButton.setAttribute("data-id", listing.id);

    // Update the "Call" button
    const callButton = document.querySelector(".call-button");
    callButton.href = `tel:${listing.phone}`;

    modal.classList.add("show");
    body.classList.add("no-scroll");
  };

  const openPhotoModal = (listing, startIndex) => {
    // Populate the photo modal slider
    photoModalImageContainer.innerHTML = "";
    listing.images.forEach((imageHtml, index) => {
      const imageDiv = document.createElement("div");
      imageDiv.innerHTML = imageHtml;

      imageDiv.classList.add("photo-slide");
      if (index === startIndex) {
        imageDiv.classList.add("active");
      } else if (index < startIndex) {
        imageDiv.classList.add("left");
      } else {
        imageDiv.classList.add("right");
      }

      photoModalImageContainer.appendChild(imageDiv);
    });

    photoModal.classList.add("show");
    body.classList.add("no-scroll");
  };

  const closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    body.classList.remove("no-scroll");
  };

  viewButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(button.dataset.id);
    });
  });

  listingImages.forEach((image) => {
    image.addEventListener("click", (e) => {
      const listingId = e.target.closest("[data-id]").dataset.id;
      openModal(listingId);
    });
  });

  modalClose.addEventListener("click", () => closeModal(modal));
  photoModalClose.addEventListener("click", () => closeModal(photoModal));

  const photoModalPrev = document.getElementById("photo-modal-prev");
  const photoModalNext = document.getElementById("photo-modal-next");

  let currentSlide = 0;

  const updateSlides = (direction) => {
    const slides = photoModalImageContainer.querySelectorAll(".photo-slide");
    slides.forEach((slide, index) => {
      slide.classList.remove("active", "left", "right");
      if (index === currentSlide) {
        slide.classList.add("active");
      } else if (index < currentSlide) {
        slide.classList.add("left");
      } else {
        slide.classList.add("right");
      }
    });
  };

  photoModalPrev.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + listings.length) % listings.length;
    updateSlides();
  });

  photoModalNext.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % listings.length;
    updateSlides();
  });

  // Open contact form modal
  contactButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const listingId = button.dataset.id;

      // Populate modal with listing details (optional)
      const listing = listings.find((l) => l.id === listingId);
      if (listing) {
        document.getElementById("contact-modal-title").innerText =
          listing.title;
      }

      contactModal.classList.add("show");
      body.classList.add("no-scroll");
    });
  });

  // Close contact form modal
  contactModalClose.addEventListener("click", () => {
    contactModal.classList.remove("show");
    body.classList.remove("no-scroll");
  });
}
