import { body } from "./globals.js";

export function initMap() {
  const map = L.map("map").setView([30.8461, -93.2893], 13);
  const mapDuration = 0.25;

  // Add customized zoom controls
  map.removeControl(map.zoomControl);

  const zoomControl = L.control({ position: "bottomright" }); // Position to bottom-right

  zoomControl.onAdd = function (map) {
    const div = L.DomUtil.create("div", "custom-zoom-controls");
    div.innerHTML = `
    <button id="zoom-in" class="btn icon rounded-full text-xl custom-zoom-btn">+</button>
    <button id="zoom-out" class="btn icon rounded-full text-xl custom-zoom-btn">−</button>
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

  L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {}).addTo(
    map
  );

  const allBounds = L.featureGroup();

  // Open modal for a listing
  const openModal = (listingId) => {
    const listing = mapData.listings.find((l) => l.id === listingId);

    if (!listing) {
      console.error(`Listing with ID ${listingId} not found.`);
      return;
    }

    // Populate modal content
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
    const modalImageContainer = document.getElementById(
      "modal-image-container"
    );
    modalImageContainer.innerHTML = ""; // Clear existing images
    listing.images.forEach((imageHtml) => {
      const imageDiv = document.createElement("div");
      imageDiv.innerHTML = imageHtml;
      imageDiv.classList.add(
        "slide",
        "flex-span-9",
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
    });

    // Update "Call" button with phone number
    const callButton = document.querySelector(".call-button");
    callButton.href = `tel:${listing.phone}`;

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

    if (shouldResetMap) {
      // Reset the map view to show all shapes
      map.flyToBounds(allBounds.getBounds(), {
        padding: [50, 50],
        duration: mapDuration,
      });
    }
  };

  // Initialize shapes on the map
  const initializeMapShapes = () => {
    if (mapData.listings && mapData.listings.length > 0) {
      // Real Estate Page Logic
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
    console.log("Fetching shapefile:", shapefileUrl);
    fetch(shapefileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        console.log("Shapefile fetched successfully:", shapefileUrl);
        return shapefile.open(arrayBuffer).then((source) => {
          source.read().then(function log(result) {
            if (result.done) {
              console.log("Finished reading shapefile:", shapefileUrl);
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

                // Check if listing.title exists
                if (listing && listing.title) {
                  // Create custom popup content
                  const popupContent = `
        <div class="tooltip-content">
          <div class="flex space-x-4">
          <span>${listing.address.locality || "Unknown"}, ${
            listing.address.administrativeArea || ""
          }</span>
          <span>${listing.acreage || "N/A"} Acres</span>
          </div>
          <h3 class="text-3xl">${listing.title}</h3>
        </div>
      `;

                  layer.bindPopup(popupContent, {
                    className: "custom-popup",
                    closeButton: false,
                    offset: [0, -20],
                  });

                  layer.on("mouseover", () => {
                    layer.setStyle({
                      color: "red",
                      weight: 3,
                      fillOpacity: 0.4,
                    });
                    layer.openPopup();
                  });

                  layer.on("mouseout", () => {
                    layer.setStyle({
                      color: "red",
                      weight: 2,
                      fillOpacity: 0.2,
                    });
                    layer.closePopup();
                  });
                } else {
                  // Fallback behavior when no title exists
                  layer.on("mouseover", () => {
                    layer.setStyle({
                      color: "red",
                      weight: 3,
                      fillOpacity: 0.4,
                    });
                  });

                  layer.on("mouseout", () => {
                    layer.setStyle({
                      color: "red",
                      weight: 2,
                      fillOpacity: 0.2,
                    });
                  });
                }

                layer.on("click", () => {
                  if (listingId) {
                    openModal(listingId);
                  }

                  const bounds = layer.getBounds();
                  map.flyToBounds(bounds, {
                    padding: [50, 50],
                    duration: mapDuration,
                  });
                });
              },
            }).addTo(map);

            // Store the layer for this listing
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

  // Attach event listeners
  const attachButtonListeners = (selector, callback) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const buttonElement = event.target.closest(selector);
        if (buttonElement) {
          const listingId = buttonElement.getAttribute("data-id");
          if (listingId) {
            // Zoom to the shape for this listing
            const layer = mapLayers[listingId];
            if (layer) {
              const bounds = layer.getBounds();
              map.flyToBounds(bounds, {
                padding: [50, 50],
                duration: mapDuration,
              });
            }
            // Open the modal
            callback(listingId);
          } else {
            console.error(`Listing ID not found on ${selector}`);
          }
        }
      });
    });
  };

  // Attach listeners for view buttons and image buttons
  attachButtonListeners(".view-button", (listingId) => openModal(listingId));
  attachButtonListeners(".image-button", (listingId) => openModal(listingId));

  // Initialize both map shapes and event listeners
  initializeMapShapes();

  // Add modal close listeners
  document.querySelector(".content-modal-close").addEventListener(
    "click",
    () => closeModal(document.getElementById("modal"), true) // Pass `true` to reset the map
  );

  // Close the photo modal without resetting the map view
  document
    .querySelector(".photo-modal-close")
    .addEventListener("click", () =>
      closeModal(document.getElementById("photo-modal"))
    );

  // Close the contact modal without resetting the map view
  document
    .querySelector(".contact-modal-close")
    .addEventListener("click", () =>
      closeModal(document.getElementById("contact-modal"))
    );
}
