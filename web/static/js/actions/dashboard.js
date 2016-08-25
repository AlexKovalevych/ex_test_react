const dashboardActions = {
    loadStats: (params) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channels['users']
                .push('dashboard_stats', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'DASHBOARD_LOAD_DATA',
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

    loadConsolidatedChart: (params, options) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channels['users']
                .push('consolidated_chart', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'DASHBOARD_LOAD_CONSOLIDATED_CHART_DATA',
                        data: msg,
                        options: options
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

    zoomChart: (params, options) => {
        return (dispatch) => {
            dispatch({
                type: 'DASHBOARD_ZOOM_CHART',
                data: params,
                options: options
            });
        };
    }
};

export default dashboardActions;
