const initialState = {
    isAuthenticated: false,
    login_failed: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'AUTH_LOGIN_ERROR':
        return {
            ...state,
            login_failed: action.value
        };
    default:
        return state;
    }
}
