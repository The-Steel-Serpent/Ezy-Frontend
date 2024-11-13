import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/return-request/`;

export const getReturnRequest = async (payload) => {
    console.log("checkkk Payload:", payload);
    try {
        const response = await axios.get(`${url}get-return-request`, { params: payload });
        return response.data;
    } catch (error) {
        console.log("Error when getReturnRequest", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
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

export const acceptReturnRequest = async (payload) => {
    try {
        const response = await axios.post(`${url}accept-return-request`, payload);
        return response.data;
    } catch (error) {
        console.log("Error when acceptReturnRequest", error);
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

export const getReturnOrder = async (user_order_id, shop_id) => {
    try {
        const response = await axios.get(`${url}get-return-order`, { params: { user_order_id, shop_id } });
        return response.data;
    } catch (error) {
        console.log("Error when getReturnOrder", error);
        let errorMessage;
        if (error.response) {
            switch (error.response.status) {
                case 400:
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