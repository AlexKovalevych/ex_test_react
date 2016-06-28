import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';
import { routerMiddleware } from 'react-router-redux';

const devToolsExt = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
    ? window.devToolsExtension()
    : f => f;

export default function configureStore(browserHistory) {
    const reduxRouterMiddleware = routerMiddleware(browserHistory);
    const createStoreWithMiddleware = compose(
        applyMiddleware(reduxRouterMiddleware, thunkMiddleware),
        devToolsExt
    )(createStore);

    return createStoreWithMiddleware(reducers);
}
