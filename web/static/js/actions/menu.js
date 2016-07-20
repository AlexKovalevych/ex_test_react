const indexActions = {
    toggle: () => {
        return (dispatch, getState) => {
            const { menu } = getState();
            dispatch({
                type: 'TOGGLE_MENU',
                data: !menu.show
            });
        };
    }
};

export default indexActions;
