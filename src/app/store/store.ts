import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import projectReducer from "../store/slices/projectSlice";
import taskReducer from "../store/slices/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication reducer
    projects: projectReducer, // Projects reducer
    tasks: taskReducer, // Tasks reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
