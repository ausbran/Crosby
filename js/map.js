import { body, nav, navState, mapWrapper } from "./globals.js";
import { initSlider } from "./slider.js";

export function initMap() {
  const map = L.map("map").setView([30.8461, -93.2893], 13);
  const mapDuration = 0.75;

  // Add customized zoom controls
  map.removeControl(map.zoomControl);

  const zoomControl = L.control({ position: "bottomright" }); // Position to bottom-right

  zoomControl.onAdd = function (map) {
    const div = L.DomUtil.create("div", "custom-zoom-controls");
    div.innerHTML = `
      <button id="zoom-in" class="text-white h-[60px] btn icon rounded-full text-xl custom-zoom-btn">+</button>
      <button id="zoom-out" class="text-white h-[60px] btn icon rounded-full text-xl custom-zoom-btn">−</button>
    `;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };

  zoomControl.addTo(map);

  document
    .getElementById("zoom-in")
    .addEventListener("click", () => map.zoomIn());
  document
    .getElementById("zoom-out")
    .addEventListener("click", () => map.zoomOut());

  L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    maxZoom: 26, // Increase max zoom for better details
    tileSize: 256, // Default Google tile size
    zoomOffset: 0,
    detectRetina: true // Enable higher resolution tiles on retina displays
}).addTo(map);

  const allBounds = L.featureGroup();

  // Open modal for a listing
  const openModal = (listingId) => {
    const listing = mapData.listings.find((l) => l.id === listingId);

    if (!listing) {
      console.error(`Listing with ID ${listingId} not found.`);
      return;
    }

    nav.classList.add('scrolled');
    // mapWrapper.classList.add('expand');

    // Populate modal content
    document.getElementById("modal-title").innerText =
      listing.title || "No title available";
    document.getElementById("modal-description").innerText =
      listing.description
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
      li.classList.add("col-span-6", "lg:col-span-2");
      li.innerHTML = `<span class="font-medium">${feature.title}:</span> ${feature.text}`;
      featuresList.appendChild(li);
    });

    // Populate images
    const modalImageContainer = document.getElementById("modal-image-container");
    const modalImageContainerWrapper = document.getElementById("modal-image-container-wrapper");
    modalImageContainer.innerHTML = "";

    if (listing.images.length === 1) {
      modalImageContainerWrapper.classList.add("single");
    } else {
      modalImageContainerWrapper.classList.remove("single");
    }

    listing.images.forEach((imageHtml) => {
      const imageDiv = document.createElement("div");
      imageDiv.innerHTML = imageHtml;
      imageDiv.classList.add(
        "slide",
        "flex-span-11",
        "lg:flex-span-9",
        "hover:opacity-70",
        "transition-all",
        "cursor-pointer",
        "snap-start",
        "scroll-ml-16"
      );
      imageDiv.addEventListener("click", () =>
        openPhotoModal(listing, listing.images.indexOf(imageHtml))
      );
      modalImageContainer.appendChild(imageDiv);
      
      // Call slider script whenever a modal opens so that it works with new modal
      initSlider();
    });

    // Update "Call" button with phone number
    const callButton = document.querySelector(".call-button");
    callButton.href = `${listing.phone}`;

    // Set data-id for the email button
    const emailButton = document.querySelector(".email-button");
    if (emailButton) {
      emailButton.setAttribute("data-id", listingId);
    }

    const modal = document.getElementById("modal");
    modal.classList.add("show");
    body.classList.add("no-scroll");
  };

  // Open photo modal
  const openPhotoModal = (listing, startIndex) => {
    const photoModal = document.getElementById("photo-modal");
    const photoModalImageContainer = document.getElementById(
      "photo-modal-image-container"
    );
    photoModalImageContainer.innerHTML = ""; // Clear existing images

    listing.images.forEach((imageHtml, index) => {
      const imageDiv = document.createElement("div");
      imageDiv.innerHTML = imageHtml;
      imageDiv.classList.add("photo-slide", "col-span-8");
      if (index === startIndex) {
        imageDiv.classList.add("active");
      } else if (index < startIndex) {
        imageDiv.classList.add("left");
      } else {
        imageDiv.classList.add("right");
      }
      photoModalImageContainer.appendChild(imageDiv);
    });

    // Show photo modal
    photoModal.classList.add("show");
    body.classList.add("no-scroll");
  };

  // Close modal
  const closeModal = (modalElement, shouldResetMap = false) => {
    modalElement.classList.remove("show");
    body.classList.remove("no-scroll");
    nav.classList.remove('scrolled');
    // mapWrapper.classList.remove('expand');

    setTimeout(() => {
      navState.allowNavScrollLogic = true; // Re-enable nav scroll logic when modal closes
    }, 500);

    if (shouldResetMap) {
      // Reset the map view to show all shapes
      map.flyToBounds(allBounds.getBounds(), {
        padding: [50, 50],
        duration: mapDuration,
      });
    }
  };

  // Initialize shapes on the maps for Land Sale and Land Ownership
  const initializeMapShapes = () => {
    if (mapData.listings && mapData.listings.length > 0) {
      // Land Sales Page Logic
      mapData.listings.forEach((listing) => {
        if (!listing.shapefile || listing.shapefile.length === 0) {
          console.warn(
            `No shapefiles found for listing: ${listing.title || listing.id}`
          );
          return;
        }

        listing.shapefile.forEach((shapefileUrl) => {
          processShapefile(shapefileUrl, listing.id);
        });
      });
    } else if (mapData.shapefiles && mapData.shapefiles.length > 0) {
      // Land Ownership Page Logic
      mapData.shapefiles.forEach((shapefileUrl) => {
        processShapefile(shapefileUrl);
      });
    } else {
      console.warn("No shapefiles or listings found in mapData.");
    }
  };

  const mapLayers = {}; // Store layers for each listing by ID

const processShapefile = (shapefileUrl, listingId = null) => {
  fetch(shapefileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      return shapefile.open(arrayBuffer).then((source) => {
        source.read().then(function log(result) {
          if (result.done) {
            map.fitBounds(allBounds.getBounds()); // Initial view
            return;
          }

          const geojson = result.value;

          const layer = L.geoJSON(geojson, {
            style: {
              color: "red", // Default color
              weight: 2,
              fillOpacity: 0.2,
            },
            onEachFeature: (feature, layer) => {
              const listing = listingId
                ? mapData.listings.find((l) => l.id === listingId)
                : null;

              if (listing && listing.title) {
                const popupContent = `
                  <div class="tooltip-content" data-id="${listingId}">
                    <div class="flex space-x-4">
                      <span>${listing.address.locality || "Unknown"}, ${listing.address.administrativeArea || ""}</span>
                      <span>${listing.acreage || "N/A"} Acres</span>
                    </div>
                    <h3 class="text-3xl">${listing.title}</h3>
                    <button class="view-button read-more btn w-full text-white" data-id="${listingId}">Read More</button>
                  </div>
                `;

                layer.bindPopup(popupContent, {
                  className: "custom-popup",
                  closeButton: false,
                  offset: [0, -20],
                });

                // **Desktop Hover Behavior - Keep Popup Open on Hover**
                layer.on("mouseover", () => {
                  layer.setStyle({
                    color: "red",
                    weight: 3,
                    fillOpacity: 0.4,
                  });
                  if (window.matchMedia("(min-width: 1024px)").matches) {
                    layer.openPopup();

                    // **Ensure popup stays open when hovered**
                    setTimeout(() => {
                      const popup = document.querySelector(".custom-popup");
                      if (popup) {
                        popup.addEventListener("mouseenter", () => {
                          layer.openPopup();
                        });

                        popup.addEventListener("mouseleave", () => {
                          layer.closePopup();
                        });
                      }
                    }, 300);
                  }
                });

                layer.on("mouseout", () => {
                  layer.setStyle({
                    color: "red",
                    weight: 2,
                    fillOpacity: 0.2,
                  });
                });

                // **Handle Click Behavior**
                layer.on("click", () => {
                  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

                  if (listingId) {
                    if (isDesktop) {
                      openModal(listingId); // Desktop opens modal immediately
                    } else {
                      layer.openPopup(); // Mobile opens popup first
                    }
                  }

                  const bounds = layer.getBounds();
                  map.flyToBounds(bounds, {
                    paddingTopLeft: [150, 0],  
                paddingBottomRight: [150, 50],
                    duration: mapDuration,
                  });
                });
              }
            },
          }).addTo(map);

          if (listingId) {
            mapLayers[listingId] = layer;
          }

          allBounds.addLayer(layer);
          source.read().then(log);
        });
      });
    })
    .catch((error) => {
      console.error("Error processing shapefile:", shapefileUrl, error);
    });
};

function adjustScrollForMap() {
    if (!mapWrapper) return;

    const mapRect = mapWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Only scroll if the bottom of mapWrapper is above the viewport bottom (user has scrolled past it)
    if (mapRect.bottom < windowHeight) {
        window.scrollBy({
            top: mapRect.bottom - windowHeight + 65, // Adjust as needed
            behavior: "smooth"
        });
    }
}

const attachButtonListeners = (selector, callback) => {
  const buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const buttonElement = event.target.closest(selector);
      if (buttonElement) {
        const listingId = buttonElement.getAttribute("data-id");
        if (listingId) {
          const layer = mapLayers[listingId];

          if (layer) {
            const bounds = layer.getBounds();
            const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

            if (isDesktop) {
              // **Desktop: Zoom to shape and open modal**
              map.flyToBounds(bounds, {
                padding: [70, 70],
                duration: mapDuration,
              });

              callback(listingId);
            } else {
              // **Mobile: Zoom to shape and show popup**
              map.flyToBounds(bounds, {
                paddingTopLeft: [150, 0],  
                paddingBottomRight: [150, 50],
                duration: mapDuration,
              });

              setTimeout(() => {
                // Explicitly open the popup
                layer.eachLayer((shape) => {
                  if (shape.getPopup()) {
                    shape.openPopup();
                  }
                });

                // **Ensure "Read More" in popup opens modal**
                setTimeout(() => {
                  document.querySelectorAll(".read-more").forEach((btn) => {
                    btn.addEventListener("click", (e) => {
                      e.preventDefault();
                      const id = btn.getAttribute("data-id");
                      if (id) {
                        callback(id);
                        layer.eachLayer((shape) => {
                          if (shape.getPopup()) {
                            shape.closePopup();
                          }
                        });
                      }
                    });
                  });
                }, 500);
              }, mapDuration * 1000);
            }
          } else {
            console.error(`Layer not found for listing ID ${listingId}`);
          }
        } else {
          console.error(`Listing ID not found on ${selector}`);
        }
      }
    });
  });
};
  attachButtonListeners(".view-button", (listingId) => openModal(listingId));
  attachButtonListeners(".image-button", (listingId) => openModal(listingId));

  // Add modal close listeners
  const closeButton = document.querySelector(".content-modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", () =>
      closeModal(document.getElementById("modal"), true)
    );
  }

  const photoModalClose = document.querySelector(".photo-modal-close");
  if (photoModalClose) {
    photoModalClose.addEventListener("click", () =>
      closeModal(document.getElementById("photo-modal"))
    );
  }

  // Open contact modal for a specific listing
  const openContactModal = (listingId) => {
    const contactModal = document.getElementById(`contact-modal-${listingId}`);
    if (!contactModal) {
      console.error(`Contact modal for listing ID ${listingId} not found.`);
      return;
    }
    contactModal.classList.remove("pointer-events-none", "translate-y-full");
    body.classList.add("no-scroll");
  };

  // Close contact modal
  const closeContactModal = (listingId) => {
    const contactModal = document.getElementById(`contact-modal-${listingId}`);
    if (contactModal) {
      contactModal.classList.add("pointer-events-none", "translate-y-full");
      body.classList.remove("no-scroll");
    }
  };

  document.querySelectorAll(".email-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const listingId = button.getAttribute("data-id");

      if (listingId) {
        openContactModal(listingId);
      } else {
        console.error("Listing ID not found for email button.");
      }
    });
  });

  document.querySelectorAll(".contact-modal-close").forEach((button) => {
    button.addEventListener("click", () => {
      const listingId = button
        .closest("[id^='contact-modal-']")
        .id.replace("contact-modal-", "");
      if (listingId) {
        closeContactModal(listingId);
      } else {
        console.error("Listing ID not found for close button.");
      }
    });
  });

  initializeMapShapes();
}
