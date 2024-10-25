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
    let errorMessage;
    switch (error.response.status) {
      case 404:
        errorMessage = "Không tìm thấy sản phẩm";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 400:
        errorMessage = "Số lượng sản phẩm không đủ";
        break;
      default:
        errorMessage = error.message || error;
    }
    throw new Error(errorMessage);
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
    let errorMessage;
    switch (error.response.status) {
      case 404:
        errorMessage = "Không tìm thấy sản phẩm";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 400:
        errorMessage = "Số lượng sản phẩm không đủ";
        break;
      default:
        errorMessage = error.message || error;
    }
    throw new Error(errorMessage);
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
    let errorMessage;
    switch (error.response.status) {
      case 404:
        errorMessage = "Không tìm thấy sản phẩm trong giỏ hàng";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 400:
        errorMessage = "Số lượng sản phẩm không đủ";
        break;
      default:
        errorMessage = error.message || error;
    }
    throw new Error(errorMessage);
  }
};

export const updateSelectedAll = async (cart_id, selected) => {
  try {
    const response = await axios.post(
      `${url}/update-selected-all?cart_id=${cart_id}&selected=${selected}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi khi cập nhật select all: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const updateAllItemsOfShop = async (cart_shop_id, selected) => {
  try {
    const response = await axios.post(
      `${url}/update-all-items-of-shop?cart_shop_id=${cart_shop_id}&selected=${selected}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi khi cập nhật select all: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const updateSelected = async (cart_item_id, selected) => {
  try {
    const response = await axios.post(
      `${url}/update-selected-item?cart_item_id=${cart_item_id}&selected=${selected}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi khi cập nhật select: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const removeAllItems = async (cart_id) => {
  try {
    const response = await axios.post(
      `${url}/destroy-cart?cart_id=${cart_id}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi khi xóa giỏ hàng: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const removeItem = async (cart_item_id) => {
  try {
    const response = await axios.post(
      `${url}/remove-item?cart_item_id=${cart_item_id}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi khi xóa sản phẩm: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const checkOut = async (data) => {
  try {
    const { user_id, paymentMethodID, totalPayment, validCart } = data;
    const urlCheckout = `${process.env.REACT_APP_BACKEND_URL}/api/checkout`;
    const res = await axios.post(urlCheckout, {
      user_id,
      paymentMethodID,
      totalPayment,
      validCart,
    });
    return res.data;
  } catch (error) {
    console.log("Lỗi khi thực hiện thanh toán: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 400:
        errorMessage = "Số lượng sản phẩm không đủ";
        break;
      default:
        errorMessage = error.message || error;
    }
    throw new Error(errorMessage);
  }
};
