import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import dashboard from './dashboard';
import ws from './ws';
import menu from './menu';
import modal from './modal';
import { pendingTasksReducer as pendingTasks } from './spinner';

export default combineReducers({
    routing: routerReducer,
    pendingTasks,
    menu,
    auth,
    modal,
    dashboard,
    ws
});
