import { createSlice } from "@reduxjs/toolkit";
import userManager from "../../utils/userManager";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    status: false,
    user: {},
  },
  reducers: {
    login: (state, action) => {
      state.status = action.payload.status;
      state.loggedIn = action.payload.status;
      state.user = action.payload.user;
    },
    register: (state, action) => {
      let { name, email, pass } = action.payload;
      state.status = true;
      state.user = {
        name: name,
        role: "customer",
        email: email,
        pass: pass,
      };
    },
    logout: (state) => {
      userManager
        .removeUser()
        .then((data) => {})
        .catch((error) => {
          console.error("Cannot log out!", error);
        });

      console.log("user slice logouta gelindi");
      state.status = false;
      state.loggedIn = false;
      state.user = {};
    },
  },
});

const userReducer = userSlice.reducer;
export default userReducer;

export const userIsLoggedIn = (state) => state.user.loggedIn;
