import React from 'react';
import { connect } from 'react-redux';

import Wrapper from './Wrapper';

const DashboardPage = props => (
  <Wrapper title="Dashboard">
    <p>Im a pirate</p>
  </Wrapper>
);

export default connect()(DashboardPage);
