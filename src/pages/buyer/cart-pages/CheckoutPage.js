import { Button, Steps } from "antd";
import React, { lazy, Suspense, useEffect, useReducer } from "react";
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
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.user_id !== "") {
      const userID = user?.user_id;
      dispatch(fetchCartData({ userID }));
    }
  }, [dispatch, user?.user_id]);
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setDefaultAddress":
          return { ...state, defaultAddress: action.payload };
        case "cartListWithoutInvalidItems":
          return { ...state, cartListWithoutInvalidItems: action.payload };
        case "openAddressModal":
          return { ...state, openAddressModal: action.payload };
        case "updateTotal":
          const existingShopIndex = state.total.findIndex(
            (total) => total.shop_id === action.payload.shop_id
          );
          let updatedTotal;
          if (existingShopIndex !== -1) {
            updatedTotal = [...state.total];
            updatedTotal[existingShopIndex] = action.payload;
          } else {
            updatedTotal = [...state.total, action.payload];
          }

          return { ...state, total: updatedTotal };

        case "updateTotalPayment": {
          return { ...state, totalPayment: action.payload };
        }
        default:
          return state;
      }
    },
    {
      defaultAddress: null,
      cartListWithoutInvalidItems: [],
      openAddressModal: false,
      total: [],
      totalPayment: {
        totalPrice: 0,
        shippingFee: 0,
        discountPrice: 0,
        discountShippingFee: 0,
        final: 0,
      },
    }
  );

  const {
    defaultAddress,
    openAddressModal,
    cartListWithoutInvalidItems,
    total,
    totalPayment,
  } = state;
  const handleCloseAddressModal = () => {
    setState({ type: "openAddressModal", payload: false });
  };
  const handleOpenAddressModal = () => {
    setState({ type: "openAddressModal", payload: true });
  };

  const handleUpdateTotal = (total) => {
    const {
      shop_id,
      totalPrice,
      shippingFee,
      discountPrice,
      discountShippingFee,
    } = total;
    setState({
      type: "updateTotal",
      payload: {
        shop_id,
        totalPrice,
        shippingFee,
        discountPrice,
        discountShippingFee,
      },
    });
  };

  const fetchDefaultAddress = async () => {
    try {
      const userID = user?.user_id;
      const res = await getDefaultAddress(userID);
      if (res.success) {
        setState({ type: "setDefaultAddress", payload: res.data });
      }
    } catch (error) {
      console.log("Lỗi khi lấy địa chỉ mặc định: ", error.message || error);
    }
  };
  useEffect(() => {
    if (user?.user_id !== "") {
      fetchDefaultAddress();
    }
  }, [user]);

  useEffect(() => {
    console.log(cart);
    if (cart.length > 0) {
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
    }
  }, [cart]);

  useEffect(() => {
    if (total.length > 0) {
      setState({
        type: "updateTotalPayment",
        payload: total.reduce(
          (acc, cur) => {
            return {
              totalPrice: acc.totalPrice + cur.totalPrice,
              shippingFee: acc.shippingFee + cur.shippingFee,
              discountPrice: acc.discountPrice + cur.discountPrice,
              discountShippingFee:
                acc.discountShippingFee + cur.discountShippingFee,
              final:
                acc.final +
                cur.totalPrice +
                cur.shippingFee -
                cur.discountPrice -
                cur.discountShippingFee,
            };
          },
          {
            totalPrice: 0,
            shippingFee: 0,
            discountPrice: 0,
            discountShippingFee: 0,
            final: 0,
          }
        ),
      });
    }
  }, [total]);

  useEffect(() => {
    console.log(totalPayment);
  }, [totalPayment]);
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
                  <VoucherSection total={totalPayment} cart={cart} />
                </Suspense>
              </section>
            </div>

            {/* Thanh toán */}
            <div className="grid grid-cols-12 col-span-12">
              <section className="col-span-12 px-[30px] py-6 bg-white">
                <Suspense>
                  <PaymentMethodSection total={totalPayment} />
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
        fetchDefaultAddress={fetchDefaultAddress}
      />
    </>
  );
};

export default CheckoutPage;
