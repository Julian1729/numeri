import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import PrivateRoute from '../components/PrivateRoute';
import DashboardPage from '../components/DashboardPage';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import Wrapper from '../components/Wrapper';
import { logIn, logOut } from '../actions/user.actions';

const AppRouter = ({ loggedIn, ...rest }) => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} exact />
      {/* <Route path="/dashboard" component={DashboardPage} exact /> */}
      <PrivateRoute path="/dashboard" component={DashboardPage} exact />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
