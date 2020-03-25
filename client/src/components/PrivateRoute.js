import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, loggedIn, ...rest }) => (
  <Route
    {...rest}
    render={() => {
      if (loggedIn !== true) {
        // redirect to login page
        return <Redirect to="/" />;
      }
      return <Component {...rest} />;
    }}
  />
);

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
});

export default connect(mapStateToProps)(PrivateRoute);
