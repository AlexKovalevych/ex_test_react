const initialState = {
    users: null,
    projects: null,
    roles: null,
    type: null,
    value: null,
    selectedLeftRows: []
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'LOAD_USER':
        return {
            ...state,
            users: [action.data.user],
            projects: action.data.projects,
            roles: action.data.roles,
            type: 'user',
            value: action.data.user.id,
            selectedLeftRows: action.data.projects.map((project) => {
                return project.id;
            })
        };
    case 'LOAD_PERMISSIONS':
        return {
            ...state,
            users: action.data.users,
            projects: action.data.projects,
            roles: action.data.roles
        };
    case 'CHANGE_TYPE':
        return {
            ...state,
            type: action.data,
            value: null,
            selectedLeftRows: []
        };
    case 'CHANGE_VALUE':
        return {
            ...state,
            value: action.data,
            selectedLeftRows: []
        };
    case 'SELECT_LEFT_ROWS':
        return {
            ...state,
            selectedLeftRows: action.data
        };
    case 'UPDATE_PERMISSIONS':
        return {
            ...state,
            users: action.data
        };
    default:
        return state;
    }
}
