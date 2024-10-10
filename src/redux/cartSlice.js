import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCart,
  getLimitCartItems,
  updateVarients,
} from "../services/cartService";

export const fetchMiniCartData = createAsyncThunk(
  "cart/fetchMiniCartData",
  async (userID) => {
    const data = await getLimitCartItems(userID);
    if (data.error) {
      throw new Error(data.message);
    }
    return data; // Trả về dữ liệu
  }
);

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async ({ userID }) => {
    const data = await getCart(userID);
    if (data.error) {
      throw new Error(data.message);
    }
    return data;
  }
);

const initialState = {
  cart: [],
  miniCart: [],
  quantity: 0,
  totalItems: 0,
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      state.quantity = 0;
      state.totalItems = 0;
      state.miniCart = [];
      state.status = "idle";
    },
    updateCartVarients: (state, action) => {
      const { cartItemID, productVarientsID } = action.payload;
      const cartItemIndex = state.cart.findIndex(
        (item) => item.cart_item_id === cartItemID
      );
      if (cartItemIndex !== -1) {
        const cartItem = state.cart[cartItemIndex];
        const existingCartItemIndex = state.cart.findIndex(
          (item) =>
            item.cart_shop_id === cartItem?.cart_shop_id &&
            item.product_varients_id === productVarientsID
        );
        console.log(
          "cartItemIndex:",
          cartItemIndex,
          "existingCartItemIndex:",
          existingCartItemIndex
        );
        if (existingCartItemIndex !== -1) {
          state.cart[existingCartItemIndex] = {
            ...state.cart[existingCartItemIndex],
            quantity:
              state.cart[existingCartItemIndex].quantity + cartItem.quantity,
          };
          state.cart = state.cart.filter(
            (item) => item.cart_item_id !== cartItemID
          );
        } else {
          state.cart[cartItemIndex] = {
            ...state.cart[cartItemIndex],
            product_varients_id: productVarientsID,
          };
        }
      }
    },
    updateVarientQuantity: (state, action) => {
      const { cartItemID, quantity } = action.payload;
      const cartItem = state.cart.find(
        (item) => item.cart_item_id === cartItemID
      );
      if (cartItem) {
        cartItem.quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMiniCartData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMiniCartData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.miniCart = action.payload.cartItems;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchMiniCartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(fetchCartData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload.cartShop;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearCart, updateCartVarients, updateVarientQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
