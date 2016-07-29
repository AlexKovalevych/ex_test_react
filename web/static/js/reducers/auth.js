import setHighchartsLocale from 'managers/HighchartsManager';

const initialState = {
    user: null,
    qrcodeUrl: null,
    error: null,
    smsSent: null
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
    case 'AUTH_SEND_SMS':
        return {
            ...state,
            'smsSent': true
        };
    case 'AUTH_SENT_SMS':
        return {
            ...state,
            smsSent: null
        };
    case 'AUTH_LOGOUT':
        localStorage.removeItem('jwtToken');
        window.location = '/login';
        return {...state};
    default:
        return state;
    }
}
