var galleryPickerView = (function () {
    "use strict";

    let components = {
        // Controls for showing/hiding upload area
    };

    onload = () => {
        document.querySelector("#gallery-picker-area button").onclick = e => {
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_LOAD_MORE_GALLERIES));
        };
    };

    var view = {
        onload: onload,

        // Showing / hiding upload views
        close: () => {
            document.getElementById("gallery-picker-area").className = "";
        },
        open: () => {
            document.getElementById("gallery-picker-area").className = "active";
        },
        // Given the same input this will always render the same output.
        // I'd love to take a stab at someway to diff the elements, but i think
        // it's a little more complicated than container.contains(node)...
        renderGalleries: ({ currentGalleryPage, totalGalleryPages, cachedGalleries }) => {
            let container = document.querySelector('#gallery-picker-area .gallery-list-container');

            container.innerHTML = ""; // Clear it first. 

            cachedGalleries.forEach(gallery => {
                let el = document.createElement('div'),
                    itemDescription = gallery.username + "'s Gallery";

                itemDescription += !gallery.coverImage ? " (No Images)" : "";

                el.className = "gallery-item";
                el.innerHTML = `
                    <img src="${gallery.coverImage ? gallery.coverImage.imgUrl : ''}" alt=""/>
                    <div class="gallery-item--description">
                        ${itemDescription}
                    </div>`;

                let currentUserName = document.cookie.split("=")[1];

                // Attach onclick listener
                if (!gallery.coverImage && currentUserName !== gallery.username) {
                    el.className += " noclick";
                } else if (!gallery.coverImage && currentUserName === gallery.username) {
                    el.onclick = e => {
                        document.dispatchEvent(new CustomEvent(events.ON_CLICK_OWN_EMPTY_GALLERY));
                    };
                } else {
                    el.onclick = e => {
                        document.dispatchEvent(new CustomEvent(events.ON_CLICK_GALLERY, {
                            detail: gallery.coverImage
                        }));
                    };
                }

                container.appendChild(el);
                view.renderLoadMore(totalGalleryPages, currentGalleryPage + 1);
            });
        },
        renderLoadMore: (totalGalleryPages, currentGalleryPage) => {
            let button = document.querySelector("#gallery-picker-area button");

            if (totalGalleryPages > currentGalleryPage) {
                button.className = "btn submit";
                button.onclick = e => {
                    document.dispatchEvent(new CustomEvent(events.ON_CLICK_LOAD_MORE_GALLERIES));
                };
            } else {
                button.onclick = () => {};
                button.className = "btn submit disabled";
            }
        }
    };

    return view;

}());