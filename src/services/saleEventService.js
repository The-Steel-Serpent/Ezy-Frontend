import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/sale-events`;


export const getSuggestSaleEventsForShop = async (payload) => {
    try {
        const url = URL + `/get-suggest-sale-events-shop`;
        const res = await axios.get(url, { params: payload });
        return res.data;
    } catch (error) {
        console.log("Error in suggestSaleEventsForShop", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
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

export const shopRegisterSaleEvent = async (payload) => {
    try {
        const url = URL + `/shop-register-sale-event`;
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        console.log("Error in shopRegisterSaleEvent", error);
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

export const unSubscribeSaleEvent = async (payload) => {
    try {
        const url = URL + `/unsubscribe-sale-event`;
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        console.log("Error in unSubscribeSaleEvent", error);
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

export const getProductsRegistedEvent = async (shop_id) => {
    try {
        const url = URL + `/get-products-registed`;
        const res = await axios.get(url, { params: { shop_id } });
        return res.data;
    } catch (error) {
        console.log("Error in getProductsRegistedByCategory", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
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

export const checkShopRegistedEvent = async (payload) => {
    console.log("Check payload", payload);
    try {
        const url = URL + `/check-shop-registed`;
        const response = await axios.get(url, {
            params: payload
        });
        return response.data;
    } catch (error) {
        console.log("Error in checkShopRegistedEvent", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
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

