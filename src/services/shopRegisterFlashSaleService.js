import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/shop-register-flash-sales`;


export const getProductShopRegisterFlashSales = async (payload) => {
    console.log("checkkkkkkkkpayload", payload);
    try {
        const url = URL + `/get-product`;
        const res = await axios.get(url, { params: payload });
        return res.data;
    } catch (error) {
        console.log("Error in getProductShopRegisterFlashSales", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 404:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage = error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return { success: false, message: errorMessage, status: error.response?.status || 0 };
    }
}

export const registerProductToFlashSale = async (payload) => {
    try {
        const url = URL + `/register-product`;
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        console.log("Error in registerProductToFlashSale", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 404:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage = error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return { success: false, message: errorMessage, status: error.response?.status || 0 };
    }
}

export const unsubscribeFlashSale = async (payload) => {
    try {
        const url = URL + `/unsubscribe-product`;
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        console.log("Error in unsubscribeFlashSale", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data.message;
                    break;
                case 404:
                    errorMessage = error.response.data.message;
                    break;
                case 500:
                    errorMessage = "Server error.";
                    break;
                default:
                    errorMessage = error.response.data.message || "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error or server is unreachable.";
        }
        return { success: false, message: errorMessage, status: error.response?.status || 0 };
    }
}