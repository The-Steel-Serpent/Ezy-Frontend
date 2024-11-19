import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import shopReducer from "./shopSlice";
import cartReducer from "./cartSlice";
import walletReducer from "./walletSlice";
import notificationsReducer from "./notificationsSlice";
import socketMiddleware from "../socket/socketMiddleware";
import supportMessageReducer from "./supportMessageSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    shop: shopReducer,
    cart: cartReducer,
    wallet: walletReducer,
    notifications: notificationsReducer,
    supportMessage: supportMessageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});
