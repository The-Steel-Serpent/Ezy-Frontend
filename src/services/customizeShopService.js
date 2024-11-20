import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/customize-shop`;

export const getCustomizeShop = async (shop_id) => {
    try {
        const url = URL + `/get-customize-shop`;
        const res = await axios.get(url, { params: { shop_id } });
        return res.data;
    } catch (error) {
        console.log("Error when fetching customize shop:",error);
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

export const createCustomize = async (payload) => {
    try {
        const url = URL + `/create-customize-shop`;
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        console.log("Error when creating customize shop:",error);
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

export const addImageCustom = async (payload) => {
    try {
        const url = URL + `/add-images-customize-shop`;
        const res = await axios.post(url, payload);
        return res.data
    } catch (error) {
        console.log("Error when adding image to customize shop:",error);
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
export const deleteImageCustom = async (payload) => {
    try {
        const url = URL + `/delete-images-customize-shop`;
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        console.log("Error when deleting image from customize shop:",error);    
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
    }
}

export const deleteCustomizeShop = async (customize_shop_id) => {
    try {
        const url = URL + `/delete-customize-shop`;
        const res = await axios.post(url, customize_shop_id );
        return res.data;
    } catch (error) {
        console.log("Error when deleting customize shop:",error);
        let errorMessage;
        if(error.response) {
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