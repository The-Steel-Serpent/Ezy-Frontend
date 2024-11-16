import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/voucher`;

export const getVoucherList = async (data) => {
  const { user_id, totalPayment, cart } = data;
  try {
    const response = await axios({
      method: "post",
      url: `${url}/voucher-list`,
      data: {
        user_id,
        totalPayment,
        cart,
      },
    });
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch voucher list: ", error);
  }
};
