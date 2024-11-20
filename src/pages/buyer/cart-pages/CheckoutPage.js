/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Steps } from "antd";
import React, { lazy, Suspense, useEffect, useReducer, useRef } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getDefaultAddress } from "../../../services/addressService";
import ModalAddressList from "../../../components/address/ModalAddressList";
import { fetchCartData } from "../../../redux/cartSlice";
import { FrownFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../../providers/CheckoutProvider";
import { getVoucherList } from "../../../services/voucherService";
import ModalOTP from "../../../components/user/ModalOTP";

const CheckoutItem = lazy(() =>
  import("../../../components/cart/CheckoutItem")
);
const VoucherSection = lazy(() =>
  import("../../../components/cart/VoucherSection")
);

const PaymentMethodSection = lazy(() =>
  import("../../../components/cart/PaymentMethodSection")
);

const CheckoutPage = () => {
  const {
    state,
    setState,
    handleCloseAddressModal,
    handleOpenAddressModal,
    handleUpdateTotal,
    handleUpdateTotalPayment,
    calculateVoucherDiscounts,
  } = useCheckout();

  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const userID = user?.user_id;
      setState({ type: "loading", payload: true });
      dispatch(fetchCartData({ userID }));
      setState({ type: "loading", payload: false });
    };
    if (user?.user_id !== "") {
      fetchCart();
    }
  }, [dispatch, user?.user_id]);

  const {
    shippingVourcher,
    discountVoucher,
    defaultAddress,
    openAddressModal,
    cartListWithoutInvalidItems,
    total,
    totalPayment,
    selectedVoucher,
  } = state;
  const fetchDefaultAddress = async (userID) => {
    try {
      setState({ type: "loading", payload: true });

      const res = await getDefaultAddress(userID);
      if (res.success) {
        setState({ type: "setDefaultAddress", payload: res.data });
      }
    } catch (error) {
      console.log("Lỗi khi lấy địa chỉ mặc định: ", error.message || error);
    } finally {
      setState({ type: "isFetchingAddress", payload: true });
      setState({ type: "loading", payload: false });
    }
  };

  useEffect(() => {
    const fetchVoucher = async () => {
      setState({ type: "loading", payload: true });
      try {
        const reqData = {
          user_id: user.user_id,
          totalPayment: state.totalPayment,
          cart: cart,
        };
        const res = await getVoucherList(reqData);
        if (res.success) {
          const { voucherDiscount, voucherFreeShip } = res.data;

          const findFirstValidShippingVoucher = voucherFreeShip?.find(
            (item) => item.isVoucherValid === true
          );
          const findFirstValidDiscountVoucher = voucherDiscount?.find(
            (item) => item.isVoucherValid === true
          );

          setState({
            type: "updateSelectedVoucher",
            payload: {
              discountVoucher: findFirstValidDiscountVoucher,
              shippingVoucher: findFirstValidShippingVoucher,
            },
          });
          setState({ type: "loading", payload: false });
        }
      } catch (error) {
        setState({
          type: "shippingVoucher",
          payload: [],
        });
        setState({
          type: "discountVoucher",
          payload: [],
        });
        setState({ type: "loading", payload: false });
      }
    };
    if (
      user?.user_id &&
      user?.user_id !== "" &&
      cart.length > 0 &&
      state.isUpdatedTotalPayment
    ) {
      fetchVoucher();
    }
  }, [user?.user_id, cart, state.isUpdatedTotalPayment]);

  useEffect(() => {
    if (user?.user_id && user?.user_id !== "") {
      const userID = user?.user_id;

      fetchDefaultAddress(userID);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (cart.length > 0) {
      setState({ type: "loading", payload: true });
      const cartValid = cart
        .filter((shop) => shop.selected === 1)
        .map((shop) => {
          if (shop.selected === 1) {
            const filteredItems = shop.CartItems.filter(
              (item) => item.selected === 1
            );
            return {
              ...shop,
              CartItems: filteredItems,
            };
          }
          return shop;
        })
        .filter((shop) => shop.CartItems.length > 0);

      setState({
        type: "cartListWithoutInvalidItems",
        payload: cartValid,
      });
      setState({ type: "loading", payload: true });
    }
  }, [cart]);

  useEffect(() => {
    if (defaultAddress === null && state.isFetchingAddress === true) {
      console.log("Chưa có địa chỉ mặc định");
      handleOpenAddressModal();
    }
  }, [defaultAddress, state.isFetchingAddress]);

  return (
    <>
      {user?.user_id === "" ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <FrownFilled className="text-6xl text-red-500" />
            <span className="text-2xl">Bạn chưa đăng nhập</span>
            <Button
              className="bg-primary border-primary text-white hover:opacity-80"
              onClick={() => navigate("/buyer/login")}
            >
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      ) : (
        <section className="max-w-[1200px] mx-auto py-5">
          <div className="grid grid-cols-12 gap-7">
            {/* Steps */}
            <section className="col-span-12">
              <Steps
                current={1}
                className="flex justify-center"
                items={[
                  {
                    title: (
                      <span className="text-lg font-semibold">Giỏ Hàng</span>
                    ),
                    icon: <LuShoppingBag size={32} />,
                  },
                  {
                    title: (
                      <span className="text-lg font-semibold">Thanh toán</span>
                    ),
                    icon: <MdOutlinePayment size={32} />,
                    status: "process",
                  },
                  {
                    title: <span className="text-lg">Đặt Hàng Thành Công</span>,
                    icon: <AiOutlineFileDone size={32} />,
                  },
                ]}
              />
            </section>
            {/* Địa chỉ */}
            <section className="col-span-12 px-[30px] py-6 bg-white flex flex-col gap-3 relative">
              <div
                className="top-0 absolute w-full h-[3px] -left-[1px]"
                style={{
                  backgroundSize: "116px 3px",
                  backgroundPositionX: "-30px",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)",
                }}
              ></div>
              <span className="text-primary">
                <span className="text-xl font-semibold flex items-center gap-3">
                  <FaLocationDot size={20} />
                  Địa Chỉ Nhận Hàng
                </span>
              </span>
              <div className="flex justify-start items-center gap-4 text-lg">
                <span className=" font-bold">
                  {defaultAddress?.full_name} - {defaultAddress?.phone_number}
                </span>
                <span className="max-w-[700px] text-ellipsis break-words">
                  {defaultAddress?.address}
                </span>
                <span className="px-2 py-1 border-primary border-[1px] text-sm text-primary">
                  {defaultAddress?.isDefault ? "Mặc Định" : ""}
                </span>
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={handleOpenAddressModal}
                >
                  Thay đổi
                </span>
              </div>
            </section>

            {/* Sản phẩm */}
            <div className="grid grid-cols-12 col-span-12">
              <section className="col-span-12 px-[30px] py-6 bg-white">
                <span className="font-bold text-lg">Sản Phẩm</span>
              </section>
              {cartListWithoutInvalidItems?.map((shop) => (
                <Suspense>
                  <section className="col-span-12  pt-6 bg-white mb-5">
                    <CheckoutItem
                      item={shop}
                      defaultAddress={defaultAddress}
                      handleUpdateTotal={handleUpdateTotal}
                    />
                  </section>
                </Suspense>
              ))}
            </div>

            {/* Voucher */}
            <div className="grid grid-cols-12 col-span-12">
              <section className="col-span-12 px-[30px] py-6 bg-white">
                <Suspense>
                  <VoucherSection
                    total={totalPayment}
                    cart={cartListWithoutInvalidItems}
                  />
                </Suspense>
              </section>
            </div>

            {/* Thanh toán */}
            <div className="grid grid-cols-12 col-span-12">
              <section className="col-span-12 px-[30px] py-6 bg-white">
                <Suspense>
                  <PaymentMethodSection
                    loading={state.loading}
                    total={totalPayment}
                  />
                </Suspense>
              </section>
            </div>
          </div>
        </section>
      )}

      <ModalAddressList
        openAddressModal={openAddressModal}
        handleCloseAddressModal={handleCloseAddressModal}
        currentAddress={defaultAddress}
        fetchDefaultAddress={() => fetchDefaultAddress(user?.user_id)}
      />
    </>
  );
};

export default CheckoutPage;
