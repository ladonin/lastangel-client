import React from "react";
import { createRoot } from "react-dom/client";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store, history } from "store";
import App from "pages/App";
import "react-toastify/dist/ReactToastify.css";
import "fonts/index.scss";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <Router history={history}>
      <App />
      <ToastContainer />
    </Router>
  </Provider>
);
