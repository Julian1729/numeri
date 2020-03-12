import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as HttpStatusCodes from 'http-status-codes';

const LoginPage = () => {

  const [invalid, setInvalid] = useState(false);
  const [redirect, setRedirect] = useState(null);

  const attemptAuthorization = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setInvalid(false)
    // send to api and authenticate
    axios.post('/api/login', {email, password})
      .then(({ data }) => {

        if(data.redirect){
          setRedirect(data.redirect);
        }

      })
      .catch(e => {

        // invalid credentials
        if(e.response.status === HttpStatusCodes.UNAUTHORIZED){
          setInvalid(true);
        }

      })
  }

  return (
    <Container component="main" maxWidth="xs">
        {redirect && <Redirect to={redirect} />}
        <Typography component="h1" variant="h5">
          Numeri
        </Typography>
        {invalid &&
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
            error={invalid}
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
            error={invalid}
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
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
    </Container>
  );
}

export default LoginPage;
