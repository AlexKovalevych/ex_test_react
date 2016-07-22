import {pendingTask, begin, end} from 'reducers/spinner';

const spinnerActions = {
    start: () => {
        return (dispatch) => {
            dispatch({
                type: 'START_LOAD',
                [ pendingTask ]: begin
            });
        };
    },

    stop: () => {
        return (dispatch) => {
            dispatch({
                type: 'STOP_LOAD',
                [ pendingTask ]: end
            });
        };
    }
};

export default spinnerActions;
