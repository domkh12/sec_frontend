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
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter
          future={{
              v7_startTransition: true,
          }}
      >
          <Provider store={store}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>

                    <CssBaseline />

                  <App />
              </ThemeProvider>
              </LocalizationProvider>
          </Provider>
      </BrowserRouter>
  </StrictMode>,
)
