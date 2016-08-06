import React from 'react';
import { IndexRoute, Route } from 'react-router';
import AppContainer from 'containers/App';
import Timeline from 'containers/TimelineReport';
import Dashboard from 'containers/Dashboard';
import Login from 'containers/Login';
import ErrorPage from 'components/ErrorPage';
import { setCurrentUser, setSocket } from 'actions/auth';
import Main from 'containers/main';
import GtMenu from 'containers/GtMenu';
import counterpart from 'counterpart';
import UserList from 'containers/User/List';
import UserEdit from 'containers/User/Edit';

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
            }
        }

        if (user) {
            counterpart.setLocale(user.locale);
        }
        callback();
    };

    const getComponents = (main) => {
        let menu = GtMenu;
        return {menu, main};
    };

    return (
        <Route component={Main}>
            <Route path="/login" component={Login} />

            <Route name="app" path="/" component={AppContainer} onEnter={_ensureAuthenticated}>
                <IndexRoute name="dashboard" components={getComponents(Dashboard)} />

                <Route path="/statistics/timeline_report" components={getComponents(Timeline)} />

                <Route path="/settings">
                    <Route path="/user">
                        <Route path="/settings/user/list" components={getComponents(UserList)}></Route>
                        <Route path="/settings/user/create" components={getComponents(UserEdit)}></Route>
                        <Route path="/settings/user/edit/:id" components={getComponents(UserEdit)}></Route>
                    </Route>
                </Route>

            </Route>

            <Route path="*" component={ErrorPage} />
        </Route>
    );
}
