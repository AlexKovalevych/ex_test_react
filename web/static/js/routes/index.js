import React from 'react';
import { IndexRoute, Route } from 'react-router';
import AppContainer from '../containers/App';
import Timeline from '../containers/TimelineReport';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import ErrorPage from '../components/ErrorPage';
import GtMenu from '../containers/GtMenu';

export default (
    <Route path="/" component={AppContainer}>
        <IndexRoute components={{menu: GtMenu, main: Dashboard}} />

        <Route path="/dashboard/dashboard_index" components={{menu: GtMenu, main: Dashboard}} />
        <Route path="/statistics">
            <Route path="/statistics/timeline_report" components={{menu: GtMenu, main: Timeline}} />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="*" component={ErrorPage} />
    </Route>
);
