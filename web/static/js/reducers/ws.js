const initialState = {
    socket: null,
    channel: null
    // channels: {}
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'CURRENT_USER':
        let newState = state;
        if (action.socket !== undefined) {
            newState.socket = action.socket;
        }
        if (action.channel !== undefined) {
            newState.channel = action.channel;
        }
        return newState;
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
