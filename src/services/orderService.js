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
};
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

export const comfirmOrder = async (payload) => {
  try {
    const response = await axios.post(`${url}confirm-order`, payload);
    return response.data;
  } catch (error) {
    console.log("Error when comfirmOrder", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.message;
          break;
        case 404:
          errorMessage = "Order not found";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const buyOrderAgain = async (user_order_id) => {
  try {
    const response = await axios.post(`${url}buy-again`, {
      user_order_id,
    });
    return response.data;
  } catch (error) {
    console.log("Error when buyOrderAgain", error);
    throw new Error(error);
  }
};

export const reviewOrder = async (user_order_id, user_id, ratingList) => {
  try {
    const response = await axios.post(`${url}review-order`, {
      user_order_id,
      user_id,
      ratingList,
    });
    return response.data;
  } catch (error) {
    console.log("Error when reviewOrder", error);
    throw new Error(error);
  }
};

export const getReviewOrder = async (user_order_id) => {
  try {
    const response = await axios.get(
      `${url}get-reviews?user_order_id=${user_order_id}`
    );

    return response.data;
  } catch (error) {
    console.log("Error when getReviewOrder", error);
    throw new Error(error);
  }
};

export const getReasons = async (type) => {
  try {
    const response = await axios.get(`${url}get-reasons?type=${type}`);
    return response.data;
  } catch (error) {
    console.log("Error when getReasons", error);
    throw new Error(error);
  }
};

export const sendRequest = async (payload) => {
  try {
    const response = await axios.post(`${url}send-request`, payload);
    return response.data;
  } catch (error) {
    console.log("Error when sendRequest", error);
    throw new Error(error);
  }
};
