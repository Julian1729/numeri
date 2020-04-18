import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import DashboardPage from '../components/DashboardPage';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import VisitsPage from '../components/VisitsPage';
import VisitPage from '../components/VisitPage';
import CongregationsPage from '../components/CongregationsPage';
import CongregationPage from '../components/CongregationPage';
import SettingsPage from '../components/SettingsPage';

const AppRouter = ({ loggedIn, ...rest }) => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} exact />
      {/* <Route path="/dashboard" component={DashboardPage} exact /> */}
      <PrivateRoute path="/dashboard" component={DashboardPage} exact />
      <PrivateRoute path="/visits" component={VisitsPage} exact />
      <PrivateRoute path="/congregations" component={CongregationsPage} exact />
      <PrivateRoute path="/visits/:visitId" component={VisitPage} exact />
      <PrivateRoute
        path="/congregations/:congregationId"
        component={CongregationPage}
        exact
      />
      <PrivateRoute path="/settings" component={SettingsPage} exact />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
