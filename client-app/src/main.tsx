import React from "react";
import ReactDOM from "react-dom/client";
import "react-calendar/dist/Calendar.css";
import "semantic-ui-css/semantic.min.css";
import "./app/layout/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
import { store, StoreContext } from "./app/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
);
