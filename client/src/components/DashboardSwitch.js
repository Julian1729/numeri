import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Dashboard from './Dashboard';
import userActions from '../actions/user.actions';
import ClaimCircuitForm from './ClaimCircuitForm';

const DashboardSwitch = ({ circuit, claimCircuit, ...rest }) => {
  useEffect(() => {
    console.log('circuit ran');
  }, [circuit]);

  return (
    <>
      {circuit ? (
        <Dashboard {...rest} />
      ) : (
        <ClaimCircuitForm claimCircuit={claimCircuit} />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  circuit: state.user.circuit,
});

const mapDispatchToProps = dispatch => ({
  claimCircuit: circuit => dispatch(userActions.claimCircuit(circuit)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSwitch);
