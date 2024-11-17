import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/notifications/`;

export const createNotification = async (payload) => {
  try {
    const response = await axios.post(`${url}create-notification`, payload);
    return response.data;
  } catch (error) {
    console.log("Error when createNotification", error);
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
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
};

export const fetchNotifications = async (
  user_id,
  page = 1,
  limit = 6,
  type = ""
) => {
  try {
    const response = await axios.get(
      `${url}get-notifications?user_id=${user_id}&page=${page}&limit=${limit}&type=${type}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const markAsRead = async (user_id, type) => {
  try {
    const response = await axios.get(
      `${url}mark-as-read?user_id=${user_id}&type=${type}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const markNotificationAsRead = async (notification_id) => {
  try {
    const response = await axios.get(
      `${url}mark-notification-as-read?notification_id=${notification_id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
