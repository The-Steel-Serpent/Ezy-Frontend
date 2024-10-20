import { Steps } from "antd";
import React, { lazy, Suspense, useEffect, useReducer } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getDefaultAddress } from "../../../services/addressService";
import ModalAddressList from "../../../components/address/ModalAddressList";
import { fetchCartData } from "../../../redux/cartSlice";
const CheckoutItem = lazy(() =>
  import("../../../components/cart/CheckoutItem")
);
const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
        default:
          return state;
      }
    },
    {
      defaultAddress: null,
      cartListWithoutInvalidItems: [],
      openAddressModal: false,
    }
  );

  const { defaultAddress, openAddressModal, cartListWithoutInvalidItems } =
    state;
  const handleCloseAddressModal = () => {
    setState({ type: "openAddressModal", payload: false });
  };
  const handleOpenAddressModal = () => {
    setState({ type: "openAddressModal", payload: true });
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

  return (
    <>
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
          <div className="grid grid-cols-12 col-span-12">
            <section className="col-span-12 px-[30px] py-6 bg-white">
              <span className="font-bold text-lg">Sản Phẩm</span>
            </section>
            {cartListWithoutInvalidItems?.map((shop) => (
              <Suspense>
                <section className="col-span-12  pt-6 bg-white mb-5">
                  <CheckoutItem item={shop} defaultAddress={defaultAddress} />
                </section>
              </Suspense>
            ))}
          </div>
        </div>
      </section>
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
