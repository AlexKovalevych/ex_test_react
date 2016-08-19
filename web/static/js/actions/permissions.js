const permissionsActions = {
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
