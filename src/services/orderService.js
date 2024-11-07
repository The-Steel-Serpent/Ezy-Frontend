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

export const getOrders = async (
  user_id,
  status_id,
  page,
  limit,
  searchText
) => {
  try {
    const response = await axios.post(`${url}get_orders`, {
      user_id,
      status_id,
      page,
      limit,
      searchText,
    });

    return response.data;
  } catch (error) {
    console.log("Error when getOrders", error);
    throw new Error(error);
  }
};

export const getShopOrders = async (shop_id, status_id, page, limit) => {
  try {
    const response = await axios.post(`${url}get-shop-orders`, {
      shop_id,
      status_id,
      page,
      limit,
    });
    return response.data;
  } catch (error) {
    console.log("Error when getShopOrders", error);
    throw new Error(error);
  }
}
export const checkoutOrder = async (user_order_id) => {
  try {
    const response = await axios.post(`${url}checkout-order`, {
      user_order_id,
    });
    return response.data;
  } catch (error) {
    console.log("Error when checkoutOrder", error);
    throw new Error(error);
  }
};

export const checkoutOrderEzyWallet = async (user_order_id, user_wallet_id) => {
  try {
    console.log("user_order_id", user_order_id);
    console.log("user_wallet_id", user_wallet_id);
    const response = await axios.post(`${url}checkout-order-ezy-wallet`, {
      user_order_id,
      user_wallet_id,
    });
    return response.data;
  } catch (error) {
    console.log("Error when checkoutOrderEzyWallet", error);
    throw new Error(error);
  }
};

export const cancelOrder = async (user_order_id) => {
  try {
    const response = await axios.post(`${url}cancel-order`, {
      user_order_id,
    });
    return response.data;
  } catch (error) {
    console.log("Error when cancelOrder", error);
    throw new Error(error);
  }
};

export const completeOrder = async (user_order_id) => {
  try {
    const response = await axios.post(`${url}complete-order`, {
      user_order_id,
    });
    return response.data;
  } catch (error) {
    console.log("Error when completeOrder", error);
    throw new Error(error);
  }
};
