import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/cart`;

export const getCart = async (userID) => {
  try {
    const response = await axios.get(`${url}/get-cart?user_id=${userID}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng: ", error);
    switch (error.status) {
      case 500:
        return { error: true, message: "Lỗi server" };
      default:
        return { error: true, message: error.message || error };
    }
  }
};

export const getLimitCartItems = async (userID) => {
  try {
    const response = await axios.get(`${url}/limit-items?user_id=${userID}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng: ", error);
    switch (error.status) {
      case 500:
        return { error: true, message: "Lỗi server" };
      default:
        return { error: true, message: error.message || error };
    }
  }
};

export const addToCart = async (
  userID,
  shopID,
  productVarientsID,
  quantity
) => {
  try {
    const response = await axios.get(
      `${url}/add_to_cart?user_id=${userID}&shop_id=${shopID}&product_varients_id=${productVarientsID}&quantity=${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng: ", error);
    switch (error.status) {
      case 404:
        return { error: true, message: "Không tìm thấy sản phẩm" };
      case 500:
        return { error: true, message: "Lỗi server" };
      case 400:
        return { error: true, message: "Số lượng sản phẩm không đủ" };
      default:
        return { error: true, message: error.message || error };
    }
  }
};

export const updateVarients = async (cartItemID, productVarientsID) => {
  try {
    const response = await axios.post(
      `${url}/update-varients?cart_item_id=${cartItemID}&product_varients_id=${productVarientsID}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm: ", error);
    switch (error?.response?.status) {
      case 404:
        return { error: true, message: "Không tìm thấy sản phẩm" };
      case 500:
        return { error: true, message: "Lỗi server" };
      case 400:
        return { error: true, message: "Số lượng sản phẩm không đủ" };
      default:
        return { error: true, message: error.response.message || error };
    }
  }
};

export const updateItemQuantity = async (cartItemID, quantity) => {
  try {
    const response = await axios.post(
      `${url}/update-quantity?cart_item_id=${cartItemID}&quantity=${quantity}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng: ", error);
    switch (error?.resposne?.status) {
      case 404:
        return {
          error: true,
          message: "Không tìm thấy sản phẩm trong giỏ hàng",
        };
      case 500:
        return { error: true, message: "Lỗi server" };
      case 400:
        return { error: true, message: "Số lượng sản phẩm không đủ" };
      default:
        return { error: true, message: error.message || error };
    }
  }
};
