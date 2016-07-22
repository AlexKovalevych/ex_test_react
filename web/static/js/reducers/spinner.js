const pendingTask = '@@__rrs_pendingTask__@@';
const begin = '@@__rrs_begin__@@';
const end = '@__rrs_end__@@';

const reducer = (state = 0, action) => {
    if (action[pendingTask] === begin) {
        return state + 1;
    }
    if (action[pendingTask] === end && state > 0) {
        return state - 1;
    }
    return state;
};

export { pendingTask, begin, end, reducer as pendingTasksReducer };
