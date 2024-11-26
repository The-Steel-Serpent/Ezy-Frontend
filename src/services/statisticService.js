import axios from 'axios';
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/statistical/`;

export const getBestSellerShop = async (shop_id) => {
    try {
        const response = await axios.get(`${URL}get-best-seller-shop`, {
            params: {
                shop_id,
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error getting best seller shop: ", error);
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

export const getOrderStatistics = async (shop_id) => {
    try {
        const response = await axios.get(`${URL}get-order-statistic`, {
            params: {
                shop_id,
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error getting order statistics: ", error);
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

export const getSalesRevenue = async (shop_id, start_date, end_date) => {
    console.log('Payload checkkkkkkkk:', shop_id, start_date, end_date);
    try {
        const url = `${URL}get-sales-revenue`;
        const res = await axios.get(url, {
            params: {
                shop_id,
                start_date,
                end_date
            },
        });
        return res.data;
    } catch (error) {
        console.log("Error getting sales revenue: ", error);    
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

export  const getTopSellerShops = async (start_date, end_date) => {
    try {
        const response = await axios.get(`${URL}get-top-shop-sales-revenue`, {
            params: {
                start_date,
                end_date
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error getting top seller shops: ", error);
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