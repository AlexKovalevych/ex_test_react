const initialState = {
    stats: null,
    charts: null,
    projects: [],
    lastUpdated: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'DASHBOARD_LOAD_DATA':
        return {
            ...state,
            stats: action.data.stats,
            projects: action.data.projects,
            lastUpdated: action.lastUpdated
        };
    case 'DASHBOARD_LOAD_CHARTS':
        return {
            ...state,
            charts: action.data
        };
    default:
        return state;
    }
}
