import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import DashboardSwitch from '../components/DashboardSwitch';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} exact />
      <PrivateRoute path="/dashboard" component={DashboardSwitch} exact />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
