import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: null,
    isAuthenticated: false,
    token: null,
    
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo =  action.payload.userInfo;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearSession: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateToken, clearSession, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;
