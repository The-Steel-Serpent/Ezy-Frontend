import React, { lazy, Suspense, useEffect } from "react";
import { Button, Empty, Skeleton, Steps, Typography } from "antd";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";

import ProductSuggestions from "../../../components/product/ProductSuggestions";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../../../redux/cartSlice";
import { FrownFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const CartCarousel = lazy(() =>
  import("../../../components/cart/CartCarousel")
);
const OrderCartSummary = lazy(() =>
  import("../../../components/cart/OrderCartSummary")
);
const CartPage = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
      const userID = user?.user_id;
      dispatch(await fetchCartData({ userID }));
    };
    if (user?.user_id !== "") {
      fetchCart();
    }
  }, [dispatch, user?.user_id]);
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
      ) : cart?.length > 0 ? (
        <section className="max-w-[1200px] mx-auto py-5 ">
          <div className=" grid grid-cols-12    gap-7">
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
                    title: <span className="text-lg">Thanh toán</span>,
                    icon: <MdOutlinePayment size={32} />,
                  },
                  {
                    title: <span className="text-lg">Đặt Hàng Thành Công</span>,
                    icon: <AiOutlineFileDone size={32} />,
                  },
                ]}
              />
            </section>
            <section className="col-span-8">
              <Suspense
                fallback={<Skeleton.Node active={true} className="w-full" />}
              >
                <CartCarousel />
              </Suspense>
            </section>
            <section className="col-span-4">
              <Suspense
                fallback={<Skeleton.Node active={true} className="w-full" />}
              >
                <OrderCartSummary />
              </Suspense>
            </section>
          </div>
          <div className="mt-6">
            <span className="text-xl text-neutral-500">
              Có Thể Bạn Cũng Thích
            </span>
            <ProductSuggestions />
          </div>
        </section>
      ) : (
        <Empty
          className="flex mt-6 justify-center items-center flex-col gap-3"
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 200 }}
          description={
            <Typography.Text className="text-2xl text-neutral-400">
              Không có sản phẩm trong giỏ hàng
            </Typography.Text>
          }
        >
          <Button
            size="large"
            className="bg-custom-gradient text-white border-white hover:opacity-80"
            onClick={() => window.location.replace("/categories/1")}
          >
            Mua Sắm Ngay
          </Button>
        </Empty>
      )}
    </>
  );
};

export default CartPage;
