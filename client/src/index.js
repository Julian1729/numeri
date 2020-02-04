import React from 'react';
import ReactDOM from 'react-dom';

// material-ui css CssBaseline
import CssBaseline from '@material-ui/core/CssBaseline';
// styles and fonts
import './styles/numeri.sass';

import AppRouter from './routers/AppRouter';

const jsx = (
  <>
  <CssBaseline />
  <AppRouter/>
  </>
);

ReactDOM.render(jsx, document.getElementById('root'));
