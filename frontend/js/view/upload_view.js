var uploadView = (function () {
    "use strict";

    // Helper that retrieves the file url
    let getFileUrl = file => new Promise((resolve, reject) => {
        if (!file) reject();

        let reader = new FileReader();

        reader.onload = e => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });

    let components = {
        // upload form related inputs
        getFormSubmitBtn: () => document.querySelector('#upload-image-button'),
        getForm: () => document.querySelector('#upload-area .upload-form'),
        getImagePreviewContainer: () => document.querySelector(`#upload-area .image-container`),
        getFileUpload: () => document.getElementById("file-input"),

        // file upload
        getFileUploadContainer: () => document.querySelector('#upload-area .image-file-upload'),

        // url upload
        getUrlUploadContainer: () => document.querySelector(`#upload-area .image-url-upload`),
        getUrlUpload: () => document.querySelector(`#upload-area .image-url-upload input`),
        getUrlUploadBtn: () => document.querySelector(`#upload-area .image-url-upload button`),

    };

    onload = () => {
        components.getFileUpload().onchange = function (e) {
            e.preventDefault();

            getFileUrl(this.files[0])
                .then(view.updatePreviewImage);
        };

        components.getUrlUploadBtn().onclick = e => {
            view.updatePreviewImage(components.getUrlUpload().value);
        };

        // When url upload is clicked, we show the url form
        components.getForm().querySelector('input[name=image-type][value=URL]').onchange = e => {
            if (e.currentTarget.checked) {
                components.getFileUploadContainer().style.display = 'none';
                components.getUrlUploadContainer().style.display = 'flex';
            }
        };

        // When file upload is clciked we show the file upload.
        components.getForm().querySelector('input[name=image-type][value=FileUpload]').onchange = e => {
            if (e.currentTarget.checked) {
                components.getFileUploadContainer().style.display = 'flex';
                components.getUrlUploadContainer().style.display = 'none';
            }
        };

        components.getFormSubmitBtn().onclick = e => {
            let form = components.getForm(),
                name = form.querySelector('input[name=name]'),
                urlImgType = form.querySelector('input[name=image-type][value=URL]'),
                fileImgType = form.querySelector('input[name=image-type][value=FileUpload]');

            if (urlImgType.checked || fileImgType.checked) {
                    let payload = {
                        name: name.value,
                        imgUrl: urlImgType.checked ? form.querySelector('input[name=url]').value : '',
                        imgFile: urlImgType.checked ? null : form.querySelector('input[name=file]').files[0]
                    };

                    // Clearing the form.
                    name.value = '';
                    form.querySelector('input[name=url]').value = '';

                    document.dispatchEvent(
                        new CustomEvent(events.ON_SUBMIT_NEW_IMAGE, {
                            detail: payload
                        }));
            }
        };

        // Initializing our upload form to have url displayed.
        let urlRadioButton = components.getForm().querySelector('input[name=image-type][value=URL]');

        urlRadioButton.checked = true;
        if (urlRadioButton.checked) {
            components.getFileUploadContainer().style.display = 'none';
            components.getUrlUploadContainer().style.display = 'flex';
        }
    };

    var view = {
        onload: onload,

        open: () => {
            document.getElementById("upload-area").className = "active";
        },
        close: () => {
            document.getElementById("upload-area").className = "";
        },

        // Want to give users a glimpse of what the image
        // is going to look like.
        updatePreviewImage: img => {
            let container = components.getImagePreviewContainer();

            container.innerHTML = `<img src="${img}" alt="image"/>`;
        }
    };

    return view;

} ());