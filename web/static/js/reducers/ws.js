const initialState = {
    socket: null,
    channel: null
    // channels: {}
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'SOCKER_JOINED':
        return {
            ...state,
            socket: action.socket,
            channel: action.channel
        };
    case 'CHANNEL_JOINED':
        return {
            ...state,
            channels: {
                ...state.channels,
                [action.name]: action.channel
            }
        };
    default:
        return state;
    }
}
