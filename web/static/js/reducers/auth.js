import setHighchartsLocale from 'managers/HighchartsManager';

const initialState = {
    user: null,
    socket: null,
    channel: null,
    error: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'CURRENT_USER':
        setHighchartsLocale();
        return {
            ...state,
            user: action.currentUser,
            socket: action.socket,
            channel: action.channel,
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
