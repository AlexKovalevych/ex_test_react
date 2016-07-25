const initialState = {
    isOpened: false,
    options: null,
    consolidatedChart: null,
    zoomChart: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'MODAL_CLOSE':
        return initialState;
    case 'DASHBOARD_LOAD_CONSOLIDATED_CHART_DATA':
        return {
            ...state,
            consolidatedChart: action.data,
            options: action.options,
            isOpened: true
        };
    case 'DASHBOARD_ZOOM_CHART':
        return {
            ...state,
            zoomChart: action.data,
            options: action.options,
            isOpened: true
        };
    default:
        return state;
    }
}
