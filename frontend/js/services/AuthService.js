var AuthService = (function () {

    let rejectIfFail = response => {
        if (!response.success) {
            return Promise.reject(response.message);
        } else {
            return response;
        }
    };

    return {
        signin: payload => {
            return fetch(new Request('./api/auth/signin', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                method: 'POST',
                body: JSON.stringify(payload)
            }))
                .then(response => response.json())
                .then(rejectIfFail)
                .catch(Promise.reject);
        },
        signup: payload => {
            return fetch(new Request('./api/users', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(payload)
            }))
                .then(response => response.json())
                .then(rejectIfFail)
                .catch(msg => Promise.reject(msg));
        },
        signout: () => {
            return fetch(new Request('./api/auth/signout', {
                method: 'GET',
                credentials: 'same-origin'
            }))
                .catch(msg => Promise.reject(msg));
        }
    };
}());