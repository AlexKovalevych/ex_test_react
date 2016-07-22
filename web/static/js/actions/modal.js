const modalActions = {
    closeModal: () => {
        return (dispatch) => {
            dispatch({
                type: 'MODAL_CLOSE'
            });
        };
    }
};

export default modalActions;
