const processToken = (token) => {
    window.location = '/?token=' + token;
};

const authActions = {
    login: (params) => {
        return (dispatch, getState) => {
            dispatch({
                type: 'AUTH_LOGIN_ERROR',
                value: false
            });
            const {ws} = getState();
            ws.channels.auth
                .push('login', params)
                .receive('ok', (msg) => {
                    processToken(msg.token);
                })
                .receive('error', () => {
                    dispatch({
                        type: 'AUTH_LOGIN_ERROR',
                        value: true
                    });
                });
        };
    }
};

export default authActions;
