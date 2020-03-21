import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../components/Dashboard';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import ExampleLoginPage from '../components/ExampleLoginPage';

import ClaimCircuit from '../components/ClaimCircuit';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/claim" component={ClaimCircuit} exact />
      <Route path="/register" component={RegisterPage} exact />
      <PrivateRoute path="/dashboard" component={Dashboard} exact />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
