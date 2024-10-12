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
        console.log("check payload:", payload);
        const url = URL + "add-product-varient";
        const res = await axios.post(url, payload);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        return { error: true, message: error.message || error };
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
