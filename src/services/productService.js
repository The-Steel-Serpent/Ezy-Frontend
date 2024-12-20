import axios from "axios";
import { th } from "date-fns/locale";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/`;
export const addProduct = async (payload) => {
  try {
    const url = URL + "add-product";
    console.log(URL);
    const res = await axios.post(url, payload);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return { error: true, message: error.message || error };
  }
};

export const saveProductImages = async (payload) => {
  try {
    const urlPost = URL + "add-product-image";
    const res = await axios.post(urlPost, payload);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return { error: true, message: error.message || error };
  }
};

export const addProductVarient = async (payload) => {
  try {
    // check payload
    console.log("check payload product vairent:", payload);
    const url = URL + "add-product-varient";
    const res = await axios.post(url, payload);
    if (res.status === 200) {
      return res.data;
    } else {
      return { error: true, message: "Failed to add product variant" };
    }
  } catch (error) {
    switch (error.status) {
      case 500:
        return { error: true, message: "Lỗi server" };
      default:
        return {
          error: true,
          message: error.message || error,
        };
    }
  }
};

export const addProductClassify = async (payload) => {
  try {
    const url = URL + "add-product-classify";
    const res = await axios.post(url, payload);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return { error: true, message: error.message || error };
  }
};

export const findClassifiesID = async (payload) => {
  try {
    const url = URL + "get-classifies-id";
    const res = await axios.get(url, { params: payload });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return { error: true, message: error.message || error };
  }
};

export const addProductSize = async (payload) => {
  try {
    const url = URL + "add-product-size";
    const res = await axios.post(url, payload);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return { error: true, message: error.message || error };
  }
};

export const getProductSize = async (payload) => {
  try {
    const url = URL + "get-product-size";
    const res = await axios.get(url, { params: payload });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return { error: true, message: error.message || error };
  }
};

export const getShopProducts = async (shop_id, product_status, page, limit) => {
  const payload = { shop_id, product_status, page, limit };
  try {
    const url = `${URL}shop-products-status`;
    const response = await axios.get(url, {
      params: payload,
    });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi lấy sản phẩm của shop: ", error);

    const errorMessage = error?.response?.status
      ? `Error ${error.response.status}: ${error.response.data}`
      : error.message;

    throw new Error(errorMessage);
  }
};

export const searchShopProducts = async (
  shop_id,
  product_status,
  product_name,
  sub_category_id,
  page,
  limit
) => {
  const payload = {
    shop_id,
    product_status,
    product_name,
    sub_category_id,
    page,
    limit,
  };
  try {
    const url = `${URL}search-shop-products`;
    const response = await axios.get(url, {
      params: payload,
    });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi tìm kiếm sản phẩm của shop: ", error);
    switch (error.response.status) {
      case 404:
        return { error: true, message: "No products found" };
      case 500:
        return { error: true, message: "Lỗi server" };
      default:
        return {
          error: true,
          message: error.message || error,
        };
    }
  }
};

export const updateProductStatus = async (product_id, update_status) => {
  const payload = {
    product_id,
    product_status: update_status,
  };
  console.log("payload update status", payload);

  try {
    const url = `${URL}update-product-status`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Lỗi khi cập nhật trạng thái sản phẩm: ", error);
    const errorMessage = error?.response?.status
      ? `Error ${error.response.status}: ${error.response.data}`
      : error.message;

    throw new Error(errorMessage);
  }
};

export const getProductByID = async (product_id) => {
  try {
    const url = `${URL}get-product`;
    const response = await axios.get(url, {
      params: { product_id },
    });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi lấy sản phẩm: ", error);
    switch (error.response.status) {
      case 404:
        return { error: true, message: "No product found" };
      case 500:
        return { error: true, message: "Lỗi server" };
      default:
        return {
          error: true,
          message: error.message || error,
        };
    }
  }
};

export const resetProductStock = async (product_id) => {
  try {
    const url = `${URL}reset-product-stock`;
    const response = await axios.post(url, { product_id });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi reset số lượng sản phẩm: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 400:
        errorMessage = "Product ID is required";
      case 404:
        errorMessage = "No product found";
      case 500:
        errorMessage = "Lỗi server";
      default:
        errorMessage = error.message || error;
    }
    throw new Error(errorMessage);
  }
};

export const findProductVarients = async (product_id) => {
  try {
    const url = `${URL}find-product-varient`;
    const response = await axios.get(url, { product_id });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi tìm kiếm sản phẩm: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 400:
        errorMessage = "Product ID is required";
      case 500:
        errorMessage = "Lỗi server";
      default:
        errorMessage = error.message || error;
    }
    throw new Error(errorMessage);
  }
};
export const deleteProductVarient = async (product_varients_id) => {
  try {
    const url = `${URL}delete-product-varient`;
    const response = await axios.post(url, { product_varients_id });
    return response;
  } catch (error) {
    console.log("Error when deleting product variant:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage =
            "Cannot delete product variant as it is referenced by other records.";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const deleteAllProductVarients = async (product_id) => {
  try {
    const url = `${URL}delete-all-product-varients`;
    const response = await axios.post(url, { product_id });
    return response;
  } catch (error) {
    console.log("Error when deleting all product variants:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = "No product varients found to delete";
          break;
        case 400:
          errorMessage =
            "Cannot delete product variant as it is referenced by other records.";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const updateProductClassify = async (payload) => {
  try {
    const url = `${URL}update-product-classify`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when updating product classify:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Product classify ID is required.";
          break;
        case 404:
          errorMessage = "Product classify not found.";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const deleteSomeProductVarients = async (product_varients_ids) => {
  try {
    const url = `${URL}delete-some-product-varients`;
    const response = await axios.post(url, { product_varients_ids });
    return { success: true, data: response.data }; // Trả về dữ liệu thành công
  } catch (error) {
    console.log("Error when deleting some product variants:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage =
            error.response.data.message ||
            "Cannot delete product variant as it is referenced by other records.";
          break;
        case 404:
          errorMessage =
            error.response.data.message ||
            "No product variants found to delete.";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else if (error.request) {
      errorMessage = "No response from the server. Please try again later.";
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const deleteSomeProductVarientsByClassify = async (
  product_classify_ids
) => {
  try {
    const url = `${URL}delete-some-product-varients-by-classify`;
    const response = await axios.post(url, { product_classify_ids });
    return response.data;
  } catch (error) {
    console.log("Error when deleting product varients by classify:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage =
            error.response.data.message ||
            "Cannot delete product variant as it is referenced by other records.";
          break;
        case 404:
          errorMessage = "Not found product_classify_ids";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const deleteSomeProductClassify = async (product_classify_ids) => {
  try {
    const url = `${URL}delete-some-product-classify`;
    const response = await axios.post(url, { product_classify_ids });
    return { success: true, data: response.data }; // Trả về dữ liệu thành công
  } catch (error) {
    console.log("Error when deleting some product classifies:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage =
            error.response.data.message ||
            "Cannot delete product classifies as they are referenced by other records.";
          break;
        case 404:
          errorMessage =
            error.response.data.message ||
            "No product classifies found to delete.";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else if (error.request) {
      errorMessage = "No response from the server. Please try again later.";
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const updateClassifyTypeName = async (payload) => {
  try {
    const url = `${URL}update-classify-type-name`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when updating classify type name:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 404:
          errorMessage = "Product classify not found";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const addSomeClassify = async (payload) => {
  try {
    const url = `${URL}add-some-classify`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when adding some classify:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const addSomeProductSize = async (payload) => {
  try {
    const url = `${URL}add-some-product-size`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when adding some product size:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const addSomeProductVarientLevel3 = async (payload) => {
  try {
    const url = `${URL}add-some-product-varients-level3`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when adding some product varient level 3:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const deleteSomeProductSize = async (product_size_ids) => {
  try {
    const url = `${URL}delete-some-product-size`;
    const response = await axios.post(url, { product_size_ids });
    return response.data;
  } catch (error) {
    console.log("Error when deleting some product size:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage =
            "Cannot delete product size as it is referenced by other records.";
          break;
        case 404:
          errorMessage = "No product sizes found to delete.";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else if (error.request) {
      errorMessage = "No response from the server. Please try again later.";
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const deleteSomeProductVarientsBySize = async (product_size_ids) => {
  try {
    const url = `${URL}delete-some-product-varients-by-size`;
    const response = await axios.post(url, { product_size_ids });
    return response.data;
  } catch (error) {
    console.log("Error when deleting product varients by size:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage =
            "Cannot delete product variant as it is referenced by other records.";
          break;
        case 404:
          errorMessage = "Not found product_size_ids";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const updateSomeProductSize = async (payload) => {
  try {
    const url = `${URL}update-some-product-size`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when updating product size:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 404:
          errorMessage = "Some product_size_ids not found";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const updateTypeOfProductSize = async (payload) => {
  try {
    const url = `${URL}update-type-of-product-size`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when updating type of product size:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const addSomeProductVarientsByClassifies = async (payload) => {
  try {
    const url = `${URL}add-some-product-varients-by-classifies`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log(
      "Error when adding some product varients by classifies:",
      error
    );
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const addSomeProductImages = async (payload) => {
  try {
    const url = `${URL}add-some-product-images`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when adding some product images:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Invalid input data";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const deleteSomeProductImages = async (product_imgs_ids) => {
  try {
    const url = `${URL}delete-some-product-images`;
    const response = await axios.post(url, { product_imgs_ids });
    return response.data;
  } catch (error) {
    console.log("Error when deleting some product images:", error);

    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "A non-empty array of product_imgs_ids is required";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const updateBasicInfoProduct = async (payload) => {
  try {
    const url = `${URL}update-basic-info-product`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when updating basic info of product:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.message;
          break;
        case 404:
          errorMessage = "Product not found";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const updateShippingInfo = async (payload) => {
  try {
    const url = `${URL}update-shipping-info`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log("Error when updating shipping info:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "product_id is required";
          break;
        case 404:
          errorMessage = "Product not found";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const updateSomeSaleInfoProductVarients = async (payload) => {
  try {
    const url = `${URL}update-some-sale-info-product-varients`;
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.log(
      "Error when updating some sale info of product varients:",
      error
    );
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "product_varients_ids is required";
          break;
        case 404:
          errorMessage = "Product varients not found";
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const deleteSomeProducts = async (product_ids) => {
  try {
    const url = `${URL}delete-some-products`;
    const response = await axios.post(url, { product_ids });
    return response.data;
  } catch (error) {
    console.log("Error when deleting some products:", error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "A non-empty array of product_ids is required";
          break;
        case 404:
          errorMessage = "No products found to delete";
          break;
        case 409:
          errorMessage =
            "Cannot delete product as it is referenced by other records.";
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

export const getTopProduct = async (sub_category_id) => {
  try {
    const url = `${URL}get-top-products`;
    const response = await axios.get(url, { params: { sub_category_id } });
    return response.data;
  } catch (error) {
    console.log("Error when get top product", error);
    throw new Error(error);
  }
};
