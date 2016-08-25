import translate from 'counterpart';
import {push} from 'react-router-redux';

const userActions = {
    loadUsers: (params) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channels['admins']
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
            ws.channels['admins']
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

    updateUser: (id, user) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channels['admins']
                .push('user', {id, user})
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'UPDATE_USER',
                        data: msg
                    });
                    if (!msg.errors) {
                        let message = 'user.was_updated';
                        if (!id) {
                            message = 'user.was_created';
                        }
                        dispatch({
                            type: 'SHOW_ERROR',
                            message: translate(message)
                        });
                        if (!id) {
                            dispatch(push(`/settings/user/edit/${msg.user.id}`));
                        }
                    }
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
