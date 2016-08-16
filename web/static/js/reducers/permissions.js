// import PermissionsModel from 'models/Permissions';

const initialState = {
    users: null,
    projects: null,
    roles: null,
    type: null,
    value: null,
    selectedLeftRows: null,
    selectedRightRows: null
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
    case 'SELECT_LEFT_ROWS':
        return {
            ...state,
            selectedLeftRows: action.data
        };
    case 'UPDATE_PERMISSIONS':
        return {
            ...state,
            model: action.data.model,
            type: action.data.type,
            value: action.data.value
        };
    default:
        return state;
    }
}
