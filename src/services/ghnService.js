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
