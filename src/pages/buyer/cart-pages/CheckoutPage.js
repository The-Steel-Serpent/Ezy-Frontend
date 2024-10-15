import { Steps } from "antd";
import React from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";

const CheckoutPage = () => {
  return (
    <section className="max-w-[1200px] mx-auto py-5">
      <div className="grid grid-cols-12 gap-7">
        <section className="col-span-12">
          <Steps
            className="flex justify-center"
            items={[
              {
                title: <span className="text-lg font-semibold">Giỏ Hàng</span>,
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
      </div>
    </section>
  );
};

export default CheckoutPage;
