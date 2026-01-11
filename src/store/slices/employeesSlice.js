import { createSlice } from "@reduxjs/toolkit";

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    
    EMPLOYEE_FETCH_REQUEST: (state) => {
      state.loading = true;
      state.error = null;
    },

    EMPLOYEE_FETCH_SUCCESS: (state, action) => {
      state.loading = false;
      state.list = action.payload;
      state.error = null;
    },

    EMPLOYEE_FETCH_FAILURE: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    UPDATE_EMPLOYEE_STATUS: (state, action) => {
      const { id, active } = action.payload;
      const employee = state.list.find((emp) => emp.id === id);
      if (employee) {
        employee.active = active;
      }
    },
  },
});

export const {
  EMPLOYEE_FETCH_REQUEST,
  EMPLOYEE_FETCH_SUCCESS,
  EMPLOYEE_FETCH_FAILURE,
  UPDATE_EMPLOYEE_STATUS,
} = employeesSlice.actions;

export default employeesSlice.reducer;
