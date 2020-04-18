import React, { useReducer } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import FormHelperText from '@material-ui/core/FormHelperText';
import _ from 'lodash';
import axios from 'axios';

import registrationValidator from '../validators/registration.validator';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: '#f44336',
  },
}));

const initialState = {
  errors: {
    formErrors: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
      confirmCO: '',
    },
    insecurePassword: false,
    invalidReferral: false,
    emailExists: '',
  },
  redirect: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM_ERRORS':
      // flatten error message arrays into string
      let formErrors = {};
      _.forOwn(action.value, (errors, name) => {
        formErrors[name] = errors.join(', ');
      });
      return { ...state, errors: { ...state.errors, formErrors } };
    case 'RESET_FORM_ERRORS':
      return { ...state, errors: { ...initialState.errors } };
    case 'SET_INSECURE_PASSWORD':
      return { ...state, errors: { ...state.errors, insecurePassword: true } };
    case 'SET_INVALID_REFERRAL_CODE':
      return { ...state, errors: { ...state.errors, invalidReferral: true } };
    case 'SET_EMAIL_ALREADY_EXISTS':
      return {
        ...state,
        errors: { ...state.errors, emailExists: 'Email already registered' },
      };
    case 'REDIRECT':
      return { ...state, redirect: action.value };
    default:
      return console.log(`Unrecognized action ${action.type}`);
  }
};

export default function SignUp() {
  const classes = useStyles();

  const [state, dispatch] = useReducer(reducer, initialState);

  const attemptRegistration = e => {
    e.preventDefault();

    dispatch({ type: 'RESET_FORM_ERRORS' });

    const formData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
      referralCode: e.target.referralCode.value,
      confirmCO: e.target.confirmCO.checked ? true : '',
    };

    // validate data
    const validationErrors = registrationValidator(formData);

    if (validationErrors) {
      return dispatch({ type: 'SET_FORM_ERRORS', value: validationErrors });
    }

    const { firstName, lastName, email, password, referralCode } = formData;

    axios
      .post('/api/register', {
        firstName,
        lastName,
        email,
        password,
        referralCode,
      })
      .then(({ data }) => {
        if (!data.success) {
          switch (data.error.type) {
            case 'INSECURE_PASSWORD':
              return dispatch({ type: 'SET_INSECURE_PASSWORD' });
            case 'INVALID_REFERRAL_CODE':
              return dispatch({ type: 'SET_INVALID_REFERRAL_CODE' });
            case 'EMAIL_ALREADY_EXISTS':
              return dispatch({ type: 'SET_EMAIL_ALREADY_EXISTS' });
            default:
              return console.log(
                `Unrecognized error returned by API: ${JSON.stringify(
                  data.error,
                  null,
                  2
                )}`
              );
          }
        }

        if (data.redirect) {
          return dispatch({ type: 'REDIRECT', value: data.redirect });
        }
      })
      .catch(e => {
        console.error(e.stack);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      {state.redirect && <Redirect to={state.redirect} />}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form
          className={classes.form}
          onSubmit={attemptRegistration}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!_.isEmpty(state.errors.formErrors.firstName)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={!_.isEmpty(state.errors.formErrors.lastName)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={
                  !_.isEmpty(state.errors.formErrors.email) ||
                  state.errors.emailExists !== ''
                }
                helperText={
                  state.errors.formErrors.email || state.errors.emailExists
                }
              />
              <FormHelperText>
                Please use your personal email, not your jwpub.org email.
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={
                  !_.isEmpty(state.errors.formErrors.password) ||
                  state.errors.insecurePassword
                }
              />
              <FormHelperText
                className={state.errors.insecurePassword ? classes.error : ''}
              >
                {`Password must 8 characters or longer, and
                contain at least 1 uppercase letter,
                at least 1 special character (@#$%^&*(),.?":{}|<>),
                and at least 1 number.`}
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Re-type Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                error={!_.isEmpty(state.errors.formErrors.confirmPassword)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="referralCode"
                variant="outlined"
                required
                fullWidth
                id="referralCode"
                label="Referral Code"
                error={
                  !_.isEmpty(state.errors.formErrors.referralCode) ||
                  state.errors.invalidReferral
                }
                helperText={
                  state.errors.invalidReferral && 'Invalid referral code'
                }
              />
              <FormHelperText>
                This code must be retrieved from the Circuit Overseer who
                referred you to Numeri.
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox name="confirmCO" value="1" color="primary" />
                }
                label="I confirm that I am an appointed Circuit Overseer of Jehovah's Witnesses."
              />
              {state.errors.formErrors.confirmCO && (
                <FormHelperText className={classes.error}>
                  {state.errors.formErrors.confirmCO}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/" component={RouterLink} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
