import { createSlice } from "@reduxjs/toolkit";
import { AppState } from ".";

// Type for our state
export interface AuthState {
  authState: boolean;
  accountId: Number
}

// Initial state
const initialState: AuthState = {
  authState: false,
  accountId: 0
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setAccountId(state, action) {
      state.accountId = action.payload;
    },    

    // // Special reducer for hydrating the state. Special case for next-redux-wrapper
  },
});

export const { setAuthState } = authSlice.actions;
export const { setAccountId } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;
export const selectAccountId = (state: AppState) => state.auth.accountId;

export default authSlice.reducer;