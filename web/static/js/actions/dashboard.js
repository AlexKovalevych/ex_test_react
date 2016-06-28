const DashboardActions = {
    load: (params) => {
        return (dispatch, getState) => {
            const {ws} = getState();
            ws.channels.auth
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

export default DashboardActions;
