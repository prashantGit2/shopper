import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './rtk-slice/store'
import { Provider } from 'react-redux'
import { CssBaseline,ThemeProvider } from '@mui/material'

import './index.css';
import App from './App';
import { appTheme } from './theme'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={appTheme} >
      <CssBaseline enableColorScheme />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
