import axios from "axios";
import { ca } from "date-fns/locale";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/violations`;

export const getViolationTypes = async (type) => {
  try {
    const urlStr = `${url}/get-violation-types?type=${type}`;
    const res = await axios.get(urlStr);
    return res.data;
  } catch (error) {
    console.error("Error fetching violation types:", error);
    throw new Error(error);
  }
};

export const sendViolation = async (data) => {
  try {
    const res = await axios.post(`${url}/send-violation`, data);
    return res.data;
  } catch (error) {
    console.error("Error sending violation:", error);
    throw new Error(error);
  }
};
