import axios from "axios";
import { th } from "date-fns/locale";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const updateProfile = async (userID, updateData) => {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/update-profile`;
    const { fullName, phoneNumber, gender, dob, avt_url } = updateData;
    const response = await axios.post(url, {
      user_id: userID,
      full_name: fullName,
      phone_number: phoneNumber,
      gender,
      dob,
      avt_url,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage;
    switch (error?.response?.status) {
      case 404:
        errorMessage = "Không tìm thấy người dùng";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const registerOTP = async (userID, otp) => {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/register-otp`;
    const response = await axios.post(url, {
      user_id: userID,
      otp,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage;
    switch (error?.response?.status) {
      case 404:
        errorMessage = "Không tìm thấy người dùng";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const verifyOTP = async (userID, otp) => {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/check-otp`;
    const response = await axios.post(url, {
      user_id: userID,
      otp,
    });
    return response.data;
  } catch (error) {
    console.log(error?.response?.status);
    let errorMessage;
    switch (error?.response?.status) {
      case 404:
        errorMessage = "Không tìm thấy người dùng";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 400:
        errorMessage = "Mật Khẩu Cấp 2 Không Chính Xác";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const checkEmailExists = async (email) => {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/check-email?email=${email}`;
    const response = await axios.get(url);
    if (response.data.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    if (error?.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

export const updateEmail = async (userID, email) => {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/update-email`;
    const response = await axios.post(url, {
      user_id: userID,
      email,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    let errorMessage;
    switch (error?.response?.status) {
      case 404:
        errorMessage = "Không tìm thấy người dùng";
        break;
      case 500:
        errorMessage = "Lỗi server";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const logOut = async (userId) => {
  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
    const res = await axios.post(
      URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      return true;
    }
  } catch (error) {
    let errorMessage;
    switch (error.response.data.code) {
      case "auth/id-token-expired":
        errorMessage = "Phiên Đăng nhập đã hết hạn";
        break;
      default:
        errorMessage = "Đã có lỗi xảy ra, Vui lòng thử lại sau";
        break;
    }
    throw new Error(errorMessage);
  }
};
