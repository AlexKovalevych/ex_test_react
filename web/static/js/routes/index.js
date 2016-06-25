import React from 'react';
import { IndexRoute, Route } from 'react-router';
import AppContainer from '../containers/App';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';

export default (
    <Route path="/" component={AppContainer}>
        <IndexRoute component={Dashboard} />

        <Route path="/login" component={Login} />
    </Route>
);
