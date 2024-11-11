import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/return-request/`;

export const getReturnRequest = async (shop_id, return_type_id) => {
    console.log("check input", shop_id, return_type_id);
    try {
        const response = await axios.get(`${url}get-return-request?shop_id=${shop_id}&return_type_id=${return_type_id}`);
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