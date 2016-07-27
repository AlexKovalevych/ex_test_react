const errorActions = {
    show: (message) => {
        return (dispatch) => {
            dispatch({
                type: 'SHOW_ERROR',
                message: message
            });
        };
    },

    hide: () => {
        return (dispatch) => {
            dispatch({
                type: 'HIDE_ERROR'
            });
        };
    }
};

export default errorActions;
