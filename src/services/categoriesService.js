import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/`;

export const getCategoriesByShop = async (shop_id) => {
  try {
    const url = URL + "shop-categories";
    const res = await axios.get(url, { params: { shop_id } });
    return res.data;
  } catch (error) {
    const errorMessage = error?.response?.status
      ? `Error ${error.response.status}: ${error.response.data}`
      : error.message;

    throw new Error(errorMessage);
  }
};

export const getSubCategoriesByID = async (sub_category_id) => {
  try {
    const url = URL + `get-sub-categories/${sub_category_id}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    const errorMessage = error?.response?.status
      ? `Error ${error.response.status}: ${error.response.data}`
      : error.message;

    throw new Error(errorMessage);
  }
};

export const getAllCategoriesWithSubCategories = async () => {
  try {
    const url = URL + "categories-sub";
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    const errorMessage = error?.response?.status
      ? `Error ${error.response.status}: ${error.response.data}`
      : error.message;
    throw new Error(errorMessage);
  }
};

export const getTopSubCategories = async (page, limit) => {
  try {
    const url = URL + `get-top-categories?page=${page}&limit=${limit}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
