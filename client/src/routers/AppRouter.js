import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import ExampleLoginPage from '../components/ExampleLoginPage';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} exact />
      <Route path="/xlogin" component={ExampleLoginPage} exact />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
