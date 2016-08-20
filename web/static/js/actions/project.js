import translate from 'counterpart';

const projectActions = {
    loadProjects: (params) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('projects', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'LOAD_PROJECTS',
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

    loadProject: (id) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('project', id)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'LOAD_PROJECT',
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

    updateProject: (id, project) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('project', {id, project})
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'UPDATE_PROJECT',
                        data: msg
                    });
                    if (!msg.errors) {
                        dispatch({
                            type: 'SHOW_ERROR',
                            message: translate('project.was_updated')
                        });
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

    setSearch: (search) => {
        return (dispatch) => {
            dispatch({
                type: 'SET_SEARCH',
                search: search
            });
        };
    }
};

export default projectActions;
