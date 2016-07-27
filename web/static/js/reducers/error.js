const initialState = {
    message: null,
    isOpened: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'SHOW_ERROR':
        return {
            ...state,
            message: action.message,
            isOpened: true
        };
    case 'HIDE_ERROR':
        return {
            ...state,
            message: null,
            isOpened: false
        };
    default:
        return state;
    }
}
