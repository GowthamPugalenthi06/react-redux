import { createSlice } from "@reduxjs/toolkit";

const usersFromStorage = JSON.parse(localStorage.getItem("users")) || [];
const loggedInUserFromStorage = JSON.parse(localStorage.getItem("user")) || null;
const initialState = {
  users: usersFromStorage,
  user: loggedInUserFromStorage,
  isAuthenticated: !!loggedInUserFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      const isDuplicate = existingUsers.some(
        (user) =>
          
          user.email === action.payload.email
      );

      if (isDuplicate) {
        throw new Error("User with this username or email already exists");
      }

      const newUsers = [...existingUsers, action.payload];
      localStorage.setItem("users", JSON.stringify(newUsers));
    },

    login: (state, action) => {
      state.user = action.payload;
  state.isAuthenticated = true;
      
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },

    forgot: (state, action) => {
      const updatedUsers = state.users.map((user) =>
        user.email === action.payload.email
          ? { ...user, password: action.payload.password }
          : user
      );

      const updatedUser = updatedUsers.find(
        (user) => user.email === action.payload.email
      );

      state.users = updatedUsers;
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      if (state.user && state.user.email === action.payload.email) {
        state.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      const updatedUsers = state.users.map((u) =>
        u.email === action.payload.email ? action.payload : u
      );

      state.users = updatedUsers;
      state.user = action.payload;
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { register, login, logout, forgot, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
