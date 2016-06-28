const initialState = {
    stats: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'DASHBOARD_LOAD_DATA':
        return {
            ...state,
            stats: action.stats
        };
    default:
        return state;
    }
}
