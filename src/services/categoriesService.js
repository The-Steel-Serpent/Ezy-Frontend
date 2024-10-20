import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/`;

export const getCategoriesByShop = async (shop_id) => {
    try {
        const url = URL + "shop-categories";
        const res = await axios.get(url, { params: { shop_id } });
        return res.data;
    } catch (error) {
        const errorMessage = error?.response?.status ?
            `Error ${error.response.status}: ${error.response.data}` :
            error.message;

        throw new Error(errorMessage);
    }
}

