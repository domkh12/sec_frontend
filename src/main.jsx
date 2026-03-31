import "./config/init.js";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import './config/i18n';
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from './config/theme';
import {Provider} from "react-redux";
import store from "./redux/app/store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter
          future={{
              v7_startTransition: true,
          }}
      >
          <Provider store={store}>
              <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
              </ThemeProvider>
          </Provider>
      </BrowserRouter>
  </StrictMode>,
)
