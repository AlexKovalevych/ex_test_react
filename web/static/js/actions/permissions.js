const permissionsActions = {
    update: (model, type, value) => {
        return (dispatch) => {
            dispatch({
                type: 'UPDATE_PERMISSIONS',
                data: {model, type, value}
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
