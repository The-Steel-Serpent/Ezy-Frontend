import { Button, notification } from "antd";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderCartSummary = () => {
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const discountPrice = useSelector((state) => state.cart.discountPrice);
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white rounded flex flex-col gap-4 p-7">
      <h1 className="text-2xl flex flex-col">
        Tóm Tắt Đơn Hàng
        <span className="text-sm text-neutral-400">
          Giá cuối cùng sẽ được xác nhận khi đặt hàng
        </span>
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between py-2 border-b-[1px]">
          <div className="font-semibold">Tổng Tiền Hàng</div>
          <div className="flex justify-center items-center font-semibold">
            <sup>đ</sup> {totalPrice?.toLocaleString("vi-VN") || 0}
          </div>
        </div>
        <div className="flex justify-between py-2 border-b-[1px]">
          <div className="font-semibold">Giảm Giá Sản Phẩm</div>
          <div className="flex justify-center items-center font-semibold text-red-700">
            -<sup>đ</sup> {discountPrice?.toLocaleString("vi-VN") || 0}
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-3">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Tiết Kiệm</div>
            <div className="flex justify-center items-center font-semibold text-yellow-600">
              <sup>đ</sup> {discountPrice?.toLocaleString("vi-VN") || 0}
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <div className="font-semibold flex flex-col ">
              Giá Ước Tính
              <span className="text-sm">({totalItems || 0} sản phẩm)</span>
            </div>
            <div className="flex justify-center items-center font-semibold text-primary text-2xl">
              <sup>đ</sup> {totalPrice?.toLocaleString("vi-VN") || 0}
            </div>
          </div>
        </div>
      </div>
      <Button
        size="large"
        className="bg-primary text-white hover:opacity-80"
        onClick={() => {
          if (totalPrice <= 0) {
            notification.warning({
              message: "Vui Lòng Chọn Sản Phẩm",
              showProgress: true,
              pauseOnHover: false,
            });
            return;
          }
          navigate("/cart/checkout");
        }}
      >
        Đặt Hàng
      </Button>
    </div>
  );
};

export default memo(OrderCartSummary);
