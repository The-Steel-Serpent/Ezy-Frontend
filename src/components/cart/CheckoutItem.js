import { Avatar, Input } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import CheckoutCartItem from "./CheckoutCartItem";
import { getServiceTypes, getShippingFee } from "../../services/ghnService";
import ModalShippingFees from "./ModalShippingFees";

const CheckoutItem = (props) => {
  const { item, defaultAddress, handleUpdateTotal } = props;

  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "defaultService":
          return { ...state, defaultService: action.payload };
        case "serviceList":
          return { ...state, serviceList: action.payload };
        case "totalPriceWithShipping":
          return { ...state, totalPriceWithShipping: action.payload };
        case "openModalShippingFees":
          return { ...state, openModalShippingFees: action.payload };
        default:
          return state;
      }
    },
    {
      defaultService: null,
      serviceList: [],
      totalPriceWithShipping: 0,
      openModalShippingFees: false,
    }
  );
  const {
    defaultService,
    serviceList,
    totalPriceWithShipping,
    openModalShippingFees,
  } = state;

  useEffect(() => {
    const serviceData = {
      shop_id: item?.Shop?.shop_id,
      from_district: item?.Shop?.district_id,
      to_district: defaultAddress?.district_id,
    };
    const fetchDefaultService = async () => {
      try {
        const transportService = await getServiceTypes(serviceData);
        if (transportService.code === 200) {
          const sumWeight = item?.CartItems?.reduce((sum, cartItem) => {
            return cartItem?.selected === 1
              ? sum + cartItem?.ProductVarient?.weight * cartItem?.quantity
              : sum;
          }, 0);
          if (sumWeight >= 20000) {
            transportService.data = transportService.data.filter(
              (service) => service.service_id === 100039
            );
          } else {
            transportService.data = transportService.data.filter(
              (service) => service.service_id !== 100039
            );
          }
          // console.log("transportService: ", transportService);
          const fees = await Promise.all(
            transportService.data.map(async (service) => {
              const feeData = {
                payment_type_id: 2,
                note: "ĐƠN HÀNG TEST",
                required_note: "KHONGCHOXEMHANG",
                return_phone: item?.Shop?.UserAccount?.phone_number,
                return_address: item?.Shop?.shop_address,
                return_district_id: item?.Shop?.district_id,
                return_ward_code: item?.Shop?.ward_code,
                client_order_code: "",
                to_name: defaultAddress?.full_name,
                to_phone: defaultAddress?.phone_number,
                to_address: defaultAddress?.address,
                to_ward_code: defaultAddress?.ward_code,
                to_district_id: defaultAddress?.district_id,
                cod_amount: 0,
                content: "ABCDEF",
                weight: sumWeight,
                length: 0,
                width: 0,
                insurance_value: item?.total_price,
                service_id: service?.service_id,
                service_type_id: service?.service_type_id,
                pick_station_id: 0,
                pick_shift: [2],
                items: item?.CartItems?.map((cartItem) => ({
                  name: cartItem?.ProductVarient?.Product?.product_name,
                  code: cartItem?.ProductVarient?.Product?.product_id + "",
                  quantity: cartItem?.quantity,
                  price: cartItem?.ProductVarient?.price,
                  length: 0,
                  width: 0,
                  height: 0,
                  category: {
                    level1:
                      cartItem?.ProductVarient?.Product?.SubCategory?.Category
                        ?.category_name,
                    level2:
                      cartItem?.ProductVarient?.Product?.SubCategory
                        ?.sub_category_name,
                  },
                })),
              };
              // console.log("feeData: ", feeData);
              const fee = await getShippingFee(item?.Shop?.shop_id, feeData);
              return {
                ...service,
                fee: fee.data,
              };
            })
          );
          const totalFees = fees.sort(
            (a, b) => b.fee.total_fee - a.fee.total_fee
          );
          setState({ type: "serviceList", payload: totalFees });
        }
      } catch (error) {
        console.log("Lỗi khi lấy dịch vụ mặc định: ", error.message || error);
      }
    };

    if (item?.Shop?.shop_id !== undefined && defaultAddress !== null) {
      fetchDefaultService();
    }
  }, [item?.Shop?.shop_id, defaultAddress, item]);

  useEffect(() => {
    if (serviceList.length > 0) {
      setState({ type: "defaultService", payload: serviceList[0] });
      setState({
        type: "totalPriceWithShipping",
        payload: item?.total_price + serviceList[0]?.fee?.total_fee,
      });
    }
  }, [serviceList, item]);

  useEffect(() => {
    if (defaultService !== null) {
      setState({
        type: "totalPriceWithShipping",
        payload: item?.total_price + defaultService?.fee?.total_fee,
      });
      const shippingFee = defaultService?.fee?.total_fee || 0;
      const totalPrice = item?.total_price || 0;
      const discountPrice = 0;
      const discountShippingFee = 0;

      handleUpdateTotal({
        shop_id: item?.Shop?.shop_id,
        totalPrice,
        shippingFee,
        discountPrice,
        discountShippingFee,
      });
    }
  }, [defaultService]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleOpenModalShippingFees = () => {
    setState({ type: "openModalShippingFees", payload: true });
  };
  const handleCancelModalShippingFees = () => {
    setState({ type: "openModalShippingFees", payload: false });
  };
  const handleSelectService = (service) => {
    setState({ type: "defaultService", payload: service });
    setState({
      type: "totalPriceWithShipping",
      payload: item?.total_price + service?.fee?.total_fee,
    });
    handleCancelModalShippingFees();
  };
  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div className="flex gap-2 justify-start px-[30px] items-center">
          <Avatar src={item?.Shop?.logo_url} size={40} />
          <span className="text-lg font-semibold">{item?.Shop?.shop_name}</span>
          <div className="size-5 fill-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {item?.CartItems?.map((cartItem) => (
            <CheckoutCartItem item={cartItem} />
          ))}
        </div>
        <div className="flex flex-col">
          <div className=" bg-third grid grid-cols-12 mt-5 border-y-2 border-slate-300 border-dashed">
            <div className="col-span-5 p-6 border-r-[2px] border-slate-300 border-dashed">
              <div className="flex gap-5 items-center">
                <span className="w-24">Lời nhắn: </span>
                <Input
                  className="w-full"
                  placeholder="Lưu ý cho Người bán..."
                />
              </div>
            </div>
            <div className="col-span-7 p-6 flex flex-col gap-2">
              <div className=" w-full flex justify-between">
                <span className="text-neutral-800 font-bold">
                  {" "}
                  Phí Vận chuyển (
                  {defaultService?.service_id === 53321
                    ? "Tiêu Chuẩn"
                    : defaultService?.service_id === 53320
                    ? "Hỏa Tốc"
                    : "Hàng Cồng Kềnh"}
                  ):
                  <span
                    className="ml-4 text-blue-500 cursor-pointer"
                    onClick={handleOpenModalShippingFees}
                  >
                    Thay Đổi
                  </span>
                </span>
                <span className="text-lg text-secondary font-bold">
                  <sup>đ</sup>{" "}
                  {defaultService?.fee?.total_fee?.toLocaleString("vi-VN")}
                </span>
              </div>
              <span className="text-neutral-500 font-semibold">
                Dự kiến giao hàng:{" "}
                {formatDate(defaultService?.fee?.expected_delivery_time)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 bg-third">
            <div className="col-span-12">
              <div className="flex justify-end items-center gap-3 p-6">
                <span className="text-neutral-600">
                  Tổng cộng ({item?.total_quantity} sản phẩm):
                </span>
                <span className="text-xl font-semibold text-primary">
                  <sup>₫</sup>
                  {totalPriceWithShipping?.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalShippingFees
        openModalShippingFees={openModalShippingFees}
        defaultService={defaultService}
        handleSelectService={handleSelectService}
        handleCancelModalShippingFees={handleCancelModalShippingFees}
        serviceList={serviceList}
      />
    </>
  );
};

export default memo(CheckoutItem);
