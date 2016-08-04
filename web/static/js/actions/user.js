const userActions = {
    loadUsers: (params) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('users', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'LOAD_USERS',
                        data: msg,
                        lastUpdated: Date.now()
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

export default userActions;