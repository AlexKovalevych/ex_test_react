import { push } from 'react-router-redux';
import { Socket } from 'phoenix';
import counterpart from 'counterpart';

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

export function setCurrentUser(dispatch, currentUser, qrcodeUrl=null, serverTime=null) {
    dispatch({
        type: 'CURRENT_USER',
        currentUser,
        qrcodeUrl,
        serverTime
    });
}

export function setSocket(dispatch, user, redirectPath) {
    let token = localStorage.getItem('jwtToken');
    const socket = new Socket('/socket', {
        params: {token},
        logger: (kind, msg, data) => {
            console.log(`${kind}: ${msg}`, data);
        }
    });

    socket.connect();

    const channel = socket.channel(`users:${user.id}`);

    if (channel.state != 'joined') {
        channel.join()
            .receive('ok', () => {
                dispatch({
                    type: 'SOCKER_JOINED',
                    socket: socket,
                    channel: channel
                });
                if (redirectPath) {
                    dispatch(push(redirectPath));
                }
            })
            .receive("error", () => {
                dispatch(authActions.logout());
            })
        ;
    }
}

const authActions = {
    login: (params) => {
        return dispatch => {
            const body = JSON.stringify({auth: params});
            return fetch('/api/v1/auth', {
                method: 'post',
                headers: buildHeaders(),
                body: body,
                credentials: 'same-origin'
            })
            .then(checkStatus)
            .then(parseJSON)
            .then(data => {
                if (data.jwt || data.user.authenticationType == 'none') {
                    localStorage.setItem('jwtToken', data.jwt);
                    setCurrentUser(dispatch, data.user);
                    dispatch(push('/'));
                } else {
                    switch (data.user.authenticationType) {
                    case 'google':
                        setCurrentUser(dispatch, data.user, data.url, data.serverTime);
                        break;
                    case 'sms':
                        setCurrentUser(dispatch, data.user);
                        break;
                    }
                }
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

    twoFactor: (code) => {
        return dispatch => {
            return fetch('/api/v1/two_factor', {
                method: 'post',
                headers: buildHeaders(),
                body: JSON.stringify({code}),
                credentials: 'same-origin'
            })
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => {
                localStorage.setItem('jwtToken', data.jwt);
                setSocket(dispatch, data.user, '/');
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

    sendSms: () => {
        return dispatch => {
            return fetch('/api/v1/send_sms', {
                method: 'post',
                headers: buildHeaders(),
                credentials: 'same-origin'
            })
            .then(checkStatus)
            .then(parseJSON)
            .then(() => {
                dispatch({
                    type: 'AUTH_SEND_SMS'
                });
                setTimeout(() => {
                    dispatch({
                        type: 'AUTH_SENT_SMS'
                    });
                }, 4000);
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
        return dispatch => {
            return fetch('/api/v1/auth', {
                headers: buildHeaders(),
                method: 'delete',
                credentials: 'same-origin'
            })
            .then(checkStatus)
            .then(() => {
                dispatch({
                    type: 'AUTH_LOGOUT'
                });
            });
        };
    },

    setLocale: (locale) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('locale', locale)
                .receive('ok', (user) => {
                    counterpart.setLocale(user.locale);
                    dispatch({
                        type: 'CURRENT_USER',
                        currentUser: user
                    });
                })
                .receive('error', (msg) => {
                    dispatch({
                        type: 'SHOW_ERROR',
                        message: msg.reason
                    });
                });
        };
    },

    setDashboardCurrentPeriod: (period) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('dashboard_period', period)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'CURRENT_USER',
                        currentUser: msg,
                        isOutdated: true
                    });
                })
                .receive('error', (msg) => {
                    dispatch({
                        type: 'SHOW_ERROR',
                        message: msg.reason
                    });
                });
        };
    },

    setDashboardComparisonPeriod: (period) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('dashboard_comparison_period', period)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'CURRENT_USER',
                        currentUser: msg,
                        isOutdated: true
                    });
                })
                .receive('error', (msg) => {
                    dispatch({
                        type: 'SHOW_ERROR',
                        message: msg.reason
                    });
                });
        };
    },

    setDashboardSort: (sortBy) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('dashboard_sort', sortBy)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'CURRENT_USER',
                        currentUser: msg
                    });
                })
                .receive('error', (msg) => {
                    dispatch({
                        type: 'SHOW_ERROR',
                        message: msg.reason
                    });
                });
        };
    },

    setDashboardProjectTypes: (type) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('dashboard_projects_type', type)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'CURRENT_USER',
                        currentUser: msg,
                        isOutdated: true
                    });
                })
                .receive('error', (msg) => {
                    dispatch({
                        type: 'SHOW_ERROR',
                        message: msg.reason
                    });
                });
        };
    }
};

export default authActions;
