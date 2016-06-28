import { push } from 'react-router-redux';

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

function buildHeaders() {
    const authToken = localStorage.getItem('jwtToken');
    return { ...defaultHeaders, Authorization: authToken };
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}

const authActions = {
    login: (params) => {
        return dispatch => {
            const body = JSON.stringify({auth: params});

            return fetch('/api/v1/auth', {
                method: 'post',
                headers: buildHeaders(),
                body: body
            })
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => {
                localStorage.setItem('jwtToken', data.jwt);
                setCurrentUser(dispatch, data.user);
                dispatch(push('/'));
            })
            .catch((error) => {
                error.response.json()
                .then((errorJSON) => {
                    dispatch({
                        type: 'AUTH_LOGIN_ERROR',
                        error: errorJSON.error
                    });
                });
            });
        };
    },

    logout: () => {
        return () => {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            window.location = '/';
        };
    },

    currentUser: () => {
        return dispatch => {
            return fetch('/api/v1/current_user', {
                headers: buildHeaders()
            })
            .then(checkStatus)
            .then(parseJSON)
            .then(function (data) {
                setCurrentUser(dispatch, data);
            })
            .catch(function (error) {
                console.log(error);
                dispatch(push('/login'));
            });
        };
    }
};

export default authActions;
