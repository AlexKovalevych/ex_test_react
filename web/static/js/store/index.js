import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';
import { routerMiddleware } from 'react-router-redux';

const devToolsExtension = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
    ? window.devToolsExtension()
    : f => f;

export default function configureStore(initialState, history = {}) {
    const reduxRouterMiddleware = routerMiddleware(history);
    return createStore(
        reducers,
        initialState,
        compose(applyMiddleware(reduxRouterMiddleware, thunkMiddleware), devToolsExtension)
    );
}
