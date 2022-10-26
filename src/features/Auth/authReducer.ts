import {createAction, createSlice} from "@reduxjs/toolkit";

// Auth actions
export const setIsLoggedIn = createAction<{ value: boolean }>("auth/set-is-logged-in");

// Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setIsLoggedIn, (state, action) => {
        state.isLoggedIn = action.payload.value;
      });
  },
});
