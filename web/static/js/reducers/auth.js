const initialState = {
    isAuthenticated: false,
    loginFailed: false,
    loginError: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'AUTH_LOGIN_ERROR':
        return {
            ...state,
            loginFailed: action.value,
            loginError: action.message
        };
    default:
        return state;
    }
}
