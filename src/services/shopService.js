import axios from "axios";
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/`;

export const updateShopProfile = async (
    payload
) => {
    const payloadUpdate = {
        shop_id: payload.shop_id,
        shop_name: payload.shop_name,
        logo_url: payload.logo_url,
        shop_description: payload.shop_description,
        business_style_id: payload.business_style_id,
        tax_code: payload.tax_code,
        business_email: payload.business_email,
        province_id: payload.province_id,
        district_id: payload.district_id,
        ward_code: payload.ward_code,
        shop_address: payload.shop_address,
        citizen_number: payload.citizen_number,
        full_name: payload.full_name,
        phone_number: payload.phone_number,
    };
    console.log("check update shop profile payload", payloadUpdate);
    try {
        const url = `${URL}update-shop-profile`;
        const response = await axios.post(url, payloadUpdate);
        return response.data;
    } catch (error) {
        console.log("Lỗi khi cập nhật thông tin shop: ", error);
        const errorMessage = error?.response?.status ?
            `Error ${error.response.status}: ${error.response.data}` :
            error.message;

        throw new Error(errorMessage);
    }

}