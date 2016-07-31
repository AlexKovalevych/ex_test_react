const initialState = {
    users: null,
    totalPages: null,
    currentPage: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case 'LOAD_USERS':
        return {
            ...state,
            users: action.data
        };
    default:
        return state;
    }
}
