import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLimitCartItems } from "../services/cartService";

export const fetchMiniCartData = createAsyncThunk(
  "cart/fetchMiniCartData",
  async (userID) => {
    const data = await getLimitCartItems(userID); // Gọi hàm getLimitCartItems
    if (data.error) {
      throw new Error(data.message); // Ném lỗi nếu có
    }
    console.log("data", data);
    return data; // Trả về dữ liệu
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
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
