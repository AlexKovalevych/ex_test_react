const dashboardActions = {
    load: (params) => {
        return (dispatch, getState) => {
            const { auth } = getState();
            auth.channel
                .push('dashboard', params)
                .receive('ok', (msg) => {
                    dispatch({
                        type: 'DASHBOARD_LOAD_DATA',
                        stats: msg,
                        lastUpdated: Date.now()
                    });
                })
                .receive('error', (msg) => {
                    console.log(msg);
                });
        };
    }
};

export default dashboardActions;
