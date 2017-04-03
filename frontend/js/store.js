
// In-app store of data
var store = (function() {
    let initialState = {
        // galleries
        currentGalleryPage: 0,
        totalGalleryPages: 0,
        cachedGalleries: [],

        // images
        authorOfCurrentGallery: null,
        images: {},
        currentImageIndex: null,
        currentCommentPage: 0
    };

    let state = Object.assign({}, initialState),
        api = {};

    api.resetState = init => {
        state = Object.assign({}, init || initialState);

        return api;
    };

    api.getState = () => {
        return Object.assign({}, state);
    };

    // -----------------------
    // Gallery related methods
    // -----------------------
    api.clearGalleries = () => {
        state.currentGalleryPage = 0;
        state.totalGalleryPages = 0;
        state.cachedGalleries = [];
    };

    api.incrementCurrentGalleryPage = () => {
        state.currentGalleryPage++;

        return api;
    };

    api.appendToCachedGalleries = (galleries = []) => {
        state.cachedGalleries = state.cachedGalleries.concat(galleries);

        return api;
    };

    api.updateGalleryPages = pages => {
        state.totalGalleryPages = pages;

        return api;
    };

    // ---------------------
    // Image related methods
    // ---------------------
    api.setAuthorOfCurrentGallery = username => {
        state.authorOfCurrentGallery = username;

        return api;
    };
    
    api.cacheImage = image => {
        state.images[image.id] = Object.assign({}, image);

        return image;
    };

    api.purgeImage = imageId => {
        delete state.images[imageId];

        return api;
    };

    api.getNextImage = () => {
        return state.images[state.currentImageIndex].nextImage;
    };

    api.getPreviousImage = () => {
        return state.images[state.currentImageIndex].previousImage;
    };

    api.updateCachedImageIfExists = (id, payload) => {        
        if (!id) return true;

        if (state.images[id]) {
            state.images[id] = Object.assign({}, state.images[id], payload);
        }

        return id;
    };

    api.updateCachedImagePointers = ({ nextImage, previousImage }) => {
        api.updateCachedImageIfExists(nextImage, { previousImage });
        api.updateCachedImageIfExists(previousImage, { nextImage });

        return { nextImage, previousImage };
    };

    api.setCurrentImageIndex = image => {
        state.currentImageIndex = image.id;

        return image;
    };

    // ---------------------
    // Comment related methods
    // ---------------------
    api.setCurrentCommentPage = page => {
        state.currentCommentPage = page;

        return Promise.resolve(page);
    };

    return api;
} ());
