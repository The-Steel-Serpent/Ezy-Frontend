import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/request-support/`;

export const sendRequestSupport = async (user_id) => {
  try {
    const res = await axios.get(url + "send-request?user_id=" + user_id);
    return res.data;
  } catch (error) {
    console.error("Error sending support request:", error);
    throw new Error(error);
  }
};

export const getRequestById = async (request_support_id) => {
  try {
    const res = await axios.get(
      url + "getRequestById?request_support_id=" + request_support_id
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching support request:", error);
    throw new Error(error);
  }
};

export const acceptRequest = async (request_support_id, user_id) => {
  try {
    const res = await axios.get(
      `${url}accept-request?request_support_id=${request_support_id}&user_id=${user_id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error accepting support request:", error);
    throw new Error(error);
  }
};

export const closeRequest = async (request_support_id) => {
  try {
    const res = await axios.get(
      url + "close-request?request_support_id=" + request_support_id
    );
    return res.data;
  } catch (error) {
    console.error("Error closing support request:", error);
    throw new Error(error);
  }
};
