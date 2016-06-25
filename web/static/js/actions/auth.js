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
                    localStorage.setItem('jwtToken', msg.token);
                    window.location = '/';
                })
                .receive('error', (msg) => {
                    dispatch({
                        type: 'AUTH_LOGIN_ERROR',
                        value: true,
                        message: msg
                    });
                });
        };
    }
};

export default authActions;
