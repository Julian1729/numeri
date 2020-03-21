import React, { useState } from 'react';
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

const ClaimCircuit = ({ referralComponent }) => {

  const onSubmit = e => {
    e.preventDefault();
  };

  const [circuitState, setCircuitState] = useState('');
  const [circuitNumber, setCircuitNumber] = useState('');
  const [formErrors, setFormErrors] = useState({
    state: null,
    number: null,
  })

  const circuitNumberInput = document.getElementById('circuit-number');

  const circuitStateOnChange = e => {
    const value = e.target.value.toUpperCase();
    if(/\d/.test(value)) return;
    if(value.length <= 2){
      setCircuitState(value);
    }
    if(value.length === 2){
      circuitNumberInput.focus();
    }
  }

  const circuitNumberOnChange = e => {
    const value = e.target.value;
    if(value.length > 2 || /[a-zA-Z]/.test(value)) return;
    setCircuitNumber(value);
  }

  return (
    <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          Claim Your Circuit
        </Typography>
        <Typography variant="subtitle1">
          You are not currently associated with a circuit. Please
          fill out the form below to claim your assigned circuit.
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Claim Circuit
          </Button>
        </form>
    </Container>
  );
}

const mapStateToProps = state => (
  {
    user: state.user
  }
);

const mapDispatchToProps = dispatch => {};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimCircuit);
