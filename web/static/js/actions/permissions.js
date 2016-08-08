const permissionsActions = {
    update: (model, type, value) => {
        return (dispatch) => {
            dispatch({
                type: 'UPDATE_PERMISSIONS',
                data: {model, type, value}
            });
        };
    }
};

export default permissionsActions;
