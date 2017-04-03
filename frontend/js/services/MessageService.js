var MessageService = (function () {

    return {
        create: (imageId, payload) => {
            return fetch(`./api/images/${imageId}/messages`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',
                    method: 'POST',
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(payload => {
                    if (!payload.success) return Promise.reject();

                    return new Message(payload.data);
                })
                .catch(Promise.reject);
        },
        read: (imageId, page) => {
            return fetch(`./api/images/${imageId}/messages?page=${page}`, {
                credentials: 'same-origin'
            })
                .then(response => response.json())
                .then(payload => {
                    if (!payload.success) return Promise.reject();

                    return {
                        messages: payload.data.map(payload => new Message(payload)),
                        totalPages: payload.totalPages,
                        totalRecords: payload.totalRecords
                    };
                })
                .catch(Promise.reject);
        },
        remove: (imageId, messageId) => {
            return fetch(`./api/images/${imageId}/messages/${messageId}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            })
                .then(response => response.json())
                .then(payload => {
                    if (!payload.success) return Promise.reject();

                    return true;
                })
                .catch(Promise.reject);
        }
    };
}());