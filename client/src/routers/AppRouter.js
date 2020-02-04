import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LoginPage from '../components/LoginPage';
import ExampleLoginPage from '../components/ExampleLoginPage';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={LoginPage} exact />
      <Route path="/xlogin" component={ExampleLoginPage} exact />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
