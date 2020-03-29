import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const ClaimCircuit = ({ claimCircuit }) => {
  const [circuitState, setCircuitState] = useState('');
  const [circuitNumber, setCircuitNumber] = useState('');
  const [redirect, setRedirect] = useState('');
  const [error, setError] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    const state = e.target.state.value;
    const number = e.target.number.value;
    // OPTIMIZE: don't rely on UI contstraints for validation
    axios
      .post('/api/circuit/claim', { state, number })
      .then(({ data }) => {
        if (data.success) {
          return claimCircuit(data.circuit);
        }
        switch (data.error.type) {
          case 'CIRCUIT_NOT_AVAILABLE':
            return setError(
              `${data.error.circuitName} is not available, and is currently claimed by another Circuit Overseer.`
            );
          case 'OVERSEER_ALREADY_ASSIGNED':
            console.log(JSON.stringify(data, null, 2));
            return claimCircuit(data.circuit);
          default:
            console.log(error);
        }
      })
      .catch(e => console.error(e));
  };

  const circuitNumberInput = document.getElementById('circuit-number');

  // OPTIMIZE: verify that state is a valid state abbreviation
  const circuitStateOnChange = e => {
    const value = e.target.value.toUpperCase();
    if (/\d/.test(value)) return;
    if (value.length <= 2) {
      setCircuitState(value);
    }
    if (value.length === 2) {
      circuitNumberInput.focus();
    }
  };

  const circuitNumberOnChange = e => {
    const value = e.target.value;
    if (value.length > 2 || /[a-zA-Z]/.test(value)) return;
    setCircuitNumber(value);
  };

  return (
    <Container component="main" maxWidth="xs">
      {redirect && <Redirect to={redirect} />}
      <Typography component="h1" variant="h5">
        Claim Your Circuit
      </Typography>
      <Typography variant="subtitle1">
        You are not currently associated with a circuit. Please fill out the
        form below to claim your assigned circuit.
      </Typography>
      <form noValidate onSubmit={onSubmit}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item sm={5}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="State (e.g. PA)"
              name="state"
              value={circuitState}
              autoFocus
              onChange={circuitStateOnChange}
            />
          </Grid>
          <Grid item sm={2}>
            <p> - </p>
          </Grid>
          <Grid item sm={5}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="circuit-number"
              label="Number"
              name="number"
              value={circuitNumber}
              onChange={circuitNumberOnChange}
            />
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" variant="subtitle2">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          disabled={circuitState === '' || circuitNumber === ''}
          fullWidth
          variant="contained"
          color="primary"
        >
          Claim Circuit
        </Button>
      </form>
    </Container>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

// const mapDispatchToProps = dispatch => {};

export default connect(mapStateToProps)(ClaimCircuit);
