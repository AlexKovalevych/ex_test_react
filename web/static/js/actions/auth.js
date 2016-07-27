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

export function setCurrentUser(dispatch, user, redirectPath) {
    const socket = new Socket('/socket', {
        params: { token: localStorage.getItem('jwtToken') },
        logger: (kind, msg, data) => {
            console.log(`${kind}: ${msg}`, data);
        }
    });

    socket.connect();

    const channel = socket.channel(`users:${user.id}`);

    if (channel.state != 'joined') {
        channel.join().receive('ok', () => {
            dispatch({
                type: 'CURRENT_USER',
                currentUser: user,
                socket: socket,
                channel: channel
            });
            if (redirectPath) {
                dispatch(push(redirectPath));
            }
        });
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
            .then((data) => {
                localStorage.setItem('jwtToken', data.jwt);
                setCurrentUser(dispatch, data.user, '/');
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
                localStorage.removeItem('jwtToken');
                dispatch(push('/login'));
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
