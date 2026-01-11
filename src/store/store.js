import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "./slices/employeesSlice";
import userAuthReducer from "./slices/userAuthSlice";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    userAuth: userAuthReducer,
  },
});