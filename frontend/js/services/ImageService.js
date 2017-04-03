var ImageService = (function () {

    return {
        create: payload => {
            let data = new FormData();

            if (payload.imgUrl) {
                data.append('externalPictureRoute', payload.imgUrl);
            } else {
                data.append('imageFile', payload.imgFile);
            }
            data.append('name', payload.name);

            return fetch(new Request(`./api/images/`, {
                method: 'POST',
                credentials: 'same-origin',
                body: data
            }))
                .then(response => response.json())
                .then(payload => {
                    if (!payload.success) return Promise.reject();

                    return new Image(payload.data);
                })
                .catch(Promise.reject);
        },
        read: (imageId, store) => {
            if (!imageId) return Promise.reject();
            if (store.getState().images[imageId]) return Promise.resolve(store.getState().images[imageId]); // if cached load it.

            return fetch(new Request('./api/images/' + imageId, {
                method: 'GET',
                credentials: 'same-origin',
            }))
                .then(response => response.json())
                .then(payload => {
                    if (!payload.success) return Promise.reject();

                    return new Image(payload.data);
                })
                .catch(Promise.reject);
        },
        remove: (imageId, store) => {
            store.purgeImage(imageId);

            return fetch(new Request(`./api/images/` + imageId, {
                method: 'DELETE',
                credentials: 'same-origin',
            }))
                .then(response => response.json())
                .then(payload => {
                    if (!payload.success) return Promise.reject();

                    return payload.data;
                })
                .catch(Promise.reject);
        }
    };
}());