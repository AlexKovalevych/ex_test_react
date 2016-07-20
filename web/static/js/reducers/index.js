import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import dashboard from './dashboard';
import ws from './ws';
import menu from './menu';

export default combineReducers({
    routing: routerReducer,
    menu,
    auth,
    dashboard,
    ws
});
