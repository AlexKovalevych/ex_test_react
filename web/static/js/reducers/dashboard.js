const initialState = {
    periods: null,
    stats: null,
    totals: null,
    charts: null,
    projects: [],
    lastUpdated: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'CURRENT_USER':
        let newState = {...state};
        if (action.lastUpdated !== undefined) {
            newState.lastUpdated = action.lastUpdated;
        }
        return newState;
    case 'DASHBOARD_LOAD_DATA':
        return {
            ...state,
            stats: action.data.stats,
            totals: action.data.totals,
            charts: action.data.charts,
            periods: action.data.periods,
            projects: action.data.projects,
            lastUpdated: action.lastUpdated
        };
    case 'DASHBOARD_LOAD_CHART_DATA':
        return {
            ...state,
            charts: action.data
        };
    default:
        return state;
    }
}
