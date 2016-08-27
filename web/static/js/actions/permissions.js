const permissionsActions = {
    load: () => {
        return (dispatch, getState) => {
            const {ws} = getState();
            ws.channels['admins']
                .push('permissions')
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'LOAD_PERMISSIONS',
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

    update: (newPermissions) => {
        return (dispatch) => {
            dispatch({
                type: 'UPDATE_PERMISSIONS',
                data: newPermissions
            });
        };
    },

    selectLeftRows: (rows) => {
        return (dispatch) => {
            dispatch({
                type: 'SELECT_LEFT_ROWS',
                data: rows
            });
        };
    }
};

export default permissionsActions;
