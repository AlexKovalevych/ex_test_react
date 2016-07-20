const initialState = {
    show: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'TOGGLE_MENU':
        return {
            ...state,
            show: action.data
        };
    default:
        return state;
    }
}
