
// We use the store to cache images (in-memory)
var model = (function (store) {
    "use strict";

    let model = {
        // ---------------------
        // Image related methods
        // ---------------------
        createImage: payload =>
            ImageService.create(payload)
                .then(store.cacheImage)
                .then(store.setCurrentImageIndex)
                .then(image => store.updateCachedImageIfExists(image.previousImage, { nextImage: image.id }) && image)
                .then(eventDispatchers.onLoadImage),
        readImage: imageId =>
            ImageService.read(imageId, store) // Should serve image if cached.
                .then(store.cacheImage)
                .then(store.setCurrentImageIndex)
                .then(eventDispatchers.onLoadImage)
                .catch(eventDispatchers.onUnableToLoadImage),
        deleteImage: () =>
            ImageService.remove(store.getState().currentImageIndex, store)
                .then(store.updateCachedImagePointers)
                .then(({ nextImage, previousImage }) => nextImage || previousImage)
                .then(model.readImage),
        nextImage: () =>
            model.readImage(store.getNextImage()),
        prevImage: () =>
            model.readImage(store.getPreviousImage()),

        // -----------------------
        // Message related methods
        // -----------------------
        createMessage: messagePayload =>
            MessageService.create(store.getState().currentImageIndex, messagePayload)
                .then(message => model.readMessagePage(store.getState().currentImageIndex, 0)),
        readMessagePage: (imageId, page) =>
            store.setCurrentCommentPage(page)
                .then(page => MessageService.read(imageId, page))
                .then(payload => eventDispatchers.onLoadMessagePage(Object.assign({}, payload, { currentPage: page }))),
        deleteMessage: messageId =>
            MessageService.remove(store.getState().currentImageIndex, messageId)
                .then(() => MessageService.read(store.getState().currentImageIndex, store.getState().currentCommentPage))
                .then(payload => {
                    if (payload.messages.length === 0 && payload.totalPages > 0 && store.getState().currentCommentPage >= payload.totalPages) {
                        store.setCurrentCommentPage(payload.totalPages - 1);
                        model.readMessagePage(store.getState().currentImageIndex, store.getState().currentCommentPage);
                    } else {
                        eventDispatchers.onLoadMessagePage(Object.assign({}, payload, { currentPage: store.getState().currentCommentPage }));
                    }
                }),
        getNextPageOfMessages: () =>
            store.setCurrentCommentPage(store.getState().currentCommentPage + 1)
                .then(() => MessageService.read(store.getState().currentImageIndex, store.getState().currentCommentPage))
                .then(payload => eventDispatchers.onLoadMessagePage(Object.assign({}, payload, { currentPage: store.getState().currentCommentPage }))),
        getPrevPageOfMessages: () =>
            store.setCurrentCommentPage(store.getState().currentCommentPage - 1)
                .then(() => MessageService.read(store.getState().currentImageIndex, store.getState().currentCommentPage))
                .then(payload => eventDispatchers.onLoadMessagePage(Object.assign({}, payload, { currentPage: store.getState().currentCommentPage }))),

        // --------------------
        // Auth related methods
        // --------------------
        signIn: payload =>
            AuthService.signin(payload)
                .then(() => eventDispatchers.onSuccessfulSignIn())
                .catch(() => eventDispatchers.onFailedSignIn("Incorrect credentials")),
        signUp: payload =>
            AuthService.signup(payload)
                .then(() => model.signIn(payload))
                .catch(err => eventDispatchers.onFailedSignUp(err)),
        signOut: () =>
            AuthService.signout().then(eventDispatchers.onSuccessfulSignOut),

        // -----------------------
        // Gallery related methods
        // -----------------------
        getGalleries: page => {
            GalleryService.getGalleries(page)
                .then(pages => eventDispatchers.onLoadGalleryPages(pages));
        }
    };

    let eventDispatchers = {
        onLoadImage: image => {
            document.dispatchEvent(new CustomEvent(events.ON_LOAD_IMAGE, {
                detail: Object.assign({
                    image: image,
                    hasNextImage: image.nextImage,
                    hasPreviousImage: image.previousImage,
                })
            }));
        },
        onUnableToLoadImage: () => {
            document.dispatchEvent(new CustomEvent(events.ON_UNABLE_TO_LOAD_IMAGE, {
                detail: Object.assign({
                    image: null,
                    hasNextImage: null,
                    hasPreviousImage: null,
                })
            }));
        },
        onLoadMessagePage: ({ messages, currentPage, totalPages, totalRecords }) => {
            document.dispatchEvent(new CustomEvent(events.ON_LOAD_MESSAGE_PAGE, {
                detail: Object.assign({
                    messages: messages,
                    hasNextPageOfMessages: currentPage < totalPages - 1,
                    hasPreviousPageOfMessages: 0 < currentPage,
                    totalMessages: totalRecords,

                })
            }));
        },

        // Auth-related event dispatchers
        onSuccessfulSignIn: () => {
            document.dispatchEvent(new CustomEvent(events.ON_SUCCESSFUL_SIGN_IN));
        },
        onFailedSignIn: err => {
            document.dispatchEvent(new CustomEvent(events.ON_FAILED_SIGN_IN, {
                detail: {
                    message: err
                }
            }));
        },
        onFailedSignUp: err => {
            document.dispatchEvent(new CustomEvent(events.ON_FAILED_SIGN_UP, {
                detail: {
                    message: err
                }
            }));
        },
        onSuccessfulSignOut: () => {
            document.dispatchEvent(new CustomEvent(events.ON_SUCCESSFUL_SIGN_OUT));
        },

        onLoadGalleryPages: galleries => {
            document.dispatchEvent(new CustomEvent(events.ON_LOAD_GALLERY_PAGES, {
                detail: galleries
            }));
        }
    };

    return model;

}(store));