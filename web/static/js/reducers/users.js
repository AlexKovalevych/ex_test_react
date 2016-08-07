import PermissionsModel from 'models/Permissions';

const initialState = {
    users: null,
    user: null,
    totalPages: null,
    currentPage: 1,
    search: null,
    lastUpdated: null,
    permissions: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'LOAD_USERS':
        return {
            ...state,
            user: null,
            users: action.data.users,
            search: action.data.search,
            currentPage: action.data.currentPage,
            totalPages: action.data.totalPages,
            lastUpdated: action.data.lastUpdated
        };
    case 'LOAD_USER':
        return {
            ...state,
            permissions: new PermissionsModel(
                action.data.user.permissions,
                action.data.projects,
                action.data.permissions
            ),
            user: action.data.user
        };
    case 'UPDATE_PERMISSIONS':
        return {
            ...state,
            permissions: action.data
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
