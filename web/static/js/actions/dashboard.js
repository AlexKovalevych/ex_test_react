const dashboardActions = {
    load: (params) => {
        return (dispatch, getState) => {
            const { auth } = getState();
            auth.channel
                .push('dashboard', params)
                .receive('ok', (msg) => {
                    console.log(msg);
                })
                .receive('error', (msg) => {
                    console.log(msg);
                });
        };
    }
};

export default dashboardActions;
