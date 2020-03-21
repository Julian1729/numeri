import React, { useReducer } from 'react';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as HttpStatusCodes from 'http-status-codes';
import _ from 'lodash';
import { connect } from 'react-redux';

import { logIn } from '../actions/user.actions';
import loginValidator from '../validators/login.validator';

const initialState = {

  invalidCredentials: false,
  redirect: null,
  formErrors: {email: [], password: []},

}

const reducer = (state, action) => {

  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'SET_FORM_ERRORS':
      return {...state, formErrors: action.value};
    case 'REDIRECT':
      return {...state, redirect: action.value};
    case 'INVALID_CREDENTIALS':
      return {...state, invalidCredentials: true};
    default:
      console.log(`Unrecognized action ${action.type}`);
  }

}


const LoginPage = ({ logInUser }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const attemptAuthorization = e => {

    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    dispatch({ type: 'RESET' });

    // validate form
    const validationErrors = loginValidator({email, password});

    if(validationErrors){
      // console.log('ve', JSON.stringify(validationErrors,null,2));
      return dispatch({ type: 'SET_FORM_ERRORS', value: validationErrors })
    }

    // send to api and authenticate
    axios.post('/api/login', {email, password})
      .then(({ data }) => {

        console.log(data);
        if(data.redirect){
          logInUser(data.id, data.circuit);
          dispatch({ type: 'REDIRECT', value: data.redirect });
        }

      })
      .catch(e => {

        // invalid credentials
        if(e.response.status === HttpStatusCodes.UNAUTHORIZED){
          dispatch({ type: 'INVALID_CREDENTIALS', value: true });
        }

      })

  };

  return (
    <Container component="main" maxWidth="xs">
        {state.redirect && <Redirect to={state.redirect} />}
        <Typography component="h1" variant="h5">
          Numeri
        </Typography>
        {state.invalidCredentials &&
          <p>Invalid Credentials</p>
        }
        <form noValidate onSubmit={attemptAuthorization}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={state.invalidCredentials || !_.isEmpty(state.formErrors.email)}
            helperText={state.formErrors.email ? state.formErrors.email.join(', ') : ''}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={state.invalidCredentials || !_.isEmpty(state.formErrors.email)}
            helperText={state.formErrors.password ? state.formErrors.password.join(', ') : ''}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">Have a referral code? Sign Up</Link>
            </Grid>
          </Grid>
        </form>
    </Container>
  );
}

const mapStateToProps = state => (
  {
    user: state.user
  }
);

const mapDispatchToProps = dispatch => (
  {
    logInUser: (id, circuit) => dispatch(logIn(id, circuit)),
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
