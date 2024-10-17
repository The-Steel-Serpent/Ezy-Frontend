import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/address`;

export const getAddresses = async (userID) => {
  try {
    const response = await axios.get(`${url}/get-address?user_id=${userID}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ: ", error);
    let errorMessage;
    switch (error?.response?.status) {
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

export const addAddress = async (userID, payload) => {
  try {
    const {
      full_name,
      phone_number,
      province_id,
      district_id,
      ward_code,
      address,
      isDefault,
    } = payload;
    const response = await axios.post(`${url}/add-address`, {
      user_id: userID,
      full_name,
      phone_number,
      province_id,
      district_id,
      ward_code,
      address,
      isDefault,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 404:
        errorMessage = "Không tìm thấy người dùng";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};
export const updateAddress = async (userID, payload) => {
  try {
    const {
      user_address_id,
      full_name,
      phone_number,
      province_id,
      district_id,
      ward_code,
      address,
      isDefault,
    } = payload;
    const response = await axios.post(`${url}/update-address`, {
      user_id: userID,
      user_address_id,
      full_name,
      phone_number,
      province_id,
      district_id,
      ward_code,
      address,
      isDefault,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 404:
        errorMessage = "Không tìm thấy địa chỉ";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const deleteAddress = async (user_address_id) => {
  try {
    const response = await axios.post(`${url}/remove-address`, {
      user_address_id,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 404:
        errorMessage = "Không tìm thấy địa chỉ";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};

export const setDefaultAddress = async (user_id, user_address_id) => {
  try {
    const response = await axios.post(`${url}/set-default-address`, {
      user_id,
      user_address_id,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đặt địa chỉ mặc định: ", error);
    let errorMessage;
    switch (error?.response?.status) {
      case 500:
        errorMessage = "Lỗi server";
        break;
      case 404:
        errorMessage = "Không tìm thấy địa chỉ";
        break;
      default:
        errorMessage = error.message || error;
        break;
    }
    throw new Error(errorMessage);
  }
};
