import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;