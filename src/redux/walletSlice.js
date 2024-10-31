import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWallet } from "../services/walletService";

export const fetchWallet = createAsyncThunk(
  "wallet/fetchWallet",
  async (token) => {
    const data = await getWallet(token);
    if (data.error) {
      throw new Error(data.message);
    }
    console.log("Dữ liệu ví: ", data);
    return data; // Trả về dữ liệu
  }
);

const initialState = {
  wallet: {},
  status: "idle",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload.wallet;
    },
    clearWallet: (state) => {
      state.wallet = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wallet = action.payload.wallet;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

// Action creators are generated for each case reducer function
export const { setWallet, clearWallet } = walletSlice.actions;

export default walletSlice.reducer;
