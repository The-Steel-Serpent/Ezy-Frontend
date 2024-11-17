import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchNotifications } from "../services/notificationsService";

const initialState = {
  notifications: [],
  notSeen: 0,
  status: "idle",
};
export const fetchNotificationsData = createAsyncThunk(
  "notifications/fetchNotificationsData",
  async ({ userID, page, limit }) => {
    const data = await fetchNotifications(userID, page, limit);
    if (data.error) {
      throw new Error(data.message);
    }
    return data; // Trả về dữ liệu
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotificationsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload.data;
        state.notSeen = action.payload.unReadCount;
      })
      .addCase(fetchNotificationsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default notificationsSlice.reducer;
