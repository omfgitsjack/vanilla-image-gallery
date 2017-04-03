var galleryView = (function () {
    "use strict";

    let components = {
        // Controls for showing/hiding upload area
        getShowUploadAreaButton: () => document.getElementById("show-upload-button"),
        getHideUploadAreaButton: () => document.getElementById("hide-upload-button"),
        getUploadArea: () => document.getElementById("upload-area"),
        getGalleryArea: () => document.getElementById("gallery-area"),
    };

    onload = () => {
        // Onclicks for toggling whether upload form is shown
        components.getShowUploadAreaButton().onclick = e => {
            e.preventDefault();
            view.openUploadView();
        };

        components.getHideUploadAreaButton().onclick = e => {
            e.preventDefault();
            view.closeUploadView();
        };

        // Onclicks for delete, prev and next
        document.getElementById("delete-image-button").onclick = e =>
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_DELETE_IMAGE));

        document.getElementById('gallery-controls--previous').onclick = e =>
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_PREV_IMAGE));

        document.getElementById('gallery-controls--next').onclick = e =>
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_NEXT_IMAGE));
    };

    var view = {
        onload: onload,

        open: () => {
            view.closeUploadView();
        },
        close: () => {
            components.getGalleryArea().className = "";
        },

        // Showing / hiding upload views
        openUploadView: () => {
            components.getUploadArea().className = "active";
            components.getGalleryArea().className = "";
            // components.getUploadArea().querySelector('.image-container').src = ''; 
        },
        closeUploadView: () => {
            components.getUploadArea().className = "";
            components.getGalleryArea().className = "active";
        },

        update404: () => {
            let galleryArea = components.getGalleryArea(),
                imgContainer = galleryArea.querySelector('.image-container'),
                imgName = galleryArea.querySelector('.image-title-area--image-name'),
                imgAuthor = galleryArea.querySelector('.image-title-area--image-author');

            imgContainer.innerHTML = '';
            imgName.innerHTML = '404';
            imgAuthor.innerHTML = 'Not Found';
            view.updateCommentCounter("no");

            view.updateGalleryImageNavigators(false, false);
        },

        // Updaing the actual image as well as next/prev image
        updateCurrentImage: payload => {
            view.closeUploadView();

            let galleryArea = components.getGalleryArea(),
                imgContainer = galleryArea.querySelector('.image-container'),
                imgName = galleryArea.querySelector('.image-title-area--image-name'),
                imgAuthor = galleryArea.querySelector('.image-title-area--image-author');

            let currentUserName = document.cookie.split("=")[1];

            if (currentUserName === payload.image.author) {
                document.querySelector("#gallery-area .image-controls").className = 'image-controls';
            } else {
                document.querySelector("#gallery-area .image-controls").className = 'image-controls hidden';
            }

            if (!payload.image) {
                imgContainer.innerHTML = '';
                imgName.innerHTML = 'No images in the gallery :(';
                imgAuthor.innerHTML = '';
                view.updateCommentCounter();
            } else {
                imgContainer.innerHTML = `<img src="${payload.image.imgUrl}" alt="image"/>`;
                imgName.innerHTML = payload.image.name;
                imgAuthor.innerHTML = payload.image.author;
                view.updateCommentCounter(payload.image.comments.length);
            }

            view.updateGalleryImageNavigators(payload.hasPreviousImage, payload.hasNextImage);
        },

        updateCommentCounter: count => {
            let galleryArea = components.getGalleryArea(),
                commentsCallOutText = galleryArea.querySelector('.image-footer-area p');

            commentsCallOutText.innerHTML = count === null ? '' : `${count} responses`;
        },

        // Update the prev & next buttons
        updateGalleryImageNavigators: (hasPrev, hasNext) => {
            let galleryArea = components.getGalleryArea(),
                prevImageBtn = galleryArea.querySelector('#gallery-controls--previous'),
                nextImageBtn = galleryArea.querySelector('#gallery-controls--next');

            prevImageBtn.className = hasPrev ? 'btn btn-image' : 'btn btn-image disabled';
            nextImageBtn.className = hasNext ? 'btn btn-image' : 'btn btn-image disabled';
        }
    };

    return view;

}());