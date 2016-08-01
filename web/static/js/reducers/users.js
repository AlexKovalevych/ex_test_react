const initialState = {
    users: null,
    totalPages: null,
    currentPage: null,
    search: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'LOAD_USERS':
        return {
            ...state,
            users: action.data.users,
            currentPage: action.data.page,
            totalPages: action.data.totalPages
        };
    default:
        return state;
    }
}
