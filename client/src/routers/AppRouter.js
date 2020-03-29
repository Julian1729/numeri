import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import DashboardPage from '../components/DashboardPage';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import Wrapper from '../components/Wrapper';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} exact />
      <Route path="/dashboard" component={DashboardPage} exact />
      {/* <PrivateRoute path="/dashboard" component={Dashboard} exact /> */}
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
