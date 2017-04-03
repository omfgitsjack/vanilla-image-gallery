var events = (function() {
    "use strict";
    
    return {
        ON_CLICK_LOGOUT: "ON_CLICK_LOGOUT",
        ON_CLICK_GALLERY_PICKER: "ON_CLICK_GALLERY_PICKER",
        
        // View, image related events
        ON_SUBMIT_NEW_IMAGE: "onSubmitNewImage",
        ON_CLICK_NEXT_IMAGE: 'onClickNextImage',
        ON_CLICK_PREV_IMAGE: 'onClickPrevImage',
        ON_CLICK_DELETE_IMAGE: 'onClickDeleteImage',
        ON_CLICK_PREV_RESPONSE_PAGE: 'onClickPrevResponsePage',
        ON_CLICK_NEXT_RESPONSE_PAGE: 'onClickNextResponsePage',

        // View, comment related events
        ON_SUBMIT_NEW_COMMENT: 'onSubmitNewComment',
        ON_CLICK_DELETE_MESSAGE: 'onClickDeleteMessage',

        // View, auth related events
        ON_CLICK_SIGN_IN: 'onClickSignIn',
        ON_CLICK_SIGN_UP: 'onClickSignUp',
        ON_CLICK_SIGN_OUT: 'onClickSignOut',

        // Gallery view
        ON_CLICK_GALLERY: 'ON_CLICK_GALLERY',
        ON_CLICK_OWN_EMPTY_GALLERY: 'ON_CLICK_OWN_EMPTY_GALLERY',
        ON_CLICK_LOAD_MORE_GALLERIES: 'ON_CLICK_LOAD_MORE_GALLERIES',

        // Model events
        ON_LOAD_IMAGE: 'onLoadImage',
        ON_UNABLE_TO_LOAD_IMAGE: 'onUnableToLoadImage',
        ON_LOAD_MESSAGE_PAGE: 'onLoadMessagePage',
        // Model events that relate to sign in/up/out
        ON_SUCCESSFUL_SIGN_IN: 'ON_SUCCESSFUL_SIGN_IN',
        ON_FAILED_SIGN_IN: 'ON_FAILED_SIGN_IN',
        ON_FAILED_SIGN_UP: 'ON_FAILED_SIGN_UP',
        ON_SUCCESSFUL_SIGN_OUT: 'ON_SUCCESSFUL_SIGN_OUT',
        // model gallery events
        ON_LOAD_GALLERY_PAGES: 'ON_LOAD_GALLERY_PAGES',
    };
}());