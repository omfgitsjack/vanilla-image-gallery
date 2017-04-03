(function (model, uploadView, galleryView, commentView, authView, galleryPickerView, events, utils, store) {
    "use strict";

    let initialState = {
        currentGalleryPage: 0,
        cachedGalleries: []
    };

    let state = Object.assign({}, initialState);

    // -------------------------------
    // UPSTREAM EVENTS (view -> model)
    // -------------------------------

    document.addEventListener(events.ON_CLICK_LOGOUT, () => {
        model.signOut();
    });
    document.addEventListener(events.ON_CLICK_GALLERY_PICKER, () => {
        authView.close();
        galleryView.close();
        uploadView.close();

        store.clearGalleries();
        model.getGalleries(store.getState().currentGalleryPage);
        galleryPickerView.open();
    });

    // ImageView-related events
    document.addEventListener(events.ON_SUBMIT_NEW_IMAGE, ({ detail }) => model.createImage(detail));
    document.addEventListener(events.ON_CLICK_NEXT_IMAGE, ({ detail }) => model.nextImage(detail));
    document.addEventListener(events.ON_CLICK_PREV_IMAGE, ({ detail }) => model.prevImage(detail));
    document.addEventListener(events.ON_CLICK_DELETE_IMAGE, ({ detail }) => model.deleteImage(detail));

    // MessageView-related events
    document.addEventListener(events.ON_SUBMIT_NEW_COMMENT, ({ detail }) => model.createMessage(detail));
    document.addEventListener(events.ON_CLICK_DELETE_MESSAGE, ({ detail }) => model.deleteMessage(detail));
    document.addEventListener(events.ON_CLICK_PREV_RESPONSE_PAGE, ({ detail }) => model.getPrevPageOfMessages(detail));
    document.addEventListener(events.ON_CLICK_NEXT_RESPONSE_PAGE, ({ detail }) => model.getNextPageOfMessages(detail));

    // AuthView-related events
    document.addEventListener(events.ON_CLICK_SIGN_IN, ({ detail }) => model.signIn(detail));
    document.addEventListener(events.ON_CLICK_SIGN_UP, ({ detail }) => model.signUp(detail));
    document.addEventListener(events.ON_CLICK_SIGN_OUT, ({ detail }) => model.signOut(detail));

    // GalleryView-related Events
    document.addEventListener(events.ON_CLICK_LOAD_MORE_GALLERIES, ({ detail }) =>
        model.getGalleries(store.incrementCurrentGalleryPage().getState().currentGalleryPage));
    document.addEventListener(events.ON_CLICK_OWN_EMPTY_GALLERY, ({ detail }) => {
        galleryPickerView.close();
        uploadView.open();
    });
    document.addEventListener(events.ON_CLICK_GALLERY, ({ detail }) => {
        galleryPickerView.close();
        galleryView.open();
        store.setAuthorOfCurrentGallery(detail.author);
        
        model.readImage(detail.id);
    });

    // -------------------------------
    // DOWNSTREAM EVENTS (model -> view)
    // -------------------------------

    // Helpers for handling view updates
    let handleChangeOfMessages = detail => {
        let state = store.getState();

        commentView.renderMessages(detail, state.images[state.currentImageIndex]);
        galleryView.updateCommentCounter(detail.totalMessages);
    };
    let handleNewImage = detail => {
        galleryView.updateCurrentImage(detail);
        model.readMessagePage(detail.image.id, 0); // On getting new image, load first page of comments.

        if (!detail.image) {
            window.history.replaceState(null, 'Picturely', 'index.html');
        } else {
            window.history.replaceState(null, 'Picturely', 'index.html?id=' + detail.image.id + '&owner=' + detail.image.author);
        }
    };
    let handle404 = detail => {
        galleryView.update404();
        window.history.replaceState(null, 'Picturely', 'index.html');
    };

    // Image-related events
    document.addEventListener(events.ON_LOAD_IMAGE, ({ detail }) => handleNewImage(detail));
    document.addEventListener(events.ON_UNABLE_TO_LOAD_IMAGE, ({ detail }) => handle404(detail));
    document.addEventListener(events.ON_LOAD_MESSAGE_PAGE, ({ detail }) => handleChangeOfMessages(detail));

    // Authentication-related events
    document.addEventListener(events.ON_SUCCESSFUL_SIGN_IN, () => {
        authView.close();
        galleryPickerView.open();

        model.getGalleries(store.getState().currentGalleryPage);
    });
    document.addEventListener(events.ON_FAILED_SIGN_IN, ({ detail }) => authView.showErrorMessage(detail.message));
    document.addEventListener(events.ON_FAILED_SIGN_UP, ({ detail }) => authView.showErrorMessage(detail.message));
    document.addEventListener(events.ON_SUCCESSFUL_SIGN_OUT, () => {
        store.resetState();

        galleryPickerView.close();
        galleryView.close();
        uploadView.close();
        authView.open();
    });

    // Gallery-related events
    document.addEventListener(events.ON_LOAD_GALLERY_PAGES, ({ detail }) => {
        store.appendToCachedGalleries(detail.data);
        store.updateGalleryPages(detail.totalPages);

        galleryPickerView.renderGalleries(store.getState());
    });

    // Checks for id queries and fires the appropriate model if there's a match.
    let prevWindowLoad = window.onload;
    window.onload = () => {
        if (prevWindowLoad) prevWindowLoad();

        if (window.location.search.includes('?id=')) {
            authView.close();
            model.readImage(utils.getParameterByName("id"));
        }
    };

}(model, uploadView, galleryView, commentView, authView, galleryPickerView, events, utils, store));