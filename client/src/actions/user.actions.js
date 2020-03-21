export const logIn = (id, circuit) => (
  {
    type: 'LOG_IN',
    id,
    circuit
  }
);

export const logOut = () => (
  {
    type: 'LOG_OUT'
  }
);

export const claimCircuit = circuit => (
  {
    type: 'CLAIM_CIRCUIT',
    circuit
  }
);

export const ejectCircuit = () => (
  {
    type: 'EJECT_CIRCUIT'
  }
);
