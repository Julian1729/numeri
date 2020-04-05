import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// material-ui css CssBaseline
import CssBaseline from '@material-ui/core/CssBaseline';
// styles and fonts
import './styles/numeri.sass';
import store from './config/store.config';

import AppRouter from './routers/AppRouter';

const jsx = (
  <Provider store={store}>
    <CssBaseline />
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('root'));
