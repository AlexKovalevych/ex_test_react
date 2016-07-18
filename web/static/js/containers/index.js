import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, RouterContext, browserHistory, createMemoryHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../store';
import configRoutes from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'translations';

export default class Index extends React.Component {
    static propTypes = {
        initial_state: PropTypes.object,
        location: PropTypes.object,
        user_agent: PropTypes.string
    };

    render() {
        let initialState, history, router, store;
        let themeProps = {};
        injectTapEventPlugin();
        if (typeof window === 'undefined') {
            initialState = this.props.initial_state;
            themeProps.muiTheme = getMuiTheme({userAgent: this.props.user_agent});
            store = configureStore(initialState);
            history = createMemoryHistory();
            let routes = configRoutes(store);
            match({routes , location: this.props.location, history }, (err, redirect, props) => {
                if (props) {
                    router = (<RouterContext { ...props } />);
                }
                // Since it's a very basic app, we don't handle any errors, however in real app you will have do this.
                // Please, refer to https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
                // to find more relevant information.
            });
        } else {
            initialState = window.__INITIAL_STATE__;
            store = configureStore(initialState.initial_state, browserHistory);
            const history = syncHistoryWithStore(browserHistory, store);

            router = (
                <Router history={history}>
                    {configRoutes(store)}
                </Router>
            );
        }

        return (
            <Provider store={store}>
                <MuiThemeProvider {...themeProps}>
                    {router}
                </MuiThemeProvider>
            </Provider>
        );
    }
}
