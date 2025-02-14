import { configureStore } from "@reduxjs/toolkit";
import { serviceSlice } from "../features/serviceSlice";

export const store = configureStore({
  reducer: {
    services: serviceSlice.reducer,
  },
});
