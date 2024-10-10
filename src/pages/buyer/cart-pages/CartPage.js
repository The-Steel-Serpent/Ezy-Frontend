import React from "react";
import CartCarousel from "../../../components/cart/CartCarousel";
import { Steps } from "antd";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";

import OrderCartSummary from "../../../components/cart/OrderCartSummary";
import ProductSuggestions from "../../../components/product/ProductSuggestions";
const CartPage = () => {
  return (
    <section className="max-w-[1200px] mx-auto py-5 ">
      <div className=" grid grid-cols-12    gap-7">
        <section className="col-span-12">
          <Steps
            className="flex justify-center"
            items={[
              {
                title: <span className="text-lg font-semibold">Giỏ Hàng</span>,
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
          <CartCarousel />
        </section>
        <section className="col-span-4">
          <OrderCartSummary />
        </section>
      </div>
      <div className="mt-6">
        <span className="text-xl text-neutral-500">Có Thể Bạn Cũng Thích</span>
        <ProductSuggestions />
      </div>
    </section>
  );
};

export default CartPage;
