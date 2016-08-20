const initialState = {
    projects: null,
    project: null,
    totalPages: null,
    currentPage: 1,
    search: null,
    lastUpdated: null,
    errors: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'LOAD_PROJECTS':
        return {
            ...state,
            project: null,
            projects: action.data.projects,
            search: action.data.search,
            currentPage: action.data.currentPage,
            totalPages: action.data.totalPages,
            lastUpdated: action.data.lastUpdated,
            errors: null
        };
    case 'LOAD_PROJECT':
        return {
            ...state,
            project: action.data.project,
            errors: null
        };
    case 'UPDATE_PROJECT':
        return {
            ...state,
            project: action.data.project,
            errors: action.data.errors
        };
    case 'SET_SEARCH':
        return {
            ...state,
            search: action.search
        };
    default:
        return state;
    }
}
