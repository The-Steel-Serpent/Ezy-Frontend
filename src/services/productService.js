import axios from "axios";
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
}


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
}

export const addProductVarient = async (payload) => {
    try {
        // check payload
        console.log("check payload product vairent:", payload);
        const url = URL + "add-product-varient";
        const res = await axios.post(url, payload);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        switch (error.status) {
            case 500:
                return { error: true, message: "Lỗi server" };
            default:
                return {
                    error: true, message: error.message || error
                };
        }
    }
}

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
}

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
}

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
}

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
}


export const getShopProducts = async (shop_id, product_status, page, limit) => {
    const payload = { shop_id, product_status, page, limit };
    try {
        const url = `${URL}shop-products-status`;
        const response = await axios.get(url, {
            params: payload
        });
        return response.data;
    } catch (error) {
        console.log("Lỗi khi lấy sản phẩm của shop: ", error);

        const errorMessage = error?.response?.status ?
            `Error ${error.response.status}: ${error.response.data}` :
            error.message;

        throw new Error(errorMessage);
    }
};

export const searchShopProducts = async (shop_id, product_status, product_name, sub_category_id, page, limit) => {
    const payload = { shop_id, product_status, product_name, sub_category_id, page, limit };
    try {
        const url = `${URL}search-shop-products`;
        const response = await axios.get(url, {
            params: payload
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
                    error: true, message: error.message || error
                };
        }
    }
}

export const updateProductStatus = async (product_id, update_status) => {
    const payload = {
        product_id,
        product_status: update_status
    };
    console.log("payload update status", payload);

    try {
        const url = `${URL}update-product-status`;
        const response = await axios.post(url, payload);  
        return response.data;
    } catch (error) {
        console.log("Lỗi khi cập nhật trạng thái sản phẩm: ", error);
        const errorMessage = error?.response?.status ?
            `Error ${error.response.status}: ${error.response.data}` :
            error.message;

        throw new Error(errorMessage);
    }
};
