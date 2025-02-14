import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage"; 
import ServiceDetails from "./pages/ServiceDetails";
import AddService from "./pages/AddService";

import { Provider } from "react-redux";

import { store } from "./app/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/service-details/:serviceName/:serviceId",
        element: <ServiceDetails />,
      },
      {
        path: "/add-service",
        element: <AddService />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <Homepage />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
