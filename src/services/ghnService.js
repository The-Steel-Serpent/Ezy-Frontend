import { RedditSquareFilled } from "@ant-design/icons";
import axios from "axios";

export const getProvinces = async () => {
  const URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
  try {
    const res = await axios({
      method: "GET",
      url: URL,
      headers: {
        token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
      },
    });
    // console.log("Fetch provinces successfully:", res.data);
    return res.data;
  } catch (error) {
    console.log("Error fetch provinces:", error);
    throw new Error(error.message);
  }
};
export const getDistricts = async (ProvinceID) => {
  const URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district";
  try {
    const res = await axios({
      method: "GET",
      url: URL,
      headers: {
        token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
      },
      params: {
        province_id: ProvinceID,
      },
    });
    return res.data;
  } catch (error) {
    // console.log("Error fetch DISTRICTS:", error);
    throw new Error(error.message);
  }
};

export const getWards = async (DistrictID) => {
  const URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward";
  try {
    const res = await axios({
      method: "GET",
      url: URL,
      headers: {
        token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
      },
      params: {
        district_id: DistrictID,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getServiceTypes = async (data) => {
  const { shop_id, from_district, to_district } = data;
  const URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
  try {
    const res = await axios({
      method: "POST",
      url: URL,
      headers: {
        token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        shop_id,
        from_district,
        to_district,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getShippingFee = async (shopID, data) => {
  const URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview";

  try {
    const res = await axios({
      method: "POST",
      url: URL,
      headers: {
        Token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        ShopId: shopID,
      },
      data,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const createShopGHN = async(district_id, ward_code, name, phone, address) => {
  const URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register";
  try {
    const res = await axios({
      method: "POST",
      url: URL,
      headers: {
        token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        district_id,
        ward_code,
        name,
        phone,
        address
      }
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
}