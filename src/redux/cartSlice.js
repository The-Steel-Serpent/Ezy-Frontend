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
  invalidItems: [],
  miniCart: [],
  quantity: 0,
  totalPrice: 0,
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
      state.discountPrice = 0;
      state.totalItems = 0;
      state.totalPrice = 0;
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
      for (let i = 0; i < state.cart.length; i++) {
        for (let j = 0; j < state.cart[i].CartItems.length; j++) {
          if (state.cart[i].CartItems[j].cart_item_id === cartItemID) {
            state.cart[i].CartItems[j].quantity = quantity;
            state.cart[i].CartItems[j].price =
              ((state.cart[i].CartItems[j].ProductVarient.price *
                (100 -
                  state.cart[i].CartItems[j].ProductVarient.sale_percents)) /
                100) *
              quantity;
            break;
          }
        }
      }
    },
    updateCartItems: (state, action) => {
      const { cart_item_id, checked } = action.payload;
      for (let i = 0; i < state.cart.length; i++) {
        for (let j = 0; j < state.cart[i].CartItems.length; j++) {
          if (state.cart[i].CartItems[j].cart_item_id === cart_item_id) {
            state.cart[i].CartItems[j].selected = checked;
            break;
          }
        }
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
        state.invalidItems = action.payload.invalidItems;
        const totalItems = action.payload?.cartShop?.reduce(
          (total, shop) =>
            shop.selected === 1 ? total + shop.total_quantity : total,
          0
        );

        // Tính tổng giá cho các item đã chọn
        const totalPrice = action.payload?.cartShop?.reduce(
          (total, shop) =>
            shop.selected === 1 ? total + shop.total_price : total,

          0
        );
        console.log(action.payload?.cartShop);
        const discountPrice = action.payload?.cartShop?.reduce(
          (total, shop) =>
            total +
            shop?.CartItems?.reduce(
              (subtotal, cartItem) =>
                cartItem.selected === 1
                  ? subtotal +
                    (cartItem.ProductVarient.price *
                      cartItem.ProductVarient.sale_percents) /
                      100
                  : subtotal,
              0
            ),
          0
        );
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
        state.discountPrice = discountPrice;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  clearCart,
  updateCartVarients,
  updateVarientQuantity,
  updateCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
