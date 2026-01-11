import { createSlice } from "@reduxjs/toolkit";

const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in ms

const loadUserFromSession = () => {
  const storedData = sessionStorage.getItem("userAuth");

  if (!storedData) return null;

  const parsed = JSON.parse(storedData);
  const now = Date.now();

  // Expired
  if (now - parsed.loginTime > EXPIRY_TIME) {
    sessionStorage.removeItem("userAuth");
    return null;
  }

  return parsed.user;
};

const userFromSession = loadUserFromSession();

const initialState = {
  isLoading: false,
  isAuth: !!userFromSession,
  isError: false,
  user: userFromSession,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    LOGIN_REQUEST: (state) => {
      state.isLoading = true;
      state.isError = false;
    },

    lOGIN_SUCCESS: (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.isError = false;
      state.user = action.payload;

      // store user + login time
      sessionStorage.setItem(
        "userAuth",
        JSON.stringify({
          user: action.payload,
          loginTime: Date.now(),
          expiryTime: Date.now() + EXPIRY_TIME, // 👈 add this
        })
      );
    },

    LOGIN_FAILURE: (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.isError = true;
      state.user = null;

      sessionStorage.removeItem("userAuth");
    },

    LOGIN_RESET: (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.isError = false;
      state.user = null;

      sessionStorage.removeItem("userAuth");
    },

    LOGOUT: (state) => {
      state.isAuth = false;
      state.user = null;

      sessionStorage.removeItem("userAuth");
    },
  },
});

export const {
  LOGIN_REQUEST,
  lOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGOUT,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;