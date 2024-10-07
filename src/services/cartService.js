import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/cart`;

export const getCart = async (userID) => {};

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

export const updateCart = async (userID, productID, quantity) => {};

export const deleteCart = async (userID, productID) => {};

export const deleteAllCart = async (userID) => {};

export const checkout = async (userID, data) => {};
