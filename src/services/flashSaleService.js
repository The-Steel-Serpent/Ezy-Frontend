import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/flash-sales`;

export const getFlashSalesActive = async () => {
  try {
    const url = URL + `/get-active-flash-sales`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAvailableFlashSalesTimeFrames = async () => {
  try {
    const url = URL + `/get-available-time-frames`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductByTimeFrame = async (timeFrameId, page) => {
  try {
    const url =
      URL +
      `/get-product-by-time-frame?flash_sale_time_frame_id=${timeFrameId}&page=${page}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSuggestFlashSaleForShop = async (payload) => {
  try {
    const url = URL + `/get-suggest-flash-sale-shop`;
    const res = await axios.get(url, { params: payload });
    return res.data;
  } catch (error) {
    console.log("Error in suggestFlashSaleForShop", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = error.response.data.message;
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage = error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return { success: false, message: errorMessage, status: error.response?.status || 0 };
  }
}
