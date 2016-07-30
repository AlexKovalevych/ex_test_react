import React from 'react';
import { IndexRoute, Route } from 'react-router';
import AppContainer from '../containers/App';
import Timeline from '../containers/TimelineReport';
import Dashboard from '../containers/Dashboard';
import Login from '../containers/Login';
import ErrorPage from '../components/ErrorPage';
import GtMenu from '../containers/GtMenu';
import { setCurrentUser, setSocket } from '../actions/auth';
import Main from '../containers/main';
import counterpart from 'counterpart';

export default function configRoutes(store) {
    const _ensureAuthenticated = (nextState, replace, callback) => {
        const { dispatch } = store;
        const { auth } = store.getState();
        const { user } = auth;

        if (typeof window !== 'undefined') {
            if (!user || !localStorage.getItem('jwtToken')) {
                replace('/login');
            } if (user) {
                setCurrentUser(dispatch, user);
                setSocket(dispatch, user);
                counterpart.setLocale(user.locale);
            }
        }

        callback();
    };

    return (
        <Route component={Main}>
            <Route path="/login" component={Login} />

            <Route path="/" component={AppContainer} onEnter={_ensureAuthenticated}>
                <IndexRoute components={{menu: GtMenu, main: Dashboard}} />

                <Route path="/statistics">
                    <Route path="/statistics/timeline_report" components={{menu: GtMenu, main: Timeline}} />
                </Route>
            </Route>

            <Route path="*" component={ErrorPage} />
        </Route>
    );
}
