import setHighchartsLocale from 'managers/HighchartsManager';

const initialState = {
    user: null,
    qrcodeUrl: null,
    error: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'CURRENT_USER':
        setHighchartsLocale();
        return {
            ...state,
            user: action.currentUser,
            qrcodeUrl: action.qrcodeUrl,
            error: null
        };
    case 'AUTH_LOGIN_ERROR':
        return {
            ...state,
            error: action.error
        };
    case 'AUTH_LOGOUT':
        return initialState;
    default:
        return state;
    }
}
