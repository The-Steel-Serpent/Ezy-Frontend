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
