const authActions = {
    login: (params) => {
        return (dispatch, getState) => {
            const {ws} = getState();
            ws.channels.auth
                .push('login', params)
                .receive('ok', (msg) => {
                    localStorage.setItem('jwtToken', msg.token);
                    localStorage.setItem('user', JSON.stringify(msg.user));
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
