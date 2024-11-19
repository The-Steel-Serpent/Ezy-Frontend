import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  closeRequest,
  sendRequestSupport,
} from "../services/requestSupportService";
import { message } from "antd";

export const sendSupportRequest = createAsyncThunk(
  "supportMessage/sendSupportRequest",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await sendRequestSupport(user_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const closeSupportRequest = createAsyncThunk(
  "supportMessage/closeSupportRequest",
  async (request_support_id, { rejectWithValue }) => {
    try {
      const response = await closeRequest(request_support_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  selectedUserID: null,
  message: "",
  requestSupport: null,
  supporter: null,
  sender: null,
  loading: false,
  messages: [],
  fileList: [],
  openSupportChatbox: false,
  error: {
    message: "",
    fileList: "",
  },
  previewImage: "",
  previewVisible: false,
  previewTitle: "",
  previewOpen: false,
  isClosed: false,
  isNewRequest: false,
};

export const supportMessageSlice = createSlice({
  name: "supportMessage",
  initialState,
  reducers: {
    setSupportMessageState: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPreviewImage: (state, action) => {
      state.previewImage = action.payload.previewImage;
      state.previewOpen = action.payload.previewOpen;
      state.previewVisible = action.payload.previewVisible;
    },
    setAcceptRequest: (state, action) => {
      state.openSupportChatbox = true;
      state.selectedUserID = action.payload.selectedUserID;
      state.requestSupport = action.payload.requestSupport;
      state.sender = action.payload.sender;
      state.supporter = action.payload.supporter;
      state.isClosed = false;
    },
    setCloseRequest: (state) => {
      state.selectedUserID = null;
      state.requestSupport = null;
      state.sender = null;
      state.supporter = null;
      state.isClosed = true;
    },

    isNewRequest: (state, action) => {
      state.isNewRequest = action.payload.isNewRequest;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSupportRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendSupportRequest.fulfilled, (state, action) => {
        state.loading = false;
        message.success("Gửi yêu cầu hỗ trợ thành công");
        state.requestSupport = action.payload;
        localStorage.setItem(
          "request_support_id",
          action.payload.request_support_id
        );
      })
      .addCase(sendSupportRequest.rejected, (state, action) => {
        state.loading = false;
        state.error.message =
          action.payload.message || "Lỗi gửi yêu cầu hỗ trợ";
        message.error("Đang gặp lỗi, vui lòng thử lại sau");
      })
      .addCase(closeSupportRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(closeSupportRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestSupport = null;
        message.success("Đã đóng yêu cầu hỗ trợ");
      })
      .addCase(closeSupportRequest.rejected, (state, action) => {
        state.loading = false;
        state.error.message =
          action.payload.message || "Lỗi gửi yêu cầu hỗ trợ";
        message.error("Đang gặp lỗi, vui lòng thử lại sau");
      });
  },
});

export const {
  setSupportMessageState,
  setAcceptRequest,
  setCloseRequest,
  setPreviewImage,
  isNewRequest,
} = supportMessageSlice.actions;

export default supportMessageSlice.reducer;
