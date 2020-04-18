import React from 'react';
import { connect } from 'react-redux';

import Wrapper from './Wrapper';

const DashboardPage = props => (
  <Wrapper title="Dashboard">I'm a pirate</Wrapper>
);

export default connect()(DashboardPage);
