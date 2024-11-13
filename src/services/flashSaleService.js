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
