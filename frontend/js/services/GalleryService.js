var GalleryService = (function () {

    let rejectIfFail = response => {
        if (!response.success) {
            return Promise.reject(response.message);
        } else {
            return response;
        }
    };

    return {
        getGalleries: page => {
            return fetch(new Request('./api/users?page='+page+'&limit=5', {
                method: 'GET',
                credentials: 'same-origin'
            }))
                .then(response => response.json())
                .then(rejectIfFail)
                .then(response => {
                    return Object.assign({}, response, {
                        data: response.data.map(record => Object.assign({}, record, {
                            coverImage: record.coverImage ? new Image(record.coverImage) : null
                        }))
                    });
                })
                .catch(Promise.reject);
        }
    };
}());