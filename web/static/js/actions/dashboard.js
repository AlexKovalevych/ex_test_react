const dashboardActions = {
    loadStats: (params) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('dashboard_stats', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'DASHBOARD_LOAD_DATA',
                        data: msg,
                        lastUpdated: Date.now()
                    });
                })
                .receive('error', (msg) => {
                    console.log(msg);
                });
        };
    },

    // loadCharts: () => {
    //     return (dispatch, getState) => {
    //         const { ws } = getState();
    //         ws.channel
    //             .push('dashboard_charts')
    //             .receive('ok', (msg) => {
    //                 dispatch({
    //                     type: 'DASHBOARD_LOAD_CHART_DATA',
    //                     data: msg
    //                 });
    //             })
    //             .receive('error', (msg) => {
    //                 console.log(msg);
    //             });
    //     };
    // },

    loadConsolidatedChart: (params, options) => {
        return (dispatch, getState) => {
            const { ws } = getState();
            ws.channel
                .push('consolidated_chart', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'DASHBOARD_LOAD_CONSOLIDATED_CHART_DATA',
                        data: msg,
                        options: options
                    });
                })
                .receive('error', (msg) => {
                    console.log(msg);
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
