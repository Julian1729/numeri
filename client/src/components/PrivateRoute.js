import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';
import ClaimCircuit from './ClaimCircuit';

const PrivateRoute = ({ component: Component, loggedIn, circuit, ...rest }) => (

  <Route {...rest}
    render={
      () => {
        if(loggedIn !== true){
          // redirect to login page
          return <Redirect to="/" />
        }
        if(circuit === null){
          return <ClaimCircuit referrerComponent={Component} />;
        }
        return <Component {...rest} />
      }
    } />

)

const mapStateToProps = state => (
  {
    loggedIn: state.user.loggedIn,
    circuit: state.user.circuit,
  }
)

export default connect(mapStateToProps)(PrivateRoute);
