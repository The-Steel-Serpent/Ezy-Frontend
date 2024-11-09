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
    // throw new Error(error.message);
    return error;
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
    // throw new Error(error.message);
    return error;

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
    // throw new Error(error.message);
    return error;

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

export const createShopGHN = async (
  district_id,
  ward_code,
  name,
  phone,
  address
) => {
  const URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register";
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
        address,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Order
//Data khi tạo 1 order
// const fees = await Promise.all(
//   transportService.data.map(async (service) => {
//     const feeData = {
//       payment_type_id: 2,
//       note: "ĐƠN HÀNG TEST",
//       required_note: "KHONGCHOXEMHANG",
//       return_phone: item?.Shop?.phone_number,
//       return_address: item?.Shop?.shop_address,
//       return_district_id: item?.Shop?.district_id,
//       return_ward_code: item?.Shop?.ward_code,
//       client_order_code: "",
//       to_name: defaultAddress?.full_name,
//       to_phone: defaultAddress?.phone_number,
//       to_address: defaultAddress?.address,
//       to_ward_code: defaultAddress?.ward_code,
//       to_district_id: defaultAddress?.district_id,
//       cod_amount: 0,
//       content: "ABCDEF",
//       weight: sumWeight,
//       length: 0,
//       width: 0,
//       insurance_value: 0,
//       service_id: service?.service_id,
//       service_type_id: service?.service_type_id,
//       pick_station_id: 0,
//       pick_shift: [2],
//       items: item?.CartItems?.map((cartItem) => ({
//         name: cartItem?.ProductVarient?.Product?.product_name,
//         code: cartItem?.ProductVarient?.Product?.product_id + "",
//         quantity: cartItem?.quantity,
//         price: cartItem?.ProductVarient?.price,
//         length: 0,
//         width: 0,
//         height: 0,
//         category: {
//           level1:
//             cartItem?.ProductVarient?.Product?.SubCategory?.Category
//               ?.category_name,
//           level2:
//             cartItem?.ProductVarient?.Product?.SubCategory
//               ?.sub_category_name,
//         },
//       })),
//     };

export const createOrderGHN = async (shopId, data) => {
  const url =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";
  try {
    const res = await axios({
      method: "POST",
      url: url,
      headers: {
        Token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        ShopId: shopId,
        "Content-Type": "application/json",
      },
      data,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelOrderGHN = async (shopId, orderCode) => {
  try {
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel";
    const res = await axios({
      method: "POST",
      url: url,
      headers: {
        Token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        ShopId: shopId,
        "Content-Type": "application/json",
      },
      data: {
        order_code: orderCode,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const redeliverOrderGHN = async (shopId, orderCode) => {
  try {
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/storing";
    const res = await axios({
      method: "POST",
      url: url,
      headers: {
        Token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        ShopId: shopId,
        "Content-Type": "application/json",
      },
      data: {
        order_code: orderCode,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getOrderDetailGHN = async (orderCode) => {
  try {
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail";
    const res = await axios({
      method: "POST",
      url: url,
      headers: {
        Token: `${process.env.REACT_APP_GHV_KEY_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        order_code: orderCode,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
