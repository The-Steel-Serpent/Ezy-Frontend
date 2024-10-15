import axios from "axios";
import { th } from "date-fns/locale";

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
    switch (error?.response?.status) {
      case 404:
        return { error: true, message: "Không tìm thấy người dùng" };
      case 500:
        return { error: true, message: "Lỗi server" };

      default:
        return { error: true, message: error.message || error };
    }
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
