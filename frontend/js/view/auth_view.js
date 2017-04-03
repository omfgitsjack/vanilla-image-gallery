var authView = (function () {
    "use strict";

    let components = {
        // Controls for showing/hiding upload area
        getForm: () => document.querySelector('#auth-area .auth-form'),
    };

    onload = () => {
        // Onclicks for delete, prev and next
        document.getElementById("sign-in-btn").onclick = e => {
            e.preventDefault();
            
            let form = components.getForm(),
                username = form.querySelector("input[name=username]"),
                password = form.querySelector("input[name=password]");

            let payload = {
                username: username.value,
                password: password.value
            };
            
            view.hideErrorMessage();
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_SIGN_IN, {
                detail: payload
            }));
        };

        document.getElementById("sign-up-btn").onclick = e => {
            e.preventDefault();
            
            let form = components.getForm(),
                username = form.querySelector("input[name=username]"),
                password = form.querySelector("input[name=password]");

            let payload = {
                username: username.value,
                password: password.value
            };
            
            view.hideErrorMessage();
            document.dispatchEvent(new CustomEvent(events.ON_CLICK_SIGN_UP, {
                detail: payload
            }));
        };
    };

    var view = {
        onload: onload,

        // Showing / hiding upload views
        close: () => {
            document.getElementById("auth-area").className = "";
        },
        open: () => {
            document.getElementById("auth-area").className = "active";
        },
        showErrorMessage: msg => {
            document.querySelector("#auth-area .error-msg").innerHTML = msg;
            document.querySelector("#auth-area .error-msg").style.display = 'block';
        },
        hideErrorMessage: () => {
            document.querySelector("#auth-area .error-msg").innerHTML = '';
            document.querySelector("#auth-area .error-msg").style.display = 'none';
        }
    };

    return view;

}());