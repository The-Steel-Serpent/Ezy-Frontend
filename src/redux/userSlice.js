import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: "",
  username: "",
  security_password: "",
  full_name: "",
  email: "",
  phone_number: "",
  gender: "",
  dob: "",
  avt_url: "",
  role_id: "",
  setup: 0,
  isVerified: false,
  token: "",
  wallet: {},
  onlineUser: [],
  is_banned: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      state.security_password = action.payload.security_password;
      state.full_name = action.payload.full_name;
      state.email = action.payload.email;
      state.phone_number = action.payload.phone_number;
      state.gender = action.payload.gender;
      state.dob = action.payload.dob;
      state.avt_url = action.payload.avt_url;
      state.role_id = action.payload.role_id;
      state.setup = action.payload.setup;
      state.isVerified = action.payload.isVerified;
      state.wallet = action.payload.wallet;
      state.is_banned = action.payload.is_banned;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user_id = "";
      state.username = "";
      state.security_password = "";
      state.full_name = "";
      state.email = "";
      state.phone_number = "";
      state.gender = "";
      state.dob = "";
      state.avt_url = "";
      state.role_id = "";
      state.setup = false;
      state.isVerified = false;
      state.token = "";
      state.wallet = {};
      state.is_banned = 0;
    },
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
    setUpDone: (state) => {
      state.setup = 1;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  setToken,
  logout,
  setOnlineUser,
  setSocketConnection,
  setUpDone,
  setWallet,
} = userSlice.actions;

export default userSlice.reducer;
