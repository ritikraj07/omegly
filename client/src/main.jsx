import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App";
import "./assets/styles/global.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7565F5",
    },
    background: {
      default: "#080B14",
      paper: "#111727",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <HelmetProvider>
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
  </React.StrictMode>,
    </HelmetProvider>
);
