
// Job is to run all window on loads
// Actual view implementation depends on which component we're looking at
(function (galleryView, uploadView, commentView, authView, galleryPickerView, events) {
    "use strict";

    // Just run the window onloads.
    window.onload = () => {
        authView.onload();
        galleryView.onload();
        uploadView.onload();
        commentView.onload();
        galleryPickerView.onload();

        document.querySelectorAll(".top-left-nav .logout").forEach(el => {
            el.onclick = e => {
                document.dispatchEvent(new CustomEvent(events.ON_CLICK_LOGOUT));
            };
        });

        document.querySelectorAll(".top-left-nav .discover").forEach(el => {
            el.onclick = e => {
                document.dispatchEvent(new CustomEvent(events.ON_CLICK_GALLERY_PICKER));
            };
        });
    };

    //Ensure logout & discover buttons fire their onclick events

} (galleryView, uploadView, commentView, authView, galleryPickerView, events));