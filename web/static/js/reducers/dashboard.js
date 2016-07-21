const initialState = {
    periods: null,
    stats: null,
    totals: null,
    charts: null,
    projects: [],
    lastUpdated: null,
    consolidatedChart: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'DASHBOARD_LOAD_DATA':
        return {
            ...state,
            stats: action.data.stats,
            totals: action.data.totals,
            periods: action.data.periods,
            projects: action.data.projects,
            lastUpdated: action.lastUpdated
        };
    case 'DASHBOARD_LOAD_CHART_DATA':
        return {
            ...state,
            charts: action.data
        };
    case 'DASHBOARD_LOAD_CONSOLIDATED_CHART_DATA':
        return {
            ...state,
            consolidatedChart: action.data
        };
    default:
        return state;
    }
}
