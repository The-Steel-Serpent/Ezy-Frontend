import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/order/`;

export const getOrderStatus = async () => {
  try {
    const response = await axios.get(`${url}order-status`);
    return response.data;
  } catch (error) {
    console.log("Error when getOrderStatus", error);
    throw new Error(error);
  }
};

export const getOrders = async (user_id, status_id, page, limit) => {
  console.log("getOrders", user_id, status_id, page, limit);
  try {
    const response = await axios.post(`${url}get_orders`, {
      user_id,
      status_id,
      page,
      limit,
    });
    return response.data;
  } catch (error) {
    console.log("Error when getOrders", error);
    throw new Error(error);
  }
};
