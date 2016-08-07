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
    },

    loadUser: (id) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('user', id)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'LOAD_USER',
                        data: msg
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

    updatePermissions: (permissionsModel) => {
        return (dispatch) => {
            dispatch({
                type: 'UPDATE_PERMISSIONS',
                data: permissionsModel
            });
        };
    },

    setSearch: (search) => {
        return (dispatch) => {
            dispatch({
                type: 'SET_SEARCH',
                search: search
            });
        };
    }
};

export default userActions;
